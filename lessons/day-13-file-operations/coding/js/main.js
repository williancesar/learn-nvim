// Main JavaScript File - CodeCraft Studio
// File operations practice for Day 13

/**
 * Main application controller
 * Manages initialization and global functionality
 */
class App {
    constructor() {
        this.isInitialized = false;
        this.components = new Map();
        this.utils = new Utils();

        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }

        try {
            console.log('Initializing CodeCraft Studio application...');

            // Wait for DOM to be ready
            await this.waitForDOM();

            // Initialize core functionality
            this.initializeEventListeners();
            this.initializeScrollEffects();
            this.initializeAnimations();

            // Initialize components
            await this.initializeComponents();

            this.isInitialized = true;
            console.log('Application initialized successfully');

            // Emit ready event
            this.emit('app:ready');

        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize global event listeners
     */
    initializeEventListeners() {
        console.log('Setting up global event listeners...');

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));

        // Window resize handler
        window.addEventListener('resize', this.utils.throttle(this.handleResize.bind(this), 100));

        // Scroll handler
        window.addEventListener('scroll', this.utils.throttle(this.handleScroll.bind(this), 16));

        // Focus management
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));

        // Click handler for dynamic elements
        document.addEventListener('click', this.handleGlobalClick.bind(this));

        // Error handling
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    /**
     * Initialize scroll effects
     */
    initializeScrollEffects() {
        console.log('Setting up scroll effects...');

        // Parallax effects
        this.initializeParallax();

        // Reveal animations on scroll
        this.initializeRevealAnimations();

        // Sticky elements
        this.initializeStickyElements();
    }

    /**
     * Initialize animations
     */
    initializeAnimations() {
        console.log('Setting up animations...');

        // Typing animation for code blocks
        this.initializeTypingAnimation();

        // Counter animations
        this.initializeCounterAnimations();

        // Loading animations
        this.initializeLoadingAnimations();
    }

    /**
     * Initialize components
     */
    async initializeComponents() {
        console.log('Initializing components...');

        try {
            // Navigation component
            if (document.querySelector('.navbar')) {
                const { Navigation } = await import('./components/navigation.js');
                this.components.set('navigation', new Navigation());
            }

            // Carousel component
            if (document.querySelector('.testimonials-carousel')) {
                const { Carousel } = await import('./components/carousel.js');
                this.components.set('carousel', new Carousel('.testimonials-carousel'));
            }

            // Modal component
            if (document.querySelector('[data-modal]')) {
                const { Modal } = await import('./components/modal.js');
                this.components.set('modal', new Modal());
            }

            // Form validation component
            if (document.querySelector('form[data-validate]')) {
                const { FormValidator } = await import('./components/form-validator.js');
                this.components.set('formValidator', new FormValidator());
            }

            // Lazy loading component
            if (document.querySelector('[data-lazy]')) {
                const { LazyLoader } = await import('./components/lazy-loader.js');
                this.components.set('lazyLoader', new LazyLoader());
            }

        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(event) {
        // Skip links
        if (event.key === 'Tab' && !event.shiftKey) {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink && document.activeElement === document.body) {
                skipLink.focus();
            }
        }

        // Escape key handlers
        if (event.key === 'Escape') {
            this.handleEscapeKey();
        }
    }

    /**
     * Handle escape key presses
     */
    handleEscapeKey() {
        // Close modals
        const openModal = document.querySelector('.modal.active');
        if (openModal) {
            this.components.get('modal')?.close();
            return;
        }

        // Close dropdowns
        const openDropdown = document.querySelector('.dropdown.open');
        if (openDropdown) {
            openDropdown.classList.remove('open');
            return;
        }

        // Close mobile menu
        const mobileMenu = document.querySelector('.nav-menu.active');
        if (mobileMenu) {
            this.components.get('navigation')?.closeMobileMenu();
            return;
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        console.log(`Window resized to ${width}x${height}`);

        // Update components
        this.components.forEach(component => {
            if (typeof component.handleResize === 'function') {
                component.handleResize(width, height);
            }
        });

        // Emit resize event
        this.emit('app:resize', { width, height });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = scrollY;

        // Update scroll progress
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / documentHeight;

        // Update components
        this.components.forEach(component => {
            if (typeof component.handleScroll === 'function') {
                component.handleScroll(scrollY, scrollDirection, scrollProgress);
            }
        });

        // Emit scroll event
        this.emit('app:scroll', { scrollY, scrollDirection, scrollProgress });
    }

    /**
     * Handle focus in events
     */
    handleFocusIn(event) {
        // Add focus indicators
        event.target.setAttribute('data-focus-visible', 'true');

        // Handle focus trapping for modals
        const modal = event.target.closest('.modal');
        if (modal && modal.classList.contains('active')) {
            this.components.get('modal')?.handleFocusTrap(event);
        }
    }

    /**
     * Handle focus out events
     */
    handleFocusOut(event) {
        // Remove focus indicators
        event.target.removeAttribute('data-focus-visible');
    }

    /**
     * Handle global clicks
     */
    handleGlobalClick(event) {
        const target = event.target;

        // Handle data attribute clicks
        if (target.dataset.action) {
            this.handleDataAction(target, event);
        }

        // Handle external links
        if (target.tagName === 'A' && target.href && target.host !== window.location.host) {
            this.handleExternalLink(target, event);
        }

        // Close dropdowns when clicking outside
        this.closeDropdownsOnOutsideClick(target);
    }

    /**
     * Handle data action clicks
     */
    handleDataAction(element, event) {
        const action = element.dataset.action;

        switch (action) {
            case 'scroll-to':
                event.preventDefault();
                this.scrollToElement(element.dataset.target);
                break;

            case 'toggle-theme':
                this.toggleTheme();
                break;

            case 'copy-text':
                this.copyText(element.dataset.text || element.textContent);
                break;

            case 'share':
                this.share(element.dataset.url, element.dataset.title);
                break;

            default:
                console.warn(`Unknown action: ${action}`);
        }
    }

    /**
     * Handle external links
     */
    handleExternalLink(link, event) {
        // Add rel attributes for security
        if (!link.rel) {
            link.rel = 'noopener noreferrer';
        }

        // Open in new tab
        if (!link.target) {
            link.target = '_blank';
        }

        // Analytics tracking
        this.trackEvent('external_link_click', {
            url: link.href,
            text: link.textContent.trim()
        });
    }

    /**
     * Close dropdowns when clicking outside
     */
    closeDropdownsOnOutsideClick(target) {
        const openDropdowns = document.querySelectorAll('.dropdown.open');
        openDropdowns.forEach(dropdown => {
            if (!dropdown.contains(target)) {
                dropdown.classList.remove('open');
            }
        });
    }

    /**
     * Initialize parallax effects
     */
    initializeParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;

            const updateParallax = () => {
                const rect = element.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const screenCenter = window.innerHeight / 2;
                const distance = elementCenter - screenCenter;
                const transform = distance * speed;

                element.style.transform = `translateY(${transform}px)`;
            };

            // Store update function for scroll handler
            element._parallaxUpdate = updateParallax;
        });
    }

    /**
     * Initialize reveal animations
     */
    initializeRevealAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = parseInt(element.dataset.delay) || 0;

                        setTimeout(() => {
                            element.classList.add('revealed');
                        }, delay);

                        observer.unobserve(element);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        document.querySelectorAll('[data-reveal]').forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Initialize sticky elements
     */
    initializeStickyElements() {
        const stickyElements = document.querySelectorAll('[data-sticky]');

        stickyElements.forEach(element => {
            const offset = parseInt(element.dataset.stickyOffset) || 0;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    const isStuck = !entry.isIntersecting && entry.boundingClientRect.top < offset;
                    element.classList.toggle('is-stuck', isStuck);
                },
                {
                    threshold: [0, 1],
                    rootMargin: `-${offset}px 0px 0px 0px`
                }
            );

            // Create sentinel element
            const sentinel = document.createElement('div');
            sentinel.style.height = '1px';
            element.parentNode.insertBefore(sentinel, element);

            observer.observe(sentinel);
        });
    }

    /**
     * Initialize typing animation
     */
    initializeTypingAnimation() {
        const codeElement = document.getElementById('code-animation');
        if (!codeElement) return;

        const lines = Array.from(codeElement.children);
        let currentLine = 0;

        // Hide all lines initially
        lines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
        });

        const animateLine = () => {
            if (currentLine >= lines.length) {
                // Restart animation after delay
                setTimeout(() => {
                    currentLine = 0;
                    lines.forEach(line => {
                        line.style.opacity = '0';
                        line.style.transform = 'translateX(-20px)';
                    });
                    animateLine();
                }, 3000);
                return;
            }

            const line = lines[currentLine];
            line.style.transition = 'all 0.5s ease-out';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';

            currentLine++;
            setTimeout(animateLine, 800);
        };

        // Start animation after a delay
        setTimeout(animateLine, 1000);
    }

    /**
     * Initialize counter animations
     */
    initializeCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        const animateCounter = (element) => {
            const target = parseInt(element.dataset.counter);
            const duration = parseInt(element.dataset.duration) || 2000;
            const startTime = Date.now();
            const startValue = 0;

            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart);

                element.textContent = currentValue.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString() + (element.dataset.suffix || '');
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateCounter(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    /**
     * Initialize loading animations
     */
    initializeLoadingAnimations() {
        // Fade in page content
        document.body.classList.add('loaded');

        // Initialize skeleton loaders
        const skeletons = document.querySelectorAll('.skeleton');
        skeletons.forEach(skeleton => {
            setTimeout(() => {
                skeleton.classList.remove('skeleton');
            }, Math.random() * 1000 + 500);
        });
    }

    /**
     * Scroll to element
     */
    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
            return;
        }

        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = element.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update URL hash
        if (element.id) {
            history.pushState(null, null, `#${element.id}`);
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        this.emit('theme:changed', { theme: newTheme });

        // Show toast notification
        this.showToast(`Switched to ${newTheme} theme`);
    }

    /**
     * Copy text to clipboard
     */
    async copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy text:', error);

            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            this.showToast('Copied to clipboard!');
        }
    }

    /**
     * Share content
     */
    async share(url, title) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || document.title,
                    url: url || window.location.href
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback: copy URL to clipboard
            this.copyText(url || window.location.href);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Add to DOM
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, duration);
    }

    /**
     * Create toast container
     */
    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Track events (placeholder for analytics)
     */
    trackEvent(eventName, properties = {}) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, properties);
        } else if (typeof analytics === 'object') {
            analytics.track(eventName, properties);
        } else {
            console.log('Analytics event:', eventName, properties);
        }
    }

    /**
     * Handle global errors
     */
    handleGlobalError(event) {
        console.error('Global error:', event.error);

        // Report to error tracking service
        this.trackEvent('javascript_error', {
            message: event.error?.message,
            filename: event.filename,
            line: event.lineno,
            column: event.colno
        });
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);

        // Report to error tracking service
        this.trackEvent('unhandled_promise_rejection', {
            reason: event.reason?.toString()
        });
    }

    /**
     * Event emitter
     */
    emit(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Get component by name
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Destroy the application
     */
    destroy() {
        console.log('Destroying application...');

        // Destroy all components
        this.components.forEach(component => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });

        this.components.clear();
        this.isInitialized = false;

        this.emit('app:destroyed');
    }
}

/**
 * Utility functions
 */
class Utils {
    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function calls
     */
    debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toLocaleString();
    }

    /**
     * Generate unique ID
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Get cookie value
     */
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    /**
     * Set cookie
     */
    setCookie(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
}

// Initialize application when script loads
const app = new App();

// Export for use in other modules
window.CodeCraftApp = app;