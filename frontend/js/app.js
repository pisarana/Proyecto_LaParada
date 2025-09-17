// ===== CONFIGURACIÓN GLOBAL CORREGIDA =====
const App = {
    // Configuración
    config: {
        animationDuration: 300,
        scrollOffset: 100,
        cartStorageKey: 'laparada_cart',
        userStorageKey: 'laparada_user',
        sessionKey: 'laparada_session'
    },

    // Estado global
    state: {
        cart: [],
        user: null,
        isLoggedIn: false
    },

    // Inicialización CORREGIDA
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.initComponents();
        this.updateUI();
        this.initAuth(); // ← NUEVO: Inicializar auth en cada página
        console.log('🚀 La Parada App initialized');
    },

    // NUEVA FUNCIÓN: Inicializar autenticación
    initAuth() {
        // Cargar estado de autenticación
        this.loadAuthState();

        // Actualizar botones inmediatamente
        this.updateLoginButtons();

        // Escuchar cambios de autenticación
        this.bindAuthEvents();

        console.log('🔐 Auth initialized in current page');
    },

    // NUEVA FUNCIÓN: Cargar estado de autenticación
    loadAuthState() {
        try {
            const sessionData = localStorage.getItem(this.config.sessionKey);
            const userData = localStorage.getItem(this.config.userStorageKey);

            if (sessionData && userData) {
                this.state.isLoggedIn = JSON.parse(sessionData);
                this.state.user = JSON.parse(userData);

                console.log('✅ Usuario logueado detectado:', this.state.user?.nombre);
            } else {
                console.log('❌ No hay sesión activa');
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            this.clearAuthState();
        }
    },

    // NUEVA FUNCIÓN: Limpiar estado de autenticación
    clearAuthState() {
        this.state.isLoggedIn = false;
        this.state.user = null;
        localStorage.removeItem(this.config.sessionKey);
        localStorage.removeItem(this.config.userStorageKey);
    },

    // NUEVA FUNCIÓN: Actualizar botones de login
    updateLoginButtons() {
        // Buscar todos los posibles botones de login
        const selectors = [
            '#loginBtn',
            '.btn-login',
            '[data-login-btn]',
            'a[href*="login.html"]'
        ];

        const loginButtons = document.querySelectorAll(selectors.join(', '));

        console.log(`🔍 Encontrados ${loginButtons.length} botones de login`);

        loginButtons.forEach((button, index) => {
            this.updateSingleLoginButton(button, index);
        });
    },

    // NUEVA FUNCIÓN: Actualizar un solo botón
    updateSingleLoginButton(button, index = 0) {
        if (!button) return;

        if (this.state.isLoggedIn && this.state.user) {
            // Usuario logueado - mostrar nombre y menú
            const userName = this.state.user.nombre || 'Usuario';

            button.innerHTML = `
                <i class="fas fa-user-circle me-1"></i>
                <span class="d-none d-md-inline">${userName}</span>
            `;

            // Cambiar clases
            button.classList.remove('btn-login');
            button.classList.add('btn-user-logged');

            // Remover href original
            button.removeAttribute('href');

            // Agregar evento para mostrar menú
            button.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu(e, button);
            };

            console.log(`✅ Botón ${index + 1} actualizado para usuario: ${userName}`);

        } else {
            // Usuario no logueado - mostrar botón de login
            button.innerHTML = `
                <i class="fas fa-user me-1"></i>
                <span class="d-none d-md-inline">Iniciar sesión</span>
            `;

            // Cambiar clases
            button.classList.remove('btn-user-logged');
            button.classList.add('btn-login');

            // Restaurar href según la página actual
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/')) {
                button.href = 'auth/login.html';
            } else {
                button.href = 'pages/auth/login.html';
            }

            // Remover evento onclick
            button.onclick = null;

            console.log(`❌ Botón ${index + 1} actualizado para invitado`);
        }
    },

    // NUEVA FUNCIÓN: Mostrar menú de usuario
    showUserMenu(event, button) {
        event.preventDefault();

        // Cerrar menú existente
        const existingMenu = document.querySelector('.user-dropdown-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        // Crear nuevo menú
        const menu = document.createElement('div');
        menu.className = 'user-dropdown-menu';
        menu.innerHTML = `
            <div class="dropdown-item" onclick="App.goToProfile()">
                <i class="fas fa-user me-2"></i>
                Mi Perfil
            </div>
            <div class="dropdown-item" onclick="App.goToOrders()">
                <i class="fas fa-shopping-bag me-2"></i>
                Mis Pedidos
            </div>
            <hr class="dropdown-divider">
            <div class="dropdown-item logout-item" onclick="App.logout()">
                <i class="fas fa-sign-out-alt me-2"></i>
                Cerrar Sesión
            </div>
        `;

        // Posicionar menú
        const rect = button.getBoundingClientRect();
        menu.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 5}px;
            right: ${window.innerWidth - rect.right}px;
            z-index: 9999;
        `;

        document.body.appendChild(menu);

        // Cerrar al hacer click fuera
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 100);
    },

    // NUEVA FUNCIÓN: Ir al perfil
    goToProfile() {
        console.log('🔗 Ir a perfil');
        // Aquí puedes redirigir a la página de perfil cuando la crees
        alert('Página de perfil en desarrollo');
    },

    // NUEVA FUNCIÓN: Ir a pedidos
    goToOrders() {
        console.log('🔗 Ir a pedidos');
        // Aquí puedes redirigir a la página de pedidos cuando la crees
        alert('Página de pedidos en desarrollo');
    },

    // NUEVA FUNCIÓN: Cerrar sesión
    logout() {
        console.log('🚪 Cerrando sesión...');

        // Limpiar estado
        this.clearAuthState();

        // Actualizar botones
        this.updateLoginButtons();

        // Cerrar menú
        const menu = document.querySelector('.user-dropdown-menu');
        if (menu) menu.remove();

        // Mostrar notificación
        this.showNotification('Sesión cerrada correctamente', 'success');

        // Redirigir a inicio después de 1 segundo
        setTimeout(() => {
            if (window.location.pathname !== 'frontend/index.html' && !window.location.pathname.endsWith('/')) {
                window.location.href = '../..frontend/index.html';
            }
        }, 1000);
    },

    // Vincular eventos de autenticación
    bindAuthEvents() {
        // Escuchar cambios de storage (sincronización entre pestañas)
        window.addEventListener('storage', (e) => {
            if (e.key === this.config.sessionKey || e.key === this.config.userStorageKey) {
                console.log('🔄 Estado de auth cambió en otra pestaña');
                this.loadAuthState();
                this.updateLoginButtons();
            }
        });

        // Escuchar evento personalizado de auth
        window.addEventListener('authStateChanged', (e) => {
            console.log('🔄 Estado de auth cambió:', e.detail);
            this.state.isLoggedIn = e.detail.isLoggedIn;
            this.state.user = e.detail.user;
            this.updateLoginButtons();
        });
    },

    // Cargar datos del localStorage
    loadFromStorage() {
        try {
            const cartData = localStorage.getItem(this.config.cartStorageKey);
            if (cartData) {
                this.state.cart = JSON.parse(cartData);
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    },

    // Guardar datos en localStorage
    saveToStorage() {
        try {
            localStorage.setItem(this.config.cartStorageKey, JSON.stringify(this.state.cart));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    },

    // Vincular eventos
    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Resize events
        window.addEventListener('resize', this.handleResize.bind(this));

        // Storage events (para sincronización entre pestañas)
        window.addEventListener('storage', this.handleStorageChange.bind(this));

        // Navigation events
        document.addEventListener('click', this.handleNavigation.bind(this));

        // Form events
        document.addEventListener('submit', this.handleForms.bind(this));
    },

    // Manejar scroll
    handleScroll() {
        const scrolled = window.pageYOffset > 50;
        const navbar = document.getElementById('mainNavbar');
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        // Efecto navbar al scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }

        // Mostrar/ocultar botón scroll to top
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('show', window.pageYOffset > this.config.scrollOffset);
        }

        // Parallax effect en hero
        const heroImg = document.querySelector('.hero-img');
        if (heroImg) {
            const scrollPosition = window.pageYOffset;
            const rate = scrollPosition * -0.5;
            heroImg.style.transform = `translate3d(0, ${rate}px, 0) scale(1.1)`;
        }
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

    // Inicializar componentes
    initComponents() {
        this.initScrollToTop();
        this.initNavbarEffects();
        this.initAnimations();
        this.initLazyLoading();
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
            link.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });

            link.addEventListener('mouseleave', function () {
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
            // Si estamos en la página del carrito, usar su módulo
            if (window.CartModule) {
                const totalItems = CartModule.getTotalItems();
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            } else {
                // Fallback para otras páginas
                const cartData = localStorage.getItem('laparada_cart');
                if (cartData) {
                    const cart = JSON.parse(cartData);
                    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                    cartCount.textContent = totalItems;
                    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
                }
            }
        }
    },


    // Actualizar UI del usuario
    updateUserUI() {
        // Esta función ahora se maneja en updateLoginButtons
    },

    // Agregar al carrito
    addToCart(product) {
        try {
            let cart = [];
            const cartData = localStorage.getItem('laparada_cart');
            if (cartData) {
                cart = JSON.parse(cartData);
            }
            
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1,
                    addedAt: new Date().toISOString()
                });
            }
            
            localStorage.setItem('laparada_cart', JSON.stringify(cart));
            this.updateCartUI();
            
            // Si estamos en la página del carrito, actualizar inmediatamente
            if (window.CartModule) {
                CartModule.loadCartFromStorage();
                CartModule.renderCart();
            }
            
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
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
            return function () {
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
