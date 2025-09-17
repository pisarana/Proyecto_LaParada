// ===== CONFIGURACIÓN GLOBAL =====
const App = {
    // Configuración
    config: {
        animationDuration: 300,
        scrollOffset: 100,
        cartStorageKey: 'laparada_cart',
        userStorageKey: 'laparada_user'
    },

    // Estado global
    state: {
        cart: [],
        user: null,
        isLoggedIn: false
    },

    // Inicialización
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.initComponents();
        this.updateUI();
        console.log('🚀 La Parada App initialized');
    },

    // Cargar datos del localStorage
    loadFromStorage() {
        try {
            const cartData = localStorage.getItem(this.config.cartStorageKey);
            const userData = localStorage.getItem(this.config.userStorageKey);
            
            if (cartData) {
                this.state.cart = JSON.parse(cartData);
            }
            
            if (userData) {
                this.state.user = JSON.parse(userData);
                this.state.isLoggedIn = true;
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    },

    // Guardar datos en localStorage
    saveToStorage() {
        try {
            localStorage.setItem(this.config.cartStorageKey, JSON.stringify(this.state.cart));
            if (this.state.user) {
                localStorage.setItem(this.config.userStorageKey, JSON.stringify(this.state.user));
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    },

    // Vincular eventos
    bindEvents() {
        
        // Resize events
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Storage events (para sincronización entre pestañas)
        window.addEventListener('storage', this.handleStorageChange.bind(this));
        
        // Navigation events
        document.addEventListener('click', this.handleNavigation.bind(this));
        
        // Form events
        document.addEventListener('submit', this.handleForms.bind(this));
    },

    // Inicializar componentes
    initComponents() {
        this.initScrollToTop();
        this.initNavbarEffects();
        this.initAnimations();
        this.initLazyLoading();
    },


    // Manejar redimensionamiento
    handleResize() {
        // Actualizar animaciones en resize
        this.initAnimations();
    },

    // Manejar cambios de storage
    handleStorageChange(event) {
        if (event.key === this.config.cartStorageKey) {
            this.state.cart = JSON.parse(event.newValue) || [];
            this.updateCartUI();
        }
    },

    // Manejar navegación
    handleNavigation(event) {
        const target = event.target;
        
        // Smooth scroll para links internos
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

    // Manejar formularios
    handleForms(event) {
        const form = event.target;
        
        // Validación básica
        if (form.matches('form')) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            
            if (!isValid) {
                event.preventDefault();
                this.showNotification('Por favor completa todos los campos requeridos', 'error');
            }
        }
    },

    // Inicializar botón scroll to top
    initScrollToTop() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },

    // Efectos del navbar
    initNavbarEffects() {
        const navLinks = document.querySelectorAll('.nav-btn');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    },

    // Inicializar animaciones
    initAnimations() {
        // Intersection Observer para animaciones al scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observar elementos animables
        const animatableElements = document.querySelectorAll('.section-title, .section-subtitle, .product-card');
        animatableElements.forEach(el => observer.observe(el));
    },

    // Lazy loading para imágenes
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    // Actualizar UI
    updateUI() {
        this.updateCartUI();
        this.updateUserUI();
    },

    // Actualizar UI del carrito
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.state.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    // Actualizar UI del usuario
    updateUserUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn && this.state.isLoggedIn) {
            loginBtn.innerHTML = `<i class="fas fa-user me-1"></i> ${this.state.user.name}`;
            loginBtn.href = 'pages/profile/profile.html';
        }
    },

    // Agregar al carrito
    addToCart(product) {
        const existingItem = this.state.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveToStorage();
        this.updateCartUI();
        this.showNotification(`${product.name} agregado al carrito`, 'success');
    },

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification-toast`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
            </div>
        `;
        
        // Agregar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-ocultar después de 5 segundos
        const hideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Manejar cierre manual
        notification.querySelector('.btn-close').addEventListener('click', () => {
            clearTimeout(hideTimeout);
            this.hideNotification(notification);
        });
    },

    // Ocultar notificación
    hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    },

    // Utilidades
    utils: {
        // Formatear precio
        formatPrice(price) {
            return `S/. ${parseFloat(price).toFixed(2)}`;
        },

        // Formatear fecha
        formatDate(date) {
            return new Date(date).toLocaleDateString('es-PE');
        },

        // Debounce función
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
        },

        // Throttle función
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
            }
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exponer globalmente para otros scripts
window.LaParadaApp = App;
