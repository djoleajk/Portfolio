// Filteri i export funkcionalnosti

import { exportMeasurements } from './storage.js';
import { showMessage, generateMonthOptions } from './utils.js';

/**
 * Inicijalizuje filtere
 * @param {Function} onFilterChange - Callback funkcija koja se poziva kada se promeni filter
 */
export function initFilters(onFilterChange) {
    const periodFilter = document.getElementById('periodFilter');
    if (periodFilter) {
        // Generiši opcije za prethodne mesece
        const monthOptions = generateMonthOptions(12);
        
        // Pronađi opciju "Ovaj mesec" da znamo gde da ubacimo mesečne opcije
        const monthOption = periodFilter.querySelector('option[value="month"]');
        const allOption = periodFilter.querySelector('option[value="all"]');
        
        // Kreiraj optgroup za prethodne mesece
        const monthGroup = document.createElement('optgroup');
        monthGroup.label = 'Prethodni meseci';
        
        monthOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            monthGroup.appendChild(optionElement);
        });
        
        // Ubaci optgroup posle "Ovaj mesec", pre "Sva merenja"
        if (monthOption && allOption) {
            periodFilter.insertBefore(monthGroup, allOption);
        } else if (monthOption) {
            periodFilter.appendChild(monthGroup);
        }
        
        periodFilter.addEventListener('change', (e) => {
            if (onFilterChange) {
                onFilterChange(e.target.value);
            }
        });
    }
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }
}

/**
 * Rukuje eksportom podataka
 */
function handleExport() {
    const data = exportMeasurements();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krvni-pritisak-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('formMessage', 'Podaci su uspešno eksportovani!', 'success');
}
