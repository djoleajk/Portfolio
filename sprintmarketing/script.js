// ============================================
// Theme Toggle Functionality
// ============================================

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add theme transition animation
    document.body.style.transition = 'all 0.3s ease';
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================

const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// Header Scroll Effect
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Active Navigation Link
// ============================================

const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Animated Counter for Statistics
// ============================================

const statNumbers = document.querySelectorAll('.stat-number');
let counterAnimated = false;

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

function checkCounterVisibility() {
    if (counterAnimated) return;
    
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    
    const rect = heroStats.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        counterAnimated = true;
        statNumbers.forEach(stat => animateCounter(stat));
    }
}

window.addEventListener('scroll', checkCounterVisibility);
window.addEventListener('load', checkCounterVisibility);

// ============================================
// Particle Background Animation
// ============================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

// Check if device is mobile or has reduced motion preference
const isMobile = window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Only run particles on desktop and if motion is not reduced
if (!isMobile && !prefersReducedMotion) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = Math.random() * 0.5 + 0.2;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.y -= this.speed;
            
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 122, 0, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particles = [];
    const particleCount = window.innerWidth > 1200 ? 100 : 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect nearby particles with lines (only on larger screens)
        if (window.innerWidth > 1024) {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 122, 0, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Resize canvas on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                particles.forEach(particle => particle.reset());
            } else {
                // Hide particles on mobile after resize
                canvas.style.display = 'none';
            }
        }, 250);
    });
} else {
    // Hide canvas on mobile
    canvas.style.display = 'none';
}

// ============================================
// Scroll Animations (AOS - Animate On Scroll)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            // Optional: stop observing after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ============================================
// Typing Animation for Hero Title
// ============================================

const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.opacity = '1';
    
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < text.length) {
            typingText.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing animation after page load
    setTimeout(typeWriter, 500);
}

// ============================================
// Contact Form Removed
// ============================================
// Contact form has been removed. Users can use phone and email links directly.

// ============================================
// Scroll to Top Button
// ============================================

const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// Parallax Effect on Hero Section (Desktop Only)
// ============================================

const heroSection = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const heroVisual = document.querySelector('.hero-visual');

// Only add parallax on desktop
if (window.innerWidth > 768 && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }
        
        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed * 0.8}px)`;
        }
    });
}

// ============================================
// Service Card Tilt Effect (Desktop Only)
// ============================================

const serviceCards = document.querySelectorAll('.service-card');

// Only add tilt effect on desktop (not touch devices)
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================
// Portfolio Card Hover Effect (Desktop Only)
// ============================================

const portfolioCards = document.querySelectorAll('.portfolio-card');

// Only add hover and tilt effects on desktop
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            portfolioCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.6';
                    otherCard.style.transform = 'scale(0.97)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            portfolioCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1)';
            });
        });
        
        // Add 3D tilt effect to portfolio cards
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================
// Add Glow Effect to Mouse Cursor (Desktop Only)
// ============================================

// Only add cursor glow on desktop devices
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    const glowEffect = document.createElement('div');
    glowEffect.className = 'cursor-glow';
    glowEffect.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 122, 0, 0.6) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(glowEffect);

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glowEffect.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glowEffect.style.opacity = '0';
    });

    function animateGlow() {
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.15;
        glowY += dy * 0.15;
        
        glowEffect.style.left = glowX + 'px';
        glowEffect.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// ============================================
// Floating Cards Animation Enhancement
// ============================================

const floatingCards = document.querySelectorAll('.floating-card');

// Only add parallax effect on desktop devices
if (window.innerWidth > 768 && !prefersReducedMotion) {
    floatingCards.forEach((card, index) => {
        // Add mouse parallax effect
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const multiplier = (index + 1) * 0.5;
            card.style.transform = `translate(${x * multiplier}px, ${y * multiplier}px)`;
        });
    });
}

// ============================================
// Form Input Animations - Removed
// ============================================
// Form inputs removed - no longer needed

// ============================================
// Add Loading Animation
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                element.classList.add('aos-animate');
            }
        });
    }, 100);
});

// ============================================
// Easter Egg: Konami Code
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Create confetti effect
    const colors = ['#ff7a00', '#0a2540', '#00d4ff'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                border-radius: 50%;
                z-index: 10000;
                pointer-events: none;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
    
    // Add confetti animation
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff7a00 0%, #ff4500 100%);
        color: white;
        padding: 2rem 3rem;
        border-radius: 1rem;
        font-size: 1.5rem;
        font-weight: 700;
        z-index: 10001;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    message.textContent = '🎉 Pronašli ste uskršnje jaje! 🎉';
    document.body.appendChild(message);
    
    // Add pop-in animation
    if (!document.getElementById('popin-style')) {
        const style = document.createElement('style');
        style.id = 'popin-style';
        style.textContent = `
            @keyframes popIn {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        message.style.animation = 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// ============================================
// Performance Optimization: Debounce Function
// ============================================

function debounce(func, wait) {
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

// Apply debounce to resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any necessary dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}, 250));

// ============================================
// Lazy Loading for Images
// ============================================

const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// Log Website Info
// ============================================

console.log('%c Sprint Marketing 🚀', 'font-size: 24px; font-weight: bold; color: #ff7a00;');
console.log('%c Website by Sprint Marketing | sprintmarketing.agencija@gmail.com', 'font-size: 12px; color: #666;');
console.log('%c Tip: Try the Konami code! ↑↑↓↓←→←→BA', 'font-size: 10px; color: #0a2540; font-style: italic;');

// ============================================
// Analytics Tracking (Placeholder)
// ============================================

function trackEvent(category, action, label) {
    console.log('Analytics Event:', { category, action, label });
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('Button', 'Click', btn.textContent.trim());
    });
});

// Track social media clicks
document.querySelectorAll('.social-icons a, .footer-social a').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Social Media', 'Click', link.getAttribute('aria-label') || 'Social Link');
    });
});

// ============================================
// Service Worker Registration (for PWA)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker file is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('ServiceWorker registered'))
        //     .catch(err => console.log('ServiceWorker registration failed'));
    });
}

// ============================================
// Add Custom Scrollbar Styling (for WebKit browsers)
// ============================================

const scrollbarStyle = document.createElement('style');
scrollbarStyle.textContent = `
    ::-webkit-scrollbar {
        width: 12px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--color-surface);
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #ff7a00 0%, #ff4500 100%);
        border-radius: 6px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #ff4500 0%, #ff7a00 100%);
    }
`;
document.head.appendChild(scrollbarStyle);

// ============================================
// Initialize everything on DOM ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sprint Marketing website loaded successfully! 🚀');
});

