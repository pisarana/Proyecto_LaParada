// ===== AUTHENTICATION MANAGER =====
class AuthManager {
    constructor() {
        this.isSubmitting = false;
    }

    // Inicializar
    init() {
        console.log('🔐 Initializing Auth Manager...');
        this.updateNavbar();
        this.bindLoginForm();
        this.bindRegisterForm();
        console.log('✅ Auth Manager ready');
    }

    // ===== LOGIN FORM HANDLER =====
    bindLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) {
            console.log('ℹ️ Login form not found on this page');
            return;
        }

        console.log('🔗 Binding login form...');

        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (this.isSubmitting) return;

            console.log('📝 Login form submitted');

            try {
                this.isSubmitting = true;
                const submitButton = loginForm.querySelector('button[type="submit"]');

                // UI Loading state
                this.setButtonLoading(submitButton, true, 'Iniciando sesión...');

                // Get form data
                const formData = new FormData(loginForm);
                const email = formData.get('correo');
                const password = formData.get('password');

                console.log('🔍 Login data:', { email, password: '***' });

                // Call API
                const response = await API.login(email, password);

                // Success message
                this.showMessage('¡Inicio de sesión exitoso!', 'success');

                // Update navbar
                this.updateNavbar();

                // Redirect based on role
                setTimeout(() => {
                    if (response.user.rol === 'ADMINISTRADOR') {
                        console.log('👑 Redirecting to admin dashboard...');
                        window.location.href = dashboardLink;
                    } else {
                        console.log('🏠 Redirecting to home...');
                        window.location.href = '../../index.html';
                    }
                }, 1500);

            } catch (error) {
                console.error('❌ Login failed:', error);
                this.showMessage('Credenciales inválidas. Inténtalo de nuevo.', 'error');
            } finally {
                this.isSubmitting = false;
                const submitButton = loginForm.querySelector('button[type="submit"]');
                this.setButtonLoading(submitButton, false, 'Iniciar Sesión');
            }
        });
    }

    // ===== REGISTER FORM HANDLER =====
    // ===== REGISTER FORM HANDLER - CORREGIDO =====
    bindRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) {
            console.log('ℹ️ Register form not found on this page');
            return;
        }

        console.log('🔗 Binding register form...');

        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (this.isSubmitting) return;

            console.log('📝 Register form submitted');

            try {
                this.isSubmitting = true;
                const submitButton = registerForm.querySelector('button[type="submit"]');

                // UI Loading state
                this.setButtonLoading(submitButton, true, 'Creando cuenta...');

                // Get form data - ✅ CORRECCIÓN EXACTA
                const formData = new FormData(registerForm);
                const userData = {
                    nombre: `${formData.get('nombre')} ${formData.get('apellido')}`, // ✅ apellido (NO apellidos)
                    email: formData.get('correo'),
                    password: formData.get('password'),
                    telefono: formData.get('telefono'), // ✅ AGREGAR ESTE CAMPO
                    direccion: formData.get('direccion') || null // ✅ AGREGAR ESTE CAMPO (opcional)
                };


                console.log('🔍 Register data:', { ...userData, password: '***' });

                // Call API
                await API.register(userData);

                // Success message
                this.showMessage('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success');

                // Redirect to login
                setTimeout(() => {
                    console.log('🔄 Redirecting to login...');
                    window.location.href = '/frontend/pages/auth/login.html';
                }, 2000);

            } catch (error) {
                console.error('❌ Registration failed:', error);
                this.showMessage(`Error al crear cuenta: ${error.message}`, 'error');
            } finally {
                this.isSubmitting = false;
                const submitButton = registerForm.querySelector('button[type="submit"]');
                this.setButtonLoading(submitButton, false, 'Crear Cuenta');
            }
        });
    }

    // ===== NAVBAR UPDATE =====
    // ===== NAVBAR UPDATE - CON BOTÓN ADMIN =====
    updateNavbar() {
    const user = API.getUser();
    const cartLink = '/frontend/pages/cart/cart.html';
    const dashboardLink = '/frontend/pages/admin/dashboard.html';
    const myOrdersLink = '/frontend/pages/checkout/my-orders.html'; // <- Nuevo

    const navbarActions = document.querySelector('.navbar-actions');
    const navbarNav = document.querySelector('.navbar-nav'); // Contenedor de los nav-links
    if (!navbarActions || !navbarNav) return;

    // Limpiar nav-links extra
    const existingMyOrders = document.getElementById('myOrdersNav');
    if (existingMyOrders) existingMyOrders.remove();

    if (user) {
        console.log('👤 User logged in, updating navbar:', user.nombre);

        // Admin button
        const adminButton = user.rol === 'ADMINISTRADOR'
            ? `<a href="${dashboardLink}" class="btn btn-admin me-2" id="adminBtn">
                    <i class="fas fa-cogs me-1"></i>
                    <span class="d-none d-md-inline">Panel Admin</span>
               </a>`
            : '';

        // Botón Mis Pedidos como nav-link solo para clientes
        if (user.rol !== 'ADMINISTRADOR') {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.id = 'myOrdersNav';
            li.innerHTML = `<a class="nav-link nav-btn" href="${myOrdersLink}">
                                <i class="fas fa-box me-1"></i> Mis Pedidos
                            </a>`;
            navbarNav.appendChild(li);
        }

        // Actualizar acciones (carrito + usuario + admin)
        navbarActions.innerHTML = `
            <a href="${cartLink}" class="btn btn-cart me-2" id="cartBtn">
                <i class="fas fa-shopping-cart me-1"></i>
                <span class="badge bg-danger cart-badge" id="cartCount">0</span>
            </a>

            ${adminButton}

            <div class="btn btn-user" id="loginBtn">
                <i class="fas fa-user-circle"></i>
                <span class="d-none d-md-inline ms-1">${user.nombre}</span>
                <i class="fas fa-chevron-down ms-1"></i>
            </div>
        `;

        const newLoginBtn = document.getElementById('loginBtn');
        if (newLoginBtn) {
            newLoginBtn.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu(e);
            };
        }

    } else {
        console.log('🚪 No user logged in');
        navbarActions.innerHTML = `
            <a href="${cartLink}" class="btn btn-cart me-2" id="cartBtn">
                <i class="fas fa-shopping-cart me-1"></i>
                <span class="badge bg-danger cart-badge" id="cartCount">0</span>
            </a>

            <a href="/frontend/pages/auth/login.html" class="btn btn-login" id="loginBtn">
                <i class="fas fa-user me-1"></i>
                <span class="d-none d-md-inline">Iniciar sesión</span>
            </a>
        `;
    }

    // 🔥 Lógica para ocultar enlaces según rol
    const tiendaLink = document.querySelector('a[href$="products/catalog.html"]');
    const nosotrosLink = document.querySelector('a[href$="about.html"]');
    const contactanosLink = document.querySelector('a[href$="contact.html"]');
    const cartBtn = document.getElementById('cartBtn');
    const adminNavbar = document.getElementById("adminNavbar");
    
    if (adminNavbar) {
        const adminLinks = adminNavbar.querySelectorAll("a.nav-link");
        adminLinks.forEach(link => link.style.display = "none");
    }

    if (user && user.rol === "ADMINISTRADOR") {
        if (tiendaLink) tiendaLink.style.display = 'none';
        if (nosotrosLink) nosotrosLink.style.display = 'block';
        if (contactanosLink) contactanosLink.style.display = 'block';
        if (cartBtn) cartBtn.style.display = 'none';
    } else {
        if (tiendaLink) tiendaLink.style.display = 'block';
        if (nosotrosLink) nosotrosLink.style.display = 'block';
        if (contactanosLink) contactanosLink.style.display = 'block';
        if (cartBtn) cartBtn.style.display = 'flex';
    }
}

    // ===== USER MENU =====
    showUserMenu(event) {
        console.log('📋 Showing user menu...');

        // Create dropdown menu
        const existingMenu = document.querySelector('.user-dropdown');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'user-dropdown';
        menu.innerHTML = `
            <div class="dropdown-item" onclick="AUTH.logout()">
                <i class="fas fa-sign-out-alt me-2"></i>
                Cerrar Sesión
            </div>
        `;

        // Style menu
        menu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-width: 150px;
            z-index: 1000;
        `;

        // Position menu
        const button = event.currentTarget;
        button.style.position = 'relative';
        button.appendChild(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 100);
    }

    // ===== LOGOUT =====
    // ===== LOGOUT MEJORADO =====
    logout() {
        console.log('🚪 Logout triggered');

        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            API.logout();
            this.updateNavbar();

            // Redirect to appropriate page based on current location
            const currentPath = window.location.pathname;

            if (currentPath.includes('admin')) {
                console.log('🏠 Redirecting from admin to home...');
                window.location.href = '../../index.html';
            } else if (currentPath.includes('pages')) {
                console.log('🏠 Redirecting from pages to home...');
                window.location.href = '/frontend/index.html';
            } else {
                console.log('🔄 Refreshing current page...');
                window.location.reload();
            }
        }
    }

    // ===== UI HELPERS =====
    setButtonLoading(button, loading, text) {
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                ${text}
            `;
        } else {
            button.disabled = false;
            button.innerHTML = text;
        }
    }

    showMessage(message, type) {
        console.log(`💬 Showing message: ${message}`);

        // Remove existing messages
        const existingAlerts = document.querySelectorAll('.alert-custom');
        existingAlerts.forEach(alert => alert.remove());

        // Create alert
        const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show alert-custom`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;

        // Insert at top of main content
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alert, container.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}
// ===== FUNCIONALIDADES ADICIONALES DEL FORMULARIO =====
class FormEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.bindPasswordToggle();
        this.bindPasswordStrength();
        this.bindFormValidation();
    }

    // ===== TOGGLE PASSWORD VISIBILITY =====
    bindPasswordToggle() {
        const toggleButton = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');

        if (!toggleButton || !passwordField) return;

        toggleButton.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);

            const icon = toggleButton.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // ===== PASSWORD STRENGTH INDICATOR =====
    bindPasswordStrength() {
        const passwordField = document.getElementById('password');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (!passwordField || !strengthBar || !strengthText) return;

        passwordField.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);

            // Remove existing classes
            strengthBar.classList.remove('weak', 'medium', 'strong');

            if (password.length === 0) {
                strengthBar.style.width = '0%';
                strengthText.textContent = 'Fortaleza de la contraseña';
                strengthText.style.color = '#6c757d';
            } else if (strength < 3) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Contraseña débil';
                strengthText.style.color = '#e74c3c';
            } else if (strength < 5) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Contraseña moderada';
                strengthText.style.color = '#f39c12';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Contraseña fuerte';
                strengthText.style.color = '#8bc34a';
            }
        });
    }

    // ===== CALCULATE PASSWORD STRENGTH =====
    calculatePasswordStrength(password) {
        let strength = 0;

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        return strength;
    }

    // ===== FORM VALIDATION =====
    bindFormValidation() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });

        // Terms checkbox
        const termsCheckbox = document.getElementById('terminos');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                if (termsCheckbox.checked) {
                    termsCheckbox.classList.remove('is-invalid');
                    termsCheckbox.classList.add('is-valid');
                } else {
                    termsCheckbox.classList.remove('is-valid');
                    termsCheckbox.classList.add('is-invalid');
                }
            });
        }
    }

    // ===== VALIDATE INDIVIDUAL FIELD =====
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Reset classes
        field.classList.remove('is-valid', 'is-invalid');

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{9}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
            }
        }

        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 6) {
                isValid = false;
            }
        }

        // Apply validation classes
        if (isValid && value) {
            field.classList.add('is-valid');
        } else if (!isValid) {
            field.classList.add('is-invalid');
        }

        return isValid;
    }
}

// ===== INITIALIZE FORM ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    new FormEnhancements();
});

// Global instance
window.AUTH = new AuthManager();
console.log('🔐 Auth Manager loaded');
