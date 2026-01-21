// Mobile optimizacije i stabilnost
PeriodTracker.prototype.initMobileOptimizations = function() {
    // Prevencija double-tap zoom na iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevencija pull-to-refresh
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0 && e.touches[0].clientY > touchStartY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Optimizacija za performanse
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            this.optimizeForMobile();
        });
    } else {
        setTimeout(() => {
            this.optimizeForMobile();
        }, 1000);
    }
    
    // Fix za iOS Safari viewport
    this.fixIOSViewport();
    
    // Prevencija zoom na input focus (iOS)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number' || input.type === 'date' || input.type === 'time') {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            });
            
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                }
            });
        }
    });
};

PeriodTracker.prototype.optimizeForMobile = function() {
    // Debounce za scroll events
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Performans optimizacije tokom scroll-a
        }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Lazy loading za grafikone
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const canvas = entry.target;
                if (canvas && canvas.id === 'cycleLengthChart' && this.renderCycleLengthChart) {
                    this.renderCycleLengthChart('cycleLengthChart');
                    observer.unobserve(canvas);
                }
            }
        });
    }, observerOptions);
    
    const chartCanvas = document.getElementById('cycleLengthChart');
    if (chartCanvas) {
        observer.observe(chartCanvas);
    }
};

PeriodTracker.prototype.fixIOSViewport = function() {
    // Fix za iOS Safari viewport height
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
    
    // Fix za iOS Safari address bar
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop === 0) {
                setViewportHeight();
            }
        }, { passive: true });
    }
};
