// Error Handling System
class ErrorHandler {
    constructor() {
        this.errors = [];
    }

    /**
     * Rukuje greškom i prikazuje je korisniku
     * @param {Error|string} error - Greška za rukovanje
     * @param {string} context - Kontekst gde se greška desila
     * @param {boolean} showToUser - Da li prikazati korisniku
     */
    handle(error, context = '', showToUser = true) {
        const errorMessage = error instanceof Error ? error.message : error;
        const errorObj = {
            message: errorMessage,
            context: context,
            timestamp: new Date().toISOString(),
            stack: error instanceof Error ? error.stack : null
        };

        // Loguj u konzolu
        console.error(`[${context}]`, errorObj);

        // Dodaj u niz grešaka
        this.errors.push(errorObj);

        // Prikaži korisniku ako je potrebno
        if (showToUser && typeof toast !== 'undefined') {
            toast.error(`Greška: ${errorMessage}`);
        } else if (showToUser) {
            alert(`Greška: ${errorMessage}`);
        }

        return errorObj;
    }

    /**
     * Dohvata sve greške
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Briše sve greške
     */
    clearErrors() {
        this.errors = [];
    }

    /**
     * Validira i prikazuje grešku ako validacija ne prođe
     */
    validateAndHandle(validationResult, context = '') {
        if (!validationResult.valid) {
            this.handle(validationResult.error, context, true);
            return false;
        }
        return true;
    }
}

// Globalna instanca
const errorHandler = new ErrorHandler();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorHandler, errorHandler };
}

