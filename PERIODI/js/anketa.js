// Modul za AI anketu
class Anketa {
    constructor(tracker) {
        this.tracker = tracker;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.groqApiKey = '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';
        this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'llama-3.1-8b-instant';
        this.temperature = 0.7;
        this.lastSurveyDate = null;
    }
    
    async startDailySurvey(force = false) {
        const today = new Date().toISOString().split('T')[0];
        const lastSurvey = localStorage.getItem('periodi_lastSurveyDate');
        
        if (!force && lastSurvey === today) {
            return; // Anketa je već popunjena danas
        }
        
        // Resetuj anketu
        this.currentQuestionIndex = 0;
        this.answers = {};
        
        // Resetuj event listener atribut
        const submitBtn = document.getElementById('submitSurvey');
        if (submitBtn) {
            submitBtn.removeAttribute('data-listener-attached');
        }
        
        // Generiši pitanja
        await this.generateSurveyQuestions();
        
        // Prikaži modal
        if (this.currentQuestions.length > 0) {
            this.tracker.openModal('surveyModal');
            this.displayCurrentQuestion();
        }
    }
    
    async generateSurveyQuestions() {
        try {
            const cycleDay = this.tracker.getCurrentCycleDay();
            const cyclePhase = this.tracker.getCyclePhase(cycleDay);
            
            const prompt = `Generiši 5 pitanja na srpskom jeziku (ekavski dijalekt, latinica) za dnevnu anketu o menstrualnom ciklusu. 
Korisnica je trenutno u ${cyclePhase ? cyclePhase.name : 'početnoj'} fazi ciklusa, ${cycleDay || 1}. dan.
Pitanja moraju biti:
- Na srpskom jeziku (ekavski dijalekt, latinica)
- U drugom licu jednine (ti, tebe, tvoj)
- Upućena ženskoj osobi
- Bez ijekavice (koristi lepo, deo, mleko, srećan, želeo, hteo)
- Bez engleskih reči
- Relevantna za fazu ciklusa

Vrati JSON format:
{
  "questions": [
    {
      "type": "scale",
      "question": "Pitanje na srpskom",
      "min": 1,
      "max": 10
    },
    {
      "type": "checkbox",
      "question": "Pitanje na srpskom",
      "options": ["Opcija 1", "Opcija 2", "Opcija 3"]
    },
    {
      "type": "radio",
      "question": "Pitanje na srpskom",
      "options": ["Opcija 1", "Opcija 2", "Opcija 3"]
    }
  ]
}

Tipovi pitanja: "scale" (skala 1-10), "checkbox" (više izbora), "radio" (jedan izbor).`;

            const response = await fetch(this.groqApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.groqApiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Ti si asistent koji generiše pitanja za dnevnu anketu o menstrualnom ciklusu. Sve odgovore daješ na srpskom jeziku (ekavski dijalekt, latinica).'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: this.temperature,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) {
                throw new Error('API greška');
            }
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // Pokušaj da parsiraš JSON iz odgovora
            let jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.questions && Array.isArray(parsed.questions)) {
                    this.currentQuestions = parsed.questions.slice(0, 5);
                    // Validacija i ispravljanje gramatike
                    this.currentQuestions = this.currentQuestions.map(q => ({
                        ...q,
                        question: this.tracker.fixGrammarErrors(q.question)
                    }));
                    return;
                }
            }
            
            throw new Error('Nevalidan format odgovora');
        } catch (error) {
            console.error('Greška pri generisanju pitanja:', error);
            // Fallback na podrazumevana pitanja
            this.currentQuestions = this.getDefaultSerbianQuestions();
        }
    }
    
    getDefaultSerbianQuestions() {
        const cycleDay = this.tracker.getCurrentCycleDay();
        const cyclePhase = this.tracker.getCyclePhase(cycleDay);
        
        return [
            {
                type: 'scale',
                question: `Kako ocenjuješ svoju energiju danas? (1 = vrlo niska, 10 = vrlo visoka)`,
                min: 1,
                max: 10
            },
            {
                type: 'scale',
                question: 'Kako se osećaš danas? (1 = vrlo loše, 10 = odlično)',
                min: 1,
                max: 10
            },
            {
                type: 'scale',
                question: 'Koliko boli osećaš? (1 = nema boli, 10 = jaka bol)',
                min: 1,
                max: 10
            },
            {
                type: 'checkbox',
                question: 'Koje dodatne simptome osećaš danas?',
                options: ['Glavobolja', 'Grčevi', 'Nadutost', 'Osetljivost grudi', 'Umor', 'Akne']
            },
            {
                type: 'radio',
                question: 'Kako bi opisala svoj danasnji dan?',
                options: ['Odličan', 'Dobar', 'Prosečan', 'Loš', 'Vrlo loš']
            }
        ];
    }
    
    displayCurrentQuestion() {
        if (this.currentQuestions.length === 0) return;
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        const questionEl = document.getElementById('surveyQuestion');
        const answersEl = document.getElementById('surveyAnswers');
        const nextBtn = document.getElementById('nextSurveyQuestion');
        const prevBtn = document.getElementById('prevSurveyQuestion');
        const submitBtn = document.getElementById('submitSurvey');
        const progressFill = document.getElementById('surveyProgressFill');
        const progressText = document.getElementById('surveyProgressText');
        
        if (!questionEl || !answersEl) return;
        
        // Ažuriraj progress
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Pitanje ${this.currentQuestionIndex + 1} od ${this.currentQuestions.length}`;
        
        // Prikaži pitanje
        questionEl.textContent = question.question;
        
        // Prikaži odgovore
        answersEl.innerHTML = '';
        
        if (question.type === 'scale') {
            const scaleContainer = document.createElement('div');
            scaleContainer.style.display = 'flex';
            scaleContainer.style.flexDirection = 'column';
            scaleContainer.style.gap = '1rem';
            
            const rangeInput = document.createElement('input');
            rangeInput.type = 'range';
            rangeInput.min = question.min || 1;
            rangeInput.max = question.max || 10;
            rangeInput.value = this.answers[this.currentQuestionIndex] || Math.floor((question.min + question.max) / 2);
            rangeInput.className = 'range-input';
            rangeInput.style.width = '100%';
            
            const valueDisplay = document.createElement('div');
            valueDisplay.style.textAlign = 'center';
            valueDisplay.style.fontSize = '1.5rem';
            valueDisplay.style.fontWeight = '600';
            valueDisplay.style.color = 'var(--accent-primary)';
            valueDisplay.textContent = rangeInput.value;
            
            rangeInput.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
                this.answers[this.currentQuestionIndex] = parseInt(e.target.value);
            });
            
            scaleContainer.appendChild(valueDisplay);
            scaleContainer.appendChild(rangeInput);
            
            const labels = document.createElement('div');
            labels.style.display = 'flex';
            labels.style.justifyContent = 'space-between';
            labels.style.fontSize = '0.85rem';
            labels.style.color = 'var(--text-secondary)';
            labels.innerHTML = `<span>${question.min || 1}</span><span>${question.max || 10}</span>`;
            scaleContainer.appendChild(labels);
            
            answersEl.appendChild(scaleContainer);
            
            // Sačuvaj početnu vrednost
            this.answers[this.currentQuestionIndex] = parseInt(rangeInput.value);
        } else if (question.type === 'checkbox' || question.type === 'radio') {
            question.options.forEach((option, index) => {
                const answerItem = document.createElement('div');
                answerItem.className = 'survey-answer-item';
                
                const input = document.createElement('input');
                input.type = question.type;
                input.name = `question_${this.currentQuestionIndex}`;
                input.value = option;
                input.id = `answer_${this.currentQuestionIndex}_${index}`;
                
                const label = document.createElement('label');
                label.htmlFor = `answer_${this.currentQuestionIndex}_${index}`;
                label.textContent = option;
                label.style.cursor = 'pointer';
                label.style.marginLeft = '0.5rem';
                
                answerItem.appendChild(input);
                answerItem.appendChild(label);
                
                // Event listener
                input.addEventListener('change', () => {
                    if (question.type === 'checkbox') {
                        if (!this.answers[this.currentQuestionIndex]) {
                            this.answers[this.currentQuestionIndex] = [];
                        }
                        if (input.checked) {
                            this.answers[this.currentQuestionIndex].push(option);
                        } else {
                            this.answers[this.currentQuestionIndex] = this.answers[this.currentQuestionIndex].filter(v => v !== option);
                        }
                    } else {
                        this.answers[this.currentQuestionIndex] = option;
                    }
                });
                
                answerItem.addEventListener('click', (e) => {
                    if (e.target !== input) {
                        input.click();
                    }
                });
                
                answersEl.appendChild(answerItem);
            });
        }
        
        // Ažuriraj dugmad
        if (prevBtn) {
            prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = this.currentQuestionIndex < this.currentQuestions.length - 1 ? 'block' : 'none';
        }
        
        if (submitBtn) {
            const isLastQuestion = this.currentQuestionIndex === this.currentQuestions.length - 1;
            submitBtn.style.display = isLastQuestion ? 'block' : 'none';
            
            // Postavi event listener direktno na dugme ako je poslednje pitanje
            if (isLastQuestion) {
                // Ukloni stare event listenere
                const oldSubmitBtn = submitBtn;
                const newSubmitBtn = oldSubmitBtn.cloneNode(true);
                oldSubmitBtn.parentNode.replaceChild(newSubmitBtn, oldSubmitBtn);
                
                // Postavi novi event listener
                newSubmitBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Submit survey clicked'); // Debug
                    await this.submitSurvey();
                }, { once: false });
            }
        }
    }
    
    nextSurveyQuestion() {
        if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        }
    }
    
    prevSurveyQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }
    
    async submitSurvey() {
        try {
            console.log('Submit survey started', {
                answers: this.answers,
                questions: this.currentQuestions,
                tracker: this.tracker
            });
            
            // Proveri da li postoje odgovori
            if (!this.answers || Object.keys(this.answers).length === 0) {
                throw new Error('Nema odgovora za čuvanje');
            }
            
            // Procesiraj odgovore i sačuvaj kao simptome
            await this.processSurveyAnswers();
            
            // Sačuvaj datum ankete
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('periodi_lastSurveyDate', today);
            
            // Zatvori modal
            if (this.tracker && this.tracker.closeModal) {
                this.tracker.closeModal('surveyModal');
            }
            
            this.tracker.showSuccess('Anketa je uspešno popunjena!');
        } catch (error) {
            console.error('Greška pri završetku ankete:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                answers: this.answers,
                questions: this.currentQuestions
            });
            this.tracker.showError(`Došlo je do greške pri završetku ankete: ${error.message}. Molimo te pokušaj ponovo.`);
        }
    }
    
    async processSurveyAnswers() {
        try {
            // Konvertuj odgovore u format simptoma
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const symptomEntry = {
                id: Date.now(),
                date: today,
                energy: null,
                mood: null,
                pain: null,
                libido: null,
                additionalSymptoms: [],
                surveyAnswers: this.answers
            };
            
            // Pokušaj da mapiraš odgovore na simptome
            if (this.currentQuestions && this.currentQuestions.length > 0) {
                this.currentQuestions.forEach((question, index) => {
                    const answer = this.answers[index];
                    
                    if (!answer && answer !== 0) {
                        return; // Preskoči ako nema odgovora
                    }
                    
                    if (question.type === 'scale') {
                        const questionLower = question.question.toLowerCase();
                        if (questionLower.includes('energij')) {
                            symptomEntry.energy = parseInt(answer) || null;
                        } else if (questionLower.includes('osećaš') || questionLower.includes('raspoložen')) {
                            symptomEntry.mood = parseInt(answer) || null;
                        } else if (questionLower.includes('bol')) {
                            symptomEntry.pain = parseInt(answer) || null;
                        } else if (questionLower.includes('libido')) {
                            symptomEntry.libido = parseInt(answer) || null;
                        }
                    } else if (question.type === 'checkbox' && Array.isArray(answer)) {
                        symptomEntry.additionalSymptoms = answer;
                    }
                });
            }
            
            // Generiši AI sažetak (ne blokira ako ne uspe)
            try {
                const summary = await this.generateAISummary(symptomEntry);
                if (summary && summary.trim()) {
                    symptomEntry.aiSummary = summary;
                }
            } catch (error) {
                console.error('Greška pri generisanju sažetka:', error);
                // Nastavi bez sažetka
            }
            
            // Proveri da li već postoji unos za danas
            if (!this.tracker.symptoms) {
                this.tracker.symptoms = [];
            }
            
            const todayStr = today.toISOString().split('T')[0];
            const existingIndex = this.tracker.symptoms.findIndex(s => {
                if (!s || !s.date) return false;
                try {
                    const sDate = new Date(s.date);
                    const sDateStr = sDate.toISOString().split('T')[0];
                    return sDateStr === todayStr;
                } catch (e) {
                    return false;
                }
            });
            
            if (existingIndex !== -1) {
                // Ažuriraj postojeći unos
                this.tracker.symptoms[existingIndex] = {
                    ...this.tracker.symptoms[existingIndex],
                    ...symptomEntry
                };
            } else {
                // Dodaj novi unos
                this.tracker.symptoms.push(symptomEntry);
            }
            
            // Sačuvaj podatke
            if (this.tracker.saveData) {
                this.tracker.saveData();
            }
            
            // Ažuriraj prikaz
            if (this.tracker.updateSymptomsDisplay) {
                this.tracker.updateSymptomsDisplay();
            }
            
            if (this.tracker.updateDashboard) {
                this.tracker.updateDashboard();
            }
        } catch (error) {
            console.error('Greška u processSurveyAnswers:', error);
            throw error; // Prosledi grešku dalje
        }
    }
    
    async generateAISummary(symptomEntry) {
        try {
            // Proveri da li postoje odgovori
            if (!symptomEntry.surveyAnswers || Object.keys(symptomEntry.surveyAnswers).length === 0) {
                return '';
            }
            
            const prompt = `Na osnovu sledećih odgovora iz ankete, generiši kratak sažetak (1-2 rečenice) na srpskom jeziku (ekavski dijalekt, latinica) o tome kako se korisnica oseća.
Odgovori: ${JSON.stringify(symptomEntry.surveyAnswers)}
Sažetak mora biti:
- Na srpskom jeziku (ekavski dijalekt, latinica)
- U drugom licu jednine
- Fokus na osećanja, ne na brojeve
- Gramatički ispravan
- Kratak i jasan`;

            const response = await fetch(this.groqApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.groqApiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'Ti si asistent koji generiše kratke sažetke o osećanjima. Sve odgovore daješ na srpskom jeziku (ekavski dijalekt, latinica).'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: this.temperature,
                    max_tokens: 200
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API greška:', response.status, errorText);
                throw new Error(`API greška: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Nevalidan format odgovora od API-ja');
            }
            
            const summary = data.choices[0].message.content.trim();
            
            if (!summary) {
                return '';
            }
            
            // Ispravi gramatičke greške
            if (this.tracker && this.tracker.fixGrammarErrors) {
                return this.tracker.fixGrammarErrors(summary);
            }
            
            return summary;
        } catch (error) {
            console.error('Greška pri generisanju sažetka:', error);
            // Vrati prazan string umesto da baci grešku
            return '';
        }
    }
}
