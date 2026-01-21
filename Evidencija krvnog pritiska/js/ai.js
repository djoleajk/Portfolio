// AI integracija sa Groq API

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Aktuelni model - koristi najnoviji dostupan model
// Alternativni modeli: 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'
const AI_MODEL = 'llama-3.3-70b-versatile';

/**
 * Analizira merenja i vraća AI preporuke
 * @param {Array} measurements - Niz merenja
 * @returns {Promise<string>} AI analiza i preporuke
 */
export async function analyzeMeasurements(measurements) {
    if (measurements.length === 0) {
        return 'Nema dovoljno podataka za analizu. Dodajte merenja.';
    }

    // Pripremi podatke za AI
    const recentMeasurements = measurements
        .sort((a, b) => new Date(b.datetime || b.createdAt) - new Date(a.datetime || a.createdAt))
        .slice(0, 10)
        .map(m => ({
            datum: new Date(m.datetime || m.createdAt).toLocaleDateString('sr-RS'),
            sistolicki: m.systolic,
            dijastolicki: m.diastolic,
            puls: m.pulse || 'N/A',
            aktivnost: m.activity || 'N/A',
            simptomi: Array.isArray(m.symptoms) ? m.symptoms.join(', ') : 'N/A'
        }));

    const prompt = `Analiziraj sledeća merenja krvnog pritiska i daj direktne, konkretne preporuke na srpskom jeziku:

${JSON.stringify(recentMeasurements, null, 2)}

Odgovori STRICTLY u ovom formatu:
**TRENUTNO STANJE:**
[2-3 direktne rečenice. Koristi **bold** za važne brojeve i vrednosti, npr. **140/90 mmHg**, **povišen pritisak**, **normalan puls**]

**PREPORUKE:**
• [Konkretna akcija 1 - koristi **bold** za ključne reči]
• [Konkretna akcija 2 - koristi **bold** za ključne reči]
• [Konkretna akcija 3 - koristi **bold** za ključne reči]
• [Konkretna akcija 4 - koristi **bold** za ključne reči]

**UPOZORENJA:**
[Ako postoje, direktno upozorenje sa **bold** za kritične informacije]

VAŽNO: 
- Koristi **bold** za sve važne brojeve (npr. **120/80**, **140 mmHg**)
- Koristi **bold** za status (npr. **povišen**, **normalan**, **hipertenzija**)
- Koristi **bold** za ključne akcije (npr. **merite redovno**, **smanjite so**)
- Budi direktan, konkretan i fokusiran na akcije koje korisnik može preduzeti`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ti si medicinski asistent koji pomaže ljudima da razumeju svoje merenje krvnog pritiska. Odgovaraj na srpskom jeziku, budi kratak i konkretan.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API greška: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Greška pri AI analizi:', error);
        return `Greška pri komunikaciji sa AI servisom: ${error.message}`;
    }
}

/**
 * Chat sa AI asistentom
 * @param {string} question - Pitanje korisnika
 * @param {Array} measurements - Niz merenja (opciono)
 * @returns {Promise<string>} AI odgovor
 */
export async function chatWithAI(question, measurements = []) {
    const context = measurements.length > 0 
        ? `Korisnik ima ${measurements.length} merenja. Poslednje merenje: ${measurements[0]?.systolic}/${measurements[0]?.diastolic} mmHg.`
        : 'Korisnik još nema sačuvanih merenja.';

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `Ti si medicinski asistent za krvni pritisak. ${context} Odgovaraj na srpskom jeziku, budi kratak i koristan. VAŽNO: Ne daj dijagnoze, samo opšte informacije i preporuke.`
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API greška: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Greška pri AI chatu:', error);
        return `Greška pri komunikaciji sa AI servisom: ${error.message}`;
    }
}

/**
 * Analizira pojedinačno merenje i vraća AI preporuke
 * @param {Object} measurement - Objekat merenja
 * @returns {Promise<string>} AI analiza i preporuke
 */
export async function analyzeSingleMeasurement(measurement) {
    const date = new Date(measurement.datetime || measurement.createdAt);
    const formattedDate = date.toLocaleDateString('sr-RS', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const prompt = `Analiziraj ovo merenje krvnog pritiska i daj direktne, konkretne preporuke na srpskom jeziku:

Datum: ${formattedDate}
Sistolički pritisak: ${measurement.systolic} mmHg
Dijastolički pritisak: ${measurement.diastolic} mmHg
Puls: ${measurement.pulse || 'N/A'}
Aktivnost pre merenja: ${measurement.activity ? measurement.activity.replace(/-/g, ' ') : 'N/A'}
Simptomi: ${Array.isArray(measurement.symptoms) && measurement.symptoms.length > 0 ? measurement.symptoms.join(', ') : 'Bez simptoma'}
Lekovi: ${measurement.medication || 'N/A'}
Napomene: ${measurement.notes || 'N/A'}

Odgovori STRICTLY u ovom formatu:
**ANALIZA:**
[2-3 direktne rečenice o ovom konkretnom merenju. Koristi **bold** za važne brojeve i vrednosti, npr. **${measurement.systolic}/${measurement.diastolic} mmHg**, **povišen pritisak**]

**PREPORUKE:**
• [Konkretna akcija 1 - koristi **bold** za ključne reči]
• [Konkretna akcija 2 - koristi **bold** za ključne reči]
• [Konkretna akcija 3 - koristi **bold** za ključne reči]

**UPOZORENJA:**
[Ako postoje, direktno upozorenje sa **bold** za kritične informacije. Ako nema upozorenja, napiši "Nema kritičnih upozorenja za ovo merenje."]

VAŽNO: 
- Koristi **bold** za sve važne brojeve (npr. **${measurement.systolic}/${measurement.diastolic}**, **${measurement.pulse || 'N/A'}**)
- Koristi **bold** za status (npr. **povišen**, **normalan**, **hipertenzija**)
- Koristi **bold** za ključne akcije (npr. **merite ponovo**, **konsultujte lekara**)
- Budi direktan, konkretan i fokusiran na akcije koje korisnik može preduzeti
- Analiziraj samo ovo jedno merenje, ne upoređuj sa drugim`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ti si medicinski asistent koji pomaže ljudima da razumeju svoje merenje krvnog pritiska. Odgovaraj na srpskom jeziku, budi kratak, konkretan i direktan.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 400
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API greška: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Greška pri AI analizi:', error);
        return `Greška pri komunikaciji sa AI servisom: ${error.message}`;
    }
}

/**
 * Generiše automatsku napomenu na osnovu merenja
 * @param {Object} measurement - Objekat merenja
 * @returns {Promise<string>} Generisana napomena
 */
export async function generateAutoNote(measurement) {
    const prompt = `Na osnovu ovog merenja krvnog pritiska, generiši kratku napomenu (1-2 rečenice) na srpskom:

Sistolički: ${measurement.systolic} mmHg
Dijastolički: ${measurement.diastolic} mmHg
Puls: ${measurement.pulse || 'N/A'}
Aktivnost: ${measurement.activity || 'N/A'}
Simptomi: ${Array.isArray(measurement.symptoms) ? measurement.symptoms.join(', ') : 'N/A'}

Napomena treba da bude kratka i korisna.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ti si asistent koji generiše kratke, korisne napomene o merenjima krvnog pritiska na srpskom jeziku.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 100
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API greška: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Greška pri generisanju napomene:', error);
        return null;
    }
}
