// ===== MÓDULO ABOUT ===== 
const AboutModule = {
    // Configuración
    config: {
        counterSpeed: 50,
        observerThreshold: 0.5
    },

    // Estado
    state: {
        countersAnimated: false
    },

    // Inicializar
    init() {
        this.bindEvents();
        this.initObservers();
        this.initAnimations();
        console.log('📋 About Module initialized');
    },

    // Vincular eventos
    bindEvents() {
        // Smooth scroll para enlaces internos
        document.addEventListener('click', this.handleSmoothScroll.bind(this));
        
        // Actualizar carrito desde storage
        this.updateCartFromStorage();
    },

    // Manejar smooth scroll
    handleSmoothScroll(event) {
        const target = event.target;
        if (target.matches('a[href^="#"]')) {
            event.preventDefault();
            const targetElement = document.querySelector(target.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    },

    // Inicializar observadores
    initObservers() {
        // Observer para estadísticas
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.countersAnimated) {
                    this.animateCounters();
                    this.state.countersAnimated = true;
                }
            });
        }, {
            threshold: this.config.observerThreshold
        });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        // Observer para animaciones de entrada
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar tarjetas de información
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => fadeObserver.observe(card));
    },

    // Animar contadores
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / this.config.counterSpeed;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    },

    // Inicializar animaciones
    initAnimations() {
        // Animación de entrada para las tarjetas
        const cards = document.querySelectorAll('.info-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });

        // Efecto parallax suave en imagen de tienda
        window.addEventListener('scroll', this.handleParallax.bind(this));
    },

    // Manejar efecto parallax
    handleParallax() {
        const scrolled = window.pageYOffset;
        const storeImage = document.querySelector('.store-physical-image');
        
        if (storeImage) {
            const rate = scrolled * -0.1;
            storeImage.style.transform = `translateY(${rate}px)`;
        }
    },

    // Actualizar carrito desde storage
    updateCartFromStorage() {
        try {
            const cartData = localStorage.getItem('laparada_cart');
            const cartCount = document.getElementById('cartCount');
            
            if (cartData && cartCount) {
                const cart = JSON.parse(cartData);
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    },

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Reutilizar función del módulo principal
        if (window.LaParadaApp) {
            window.LaParadaApp.showNotification(message, type);
        }
    },

    // Utilidades
    utils: {
        // Formatear números con separador de miles
        formatNumber(num) {
            return num.toLocaleString('es-PE');
        },

        // Detectar dispositivo móvil
        isMobile() {
            return window.innerWidth <= 768;
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AboutModule.init();
});

// Exponer globalmente
window.AboutModule = AboutModule;
