// Navigation Component
// File operations practice - component file

/**
 * Navigation component with mobile menu and scroll effects
 */
export class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.isOpen = false;
        this.scrollThreshold = 100;
        this.lastScrollY = 0;

        this.init();
    }

    init() {
        if (!this.navbar) {
            console.warn('Navigation: navbar element not found');
            return;
        }

        this.bindEvents();
        this.setupScrollSpy();
        this.setupActiveLink();

        console.log('Navigation component initialized');
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (this.isOpen && !this.navbar.contains(event.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isOpen) {
                this.closeMobileMenu();
            }
        });

        // Scroll handler
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    toggleMobileMenu() {
        if (this.isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isOpen = true;
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        this.navToggle.setAttribute('aria-expanded', 'true');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus trap
        this.trapFocus();

        // Animate menu items
        this.animateMenuItems(true);
    }

    closeMobileMenu() {
        this.isOpen = false;
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');

        // Restore body scroll
        document.body.style.overflow = '';

        // Animate menu items
        this.animateMenuItems(false);
    }

    animateMenuItems(isOpening) {
        const items = this.navMenu.querySelectorAll('.nav-item');

        items.forEach((item, index) => {
            if (isOpening) {
                item.style.transitionDelay = `${index * 0.1}s`;
                item.classList.add('animate-in');
            } else {
                item.style.transitionDelay = `${(items.length - index) * 0.05}s`;
                item.classList.remove('animate-in');
            }
        });
    }

    trapFocus() {
        if (!this.isOpen) return;

        const focusableElements = this.navMenu.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (event) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);

        // Store reference to remove later
        this.tabHandler = handleTabKey;

        // Focus first element
        firstElement.focus();
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';

        // Hide/show navbar based on scroll direction
        if (scrollY > this.scrollThreshold) {
            if (scrollDirection === 'down' && !this.isOpen) {
                this.navbar.classList.add('navbar-hidden');
            } else if (scrollDirection === 'up') {
                this.navbar.classList.remove('navbar-hidden');
            }
        } else {
            this.navbar.classList.remove('navbar-hidden');
        }

        // Add scrolled class for styling
        if (scrollY > 50) {
            this.navbar.classList.add('navbar-scrolled');
        } else {
            this.navbar.classList.remove('navbar-scrolled');
        }

        this.lastScrollY = scrollY;
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMobileMenu();
        }
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);

                    if (entry.isIntersecting) {
                        // Remove active class from all links
                        this.navLinks.forEach(navLink => navLink.classList.remove('active'));

                        // Add active class to current link
                        if (link) {
                            link.classList.add('active');
                        }
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-100px 0px -50% 0px'
            }
        );

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupActiveLink() {
        const currentPath = window.location.pathname;

        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    destroy() {
        // Remove event listeners
        if (this.tabHandler) {
            document.removeEventListener('keydown', this.tabHandler);
        }

        // Close mobile menu if open
        if (this.isOpen) {
            this.closeMobileMenu();
        }

        console.log('Navigation component destroyed');
    }
}