// Glavna aplikacija - entry point

import { initTheme } from './theme.js';
import { initNavigation, showSection } from './navigation.js';
import { initForm } from './form.js';
import { initFilters } from './filters.js';
import { loadAndDisplayData, setFilter, getMeasurements } from './display.js';
import { initModals, editMeasurement, deleteMeasurement } from './modals.js';
import { analyzeMeasurements, chatWithAI, analyzeSingleMeasurement } from './ai.js';
import { formatMarkdown } from './utils.js';
import { loadMeasurements } from './storage.js';

// Proveri da li browser podržava localStorage
if (typeof window !== 'undefined' && 'localStorage' in window) {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('localStorage je dostupan');
    } catch (e) {
        console.error('localStorage nije dostupan:', e);
        alert('Vaš browser ne podržava localStorage ili je onemogućen. Aplikacija neće moći da čuva podatke.');
    }
} else {
    console.error('localStorage nije podržan');
    alert('Vaš browser ne podržava localStorage. Aplikacija neće moći da čuva podatke.');
}

// Eksportuj funkcije za globalni pristup (za onclick handlers u HTML-u)
window.editMeasurement = (id) => {
    editMeasurement(id, loadAndDisplayData);
};

window.deleteMeasurement = (id) => {
    deleteMeasurement(id);
};

window.analyzeSingleMeasurement = async (id) => {
    const measurements = loadMeasurements();
    const measurement = measurements.find(m => m.id === id);
    if (!measurement) return;
    
    const modal = document.getElementById('aiAnalysisModal');
    const loadingDiv = document.getElementById('aiAnalysisLoading');
    const contentDiv = document.getElementById('aiAnalysisContent');
    const closeBtn = document.getElementById('closeAIModal');
    const closeBtnFooter = document.getElementById('closeAIModalBtn');
    
    if (!modal || !loadingDiv || !contentDiv) return;
    
    // Prikaži modal
    modal.classList.add('active');
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    contentDiv.innerHTML = '';
    
    try {
        const analysis = await analyzeSingleMeasurement(measurement);
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        const formattedAnalysis = formatMarkdown(analysis);
        contentDiv.innerHTML = `<div class="ai-response">${formattedAnalysis}</div>`;
    } catch (error) {
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        contentDiv.innerHTML = `<div class="ai-error">Greška: ${error.message}</div>`;
    }
    
    // Event listeneri za zatvaranje
    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }
    if (closeBtnFooter) {
        closeBtnFooter.onclick = () => modal.classList.remove('active');
    }
    
    // Zatvori klikom van modala
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
};

// Inicijalizacija aplikacije
document.addEventListener('DOMContentLoaded', () => {
    // Inicijalizuj temu
    initTheme();
    
    // Inicijalizuj navigaciju sa callback-om
    initNavigation((sectionId) => {
        if (sectionId === 'pregled' || sectionId === 'statistika' || sectionId === 'grafikoni' || sectionId === 'ai-analiza') {
            loadAndDisplayData();
        }
    });
    
    // Inicijalizuj formu sa callback-om
    initForm(() => {
        loadAndDisplayData();
        // Prebaci na pregled nakon 1 sekunde
        setTimeout(() => {
            showSection('pregled');
        }, 1000);
    });
    
    // Inicijalizuj filtere sa callback-om
    initFilters((filter) => {
        setFilter(filter);
    });
    
    // Učitaj i prikaži podatke (sa default filterom 'today')
    loadAndDisplayData();
    
    // Postavi default vrednost filtera u select elementu
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        periodFilter.value = 'today';
    }
    
    // Inicijalizuj modale sa callback-om
    initModals(loadAndDisplayData);
    
    // Inicijalizuj AI funkcionalnosti
    initAI();
});

/**
 * Inicijalizuje AI funkcionalnosti
 */
function initAI() {
    // AI Analiza dugme
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            const measurements = getMeasurements();
            const analysisDiv = document.getElementById('aiAnalysis');
            const contentDiv = analysisDiv?.querySelector('.ai-content');
            const loadingDiv = analysisDiv?.querySelector('.ai-loading');
            
            if (!analysisDiv || !contentDiv || !loadingDiv) return;
            
            analysisDiv.style.display = 'block';
            loadingDiv.style.display = 'block';
            contentDiv.style.display = 'none';
            analyzeBtn.disabled = true;
            
            try {
                const analysis = await analyzeMeasurements(measurements);
                loadingDiv.style.display = 'none';
                contentDiv.style.display = 'block';
                const formattedAnalysis = formatMarkdown(analysis);
                contentDiv.innerHTML = `<div class="ai-response">${formattedAnalysis}</div>`;
            } catch (error) {
                loadingDiv.style.display = 'none';
                contentDiv.style.display = 'block';
                contentDiv.innerHTML = `<div class="ai-error">Greška: ${error.message}</div>`;
            } finally {
                analyzeBtn.disabled = false;
            }
        });
    }
    
    // Chat funkcionalnost
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (sendChatBtn && chatInput && chatMessages) {
        const sendMessage = async () => {
            const question = chatInput.value.trim();
            if (!question) return;
            
            // Dodaj pitanje u chat
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.textContent = question;
            chatMessages.appendChild(userMsg);
            chatInput.value = '';
            
            // Dodaj loading
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'chat-message ai loading';
            loadingMsg.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Razmišljam...';
            chatMessages.appendChild(loadingMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            sendChatBtn.disabled = true;
            
            try {
                const measurements = getMeasurements();
                const response = await chatWithAI(question, measurements);
                loadingMsg.className = 'chat-message ai';
                loadingMsg.innerHTML = response.replace(/\n/g, '<br>');
            } catch (error) {
                loadingMsg.className = 'chat-message ai error';
                loadingMsg.innerHTML = `Greška: ${error.message}`;
            } finally {
                sendChatBtn.disabled = false;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        };
        
        sendChatBtn.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}
