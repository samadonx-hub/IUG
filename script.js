// ============================================
// Theme Toggle
// ============================================

(function() {
    'use strict';

    // Initialize theme from localStorage or system preference
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const html = document.documentElement;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : savedTheme;
    
    // Apply initial theme
    if (initialTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        html.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', newTheme);
        
        // Add transition class for smooth color change
        html.classList.add('theme-transitioning');
        setTimeout(() => {
            html.classList.remove('theme-transitioning');
        }, 300);
    });
})();

// ============================================
// Smooth Scrolling
// ============================================

(function() {
    'use strict';

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
})();

// ============================================
// Mobile Navigation
// ============================================

(function() {
    'use strict';

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on window resize (if switching to desktop)
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
})();

// ============================================
// Copy to Clipboard
// ============================================

(function() {
    'use strict';

    const copyButton = document.getElementById('copyButton');
    const contractInput = document.getElementById('contractInput');
    
    if (copyButton && contractInput) {
        copyButton.addEventListener('click', function() {
            const contractAddress = contractInput.value;
            
            // Use modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(contractAddress).then(() => {
                    showCopySuccess();
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    fallbackCopy(contractAddress);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(contractAddress);
            }
        });
        
        // Also allow clicking the input to copy
        contractInput.addEventListener('click', function() {
            this.select();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(this.value).then(() => {
                    showCopySuccess();
                });
            }
        });
    }
    
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopySuccess() {
        const copyText = copyButton.querySelector('.copy-text');
        copyButton.classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyButton.classList.remove('copied');
        }, 2000);
    }
})();

// ============================================
// Contact Form Handling
// ============================================

(function() {
    'use strict';

    const supportForm = document.getElementById('supportForm');
    const formMessage = document.getElementById('formMessage');
    
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(supportForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', false);
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', false);
                return;
            }
            
            // Simulate form submission (frontend-only as per requirements)
            // In production, this would send to a backend API
            setTimeout(() => {
                showFormMessage('Message sent! We usually reply within 24 hours.', true);
                supportForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }, 500);
        });
    }
    
    function showFormMessage(message, isSuccess) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + (isSuccess ? 'success' : 'error');
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
})();

// ============================================
// Navbar Scroll Effect
// ============================================

(function() {
    'use strict';

    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add shadow on scroll
            if (currentScroll > 10) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }
})();

// ============================================
// Intersection Observer for Animations
// ============================================

(function() {
    'use strict';

    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards and social cards
    document.querySelectorAll('.feature-card, .social-card, .buy-card, .support-form').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
})();

// ============================================
// Button Ripple Effect Enhancement
// ============================================

(function() {
    'use strict';

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
})();

// ============================================
// Glimmer Effect on Hover
// ============================================

(function() {
    'use strict';

    // Add glimmer effect to interactive elements
    const glimmerElements = document.querySelectorAll('.feature-card, .social-card, .btn-primary');
    
    glimmerElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
})();

// ============================================
// Performance Optimization
// ============================================

(function() {
    'use strict';

    // Lazy load images if any are added in the future
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
})();

// ============================================
// Accessibility Enhancements
// ============================================

(function() {
    'use strict';

    // Keyboard navigation for theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Focus management for mobile menu
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
                if (navMenu.classList.contains('active')) {
                    const firstLink = navMenu.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            }
        });
    }
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        }
    });
})();

// ============================================
// Console Message (Optional)
// ============================================

console.log('%cInfinite Dollar Glitch (IUG)', 'font-size: 20px; font-weight: bold; color: #06b6d4;');
console.log('%cThe ultimate Solana-powered meme coin', 'font-size: 14px; color: #64748b;');


