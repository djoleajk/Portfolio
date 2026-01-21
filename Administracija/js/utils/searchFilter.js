// Search and Filter Utilities
class SearchFilter {
    /**
     * Filtrira niz objekata na osnovu search terma
     * @param {Array} items - Niz objekata za filtriranje
     * @param {string} searchTerm - Termin za pretragu
     * @param {Array} fields - Polja za pretragu
     * @returns {Array} - Filtrirani niz
     */
    static filter(items, searchTerm, fields = []) {
        if (!searchTerm || searchTerm.trim() === '') {
            return items;
        }

        const term = searchTerm.toLowerCase().trim();
        
        return items.filter(item => {
            return fields.some(field => {
                const value = this.getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }

    /**
     * Sortira niz objekata
     * @param {Array} items - Niz za sortiranje
     * @param {string} field - Polje za sortiranje
     * @param {string} direction - 'asc' ili 'desc'
     * @returns {Array} - Sortirani niz
     */
    static sort(items, field, direction = 'asc') {
        return [...items].sort((a, b) => {
            const aVal = this.getNestedValue(a, field);
            const bVal = this.getNestedValue(b, field);
            
            let comparison = 0;
            
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                comparison = aVal.localeCompare(bVal, 'sr');
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            } else if (aVal instanceof Date && bVal instanceof Date) {
                comparison = aVal - bVal;
            } else {
                comparison = String(aVal).localeCompare(String(bVal), 'sr');
            }
            
            return direction === 'asc' ? comparison : -comparison;
        });
    }

    /**
     * Dobija vrednost iz ugnježdenog objekta
     */
    static getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }

    /**
     * Debounce funkcija za pretragu
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SearchFilter };
}

