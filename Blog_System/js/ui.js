/**
 * UI Module
 * Handles DOM manipulation, sanitization, and role-based rendering
 */

class UI {
    /**
     * Sanitize HTML to prevent XSS attacks
     */
    sanitizeHTML(str) {
        if (typeof str !== 'string') return '';
        
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Create safe HTML element with sanitized content
     */
    createSafeElement(tag, content, classes = []) {
        const element = document.createElement(tag);
        element.textContent = content; // Use textContent instead of innerHTML
        
        if (classes.length > 0) {
            element.classList.add(...classes);
        }
        
        return element;
    }

    /**
     * Show element
     */
    show(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.classList.remove('hidden');
        }
    }

    /**
     * Hide element
     */
    hide(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.classList.add('hidden');
        }
    }

    /**
     * Toggle element visibility
     */
    toggle(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.classList.toggle('hidden');
        }
    }

    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set focus to first input
            const firstInput = modal.querySelector('input, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    /**
     * Hide modal
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear form if exists
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                this.clearFormErrors(form);
            }
        }
    }

    /**
     * Show loading spinner
     */
    showSpinner(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.remove('hidden');
        }
    }

    /**
     * Hide loading spinner
     */
    hideSpinner(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('hidden');
        }
    }

    /**
     * Show alert message
     */
    showAlert(message, type = 'info', duration = 5000) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.minWidth = '300px';
        alertDiv.style.animation = 'slideInRight 0.3s ease-out';
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 300);
        }, duration);
    }

    /**
     * Validate form field
     */
    validateField(input) {
        const errorSpan = document.getElementById(`${input.id}Error`);
        let errorMessage = '';

        // Required validation
        if (input.hasAttribute('required') && !input.value.trim()) {
            errorMessage = 'Ovo polje je obavezno';
        }
        // Email validation
        else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                errorMessage = 'Nevažeća email adresa';
            }
        }
        // Min length validation
        else if (input.minLength && input.value.length < input.minLength) {
            errorMessage = `Minimalno ${input.minLength} karaktera`;
        }
        // Max length validation
        else if (input.maxLength > 0 && input.value.length > input.maxLength) {
            errorMessage = `Maksimalno ${input.maxLength} karaktera`;
        }
        // Pattern validation
        else if (input.pattern && input.value) {
            const regex = new RegExp(input.pattern);
            if (!regex.test(input.value)) {
                errorMessage = 'Nevažeć format';
            }
        }

        if (errorSpan) {
            errorSpan.textContent = errorMessage;
        }

        if (errorMessage) {
            input.classList.add('error');
            return false;
        } else {
            input.classList.remove('error');
            return true;
        }
    }

    /**
     * Validate entire form
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Clear form errors
     */
    clearFormErrors(form) {
        const errorSpans = form.querySelectorAll('.error-message');
        errorSpans.forEach(span => {
            span.textContent = '';
        });

        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    /**
     * Format date
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than a minute
        if (diff < 60000) {
            return 'Upravo sada';
        }
        // Less than an hour
        else if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `Pre ${minutes} ${this.pluralize(minutes, 'minut', 'minuta', 'minuta')}`;
        }
        // Less than a day
        else if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `Pre ${hours} ${this.pluralize(hours, 'sat', 'sata', 'sati')}`;
        }
        // Less than a week
        else if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `Pre ${days} ${this.pluralize(days, 'dan', 'dana', 'dana')}`;
        }
        // Default format
        else {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        }
    }

    /**
     * Pluralize Serbian words
     */
    pluralize(count, one, two, five) {
        if (count === 1) return one;
        if (count >= 2 && count <= 4) return two;
        return five;
    }

    /**
     * Truncate text
     */
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    /**
     * Generate slug from text
     */
    generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            // Replace Serbian characters
            .replace(/š/g, 's')
            .replace(/đ/g, 'd')
            .replace(/č/g, 'c')
            .replace(/ć/g, 'c')
            .replace(/ž/g, 'z')
            // Remove special characters
            .replace(/[^a-z0-9\s-]/g, '')
            // Replace spaces with hyphens
            .replace(/\s+/g, '-')
            // Remove multiple hyphens
            .replace(/-+/g, '-')
            // Remove leading/trailing hyphens
            .replace(/^-|-$/g, '');
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
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

    /**
     * Escape HTML for safe display
     */
    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;'
        };
        return text.replace(/[&<>"'/]/g, m => map[m]);
    }

    /**
     * Convert plain text URLs to clickable links
     */
    linkify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return this.escapeHTML(text).replace(urlRegex, url => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    }

    /**
     * Parse simple markdown-style formatting
     */
    parseSimpleMarkdown(text) {
        let html = this.escapeHTML(text);
        
        // Bold: **text**
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic: *text*
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Links: [text](url)
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }

    /**
     * Confirm action with dialog
     */
    confirm(message) {
        return window.confirm(message);
    }

    /**
     * Setup modal close handlers
     */
    setupModalHandlers() {
        // Close modal on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Close modal on close button click
        document.querySelectorAll('.modal-close').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.hideModal(activeModal.id);
                }
            }
        });
    }

    /**
     * Setup mobile navigation toggle
     */
    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });
        }
    }

    /**
     * Convert file to data URL
     */
    async fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Validate file
     */
    validateFile(file, maxSize = 2 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) {
        if (file.size > maxSize) {
            throw new Error(`Fajl je prevelik. Maksimalna veličina je ${maxSize / (1024 * 1024)}MB`);
        }

        if (!allowedTypes.includes(file.type)) {
            throw new Error('Tip fajla nije podržan');
        }

        return true;
    }

    /**
     * Setup real-time validation
     */
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
}

// Create singleton instance
const ui = new UI();

export default ui;

