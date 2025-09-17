// ===== MÓDULO DE AUTENTICACIÓN =====
const AuthModule = {
    // Configuración
    config: {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        minPasswordLength: 6,
        sessionKey: 'laparada_session',
        userKey: 'laparada_user'
    },

    // Estado
    state: {
        isLoggedIn: false,
        currentUser: null,
        isLoading: false
    },

    // Inicializar
    init() {
        this.loadStoredSession();
        this.bindEvents();
        this.updateUIState();
        console.log('🔐 Auth Module initialized');
    },

    // Cargar sesión almacenada
    loadStoredSession() {
        try {
            const sessionData = localStorage.getItem(this.config.sessionKey);
            const userData = localStorage.getItem(this.config.userKey);

            if (sessionData && userData) {
                this.state.isLoggedIn = JSON.parse(sessionData);
                this.state.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading session:', error);
            this.clearSession();
        }
    },

    // Vincular eventos
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        const togglePassword = document.getElementById('togglePassword');

        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));

            // Validación en tiempo real
            const inputs = loginForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        }

        // Actualizar carrito desde storage
        this.updateCartFromStorage();
    },

    // Manejar login
    async handleLogin(event) {
        event.preventDefault();

        if (this.state.isLoading) return;

        const form = event.target;
        const isValid = this.validateLoginForm(form);

        if (!isValid) {
            this.showMessage('Por favor corrija los errores en el formulario.', 'danger');
            return;
        }

        this.state.isLoading = true;
        this.showLoading(true);

        try {
            const formData = new FormData(form);
            const credentials = {
                correo: formData.get('correo'),
                password: formData.get('password')
            };

            const loginResult = await this.authenticateUser(credentials);

            if (loginResult.success) {
                this.handleLoginSuccess(loginResult.user);
            } else {
                this.showMessage(loginResult.message, 'danger');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Error de conexión. Por favor intente nuevamente.', 'danger');
        } finally {
            this.state.isLoading = false;
            this.showLoading(false);
        }
    },

    // Autenticar usuario (mock - reemplazar con backend real)
    async authenticateUser(credentials) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Usuarios mock (después usar tu backend)
        const users = [
            {
                id: 1,
                nombre: 'Cliente Test',
                correo: 'cliente@laparada.com',
                password: 'cliente123',
                rol: 'CLIENTE'
            },
            {
                id: 2,
                nombre: 'Administrador',
                correo: 'admin@laparada.com',
                password: 'admin123',
                rol: 'ADMIN'
            }
        ];

        const user = users.find(u =>
            u.correo === credentials.correo && u.password === credentials.password
        );

        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    correo: user.correo,
                    rol: user.rol
                }
            };
        } else {
            return {
                success: false,
                message: 'Correo o contraseña incorrectos'
            };
        }
    },

    // Manejar login exitoso
    async handleLogin(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        this.showLoading(true);

        try {
            let response;

            if (ApiConfig.mode === 'real') {
                // Login real con backend
                response = await fetch(`${ApiConfig.baseURL}${ApiConfig.endpoints.auth.login}`, {
                    method: 'POST',
                    headers: ApiConfig.headers,
                    body: JSON.stringify(loginData)
                });

                const data = await response.json();
                if (data.success) {
                    this.processLogin(data.user, data.token);
                } else {
                    throw new Error(data.message);
                }
            } else {
                // Login mock con verificación de admin
                const mockResponse = this.mockLogin(loginData);
                if (mockResponse.success) {
                    this.processLogin(mockResponse.user, mockResponse.token);
                } else {
                    throw new Error(mockResponse.message);
                }
            }

        } catch (error) {
            console.error('Login error:', error);
            LaParadaApp.showNotification(error.message || 'Error al iniciar sesión', 'error');
        } finally {
            this.showLoading(false);
        }
    },
    processLogin(user, token) {
        // Guardar datos del usuario
        localStorage.setItem('laparada_user', JSON.stringify(user));
        localStorage.setItem('laparada_token', token);

        if (user.isAdmin) {
            localStorage.setItem('admin_session', Date.now().toString());
        }

        LaParradaApp.showNotification(`¡Bienvenido, ${user.nombre}!`, 'success');

        // Redirigir según el rol
        setTimeout(() => {
            if (user.isAdmin) {
                window.location.href = '../admin/dashboard.html';
            } else {
                window.location.href = '../../index.html';
            }
        }, 1500);
    },
    mockLogin(loginData) {
        // Credenciales de administrador por defecto
        const adminCredentials = {
            email: 'admin@laparada.com',
            password: 'admin123'
        };

        // Credenciales de usuario normal
        const userCredentials = {
            email: 'user@laparada.com',
            password: 'user123'
        };

        // Verificar credenciales de admin
        if (loginData.email === adminCredentials.email && loginData.password === adminCredentials.password) {
            return {
                success: true,
                user: {
                    id: 1,
                    nombre: 'Administrador',
                    apellido: 'Sistema',
                    email: loginData.email,
                    role: 'admin',
                    isAdmin: true,
                    permissions: ['all']
                },
                token: 'mock_admin_token_' + Date.now()
            };
        }

        // Verificar credenciales de usuario normal
        if (loginData.email === userCredentials.email && loginData.password === userCredentials.password) {
            return {
                success: true,
                user: {
                    id: 2,
                    nombre: 'Usuario',
                    apellido: 'Normal',
                    email: loginData.email,
                    role: 'customer',
                    isAdmin: false,
                    permissions: ['shop']
                },
                token: 'mock_user_token_' + Date.now()
            };
        }

        return {
            success: false,
            message: 'Credenciales incorrectas'
        };
    },

    // Guardar sesión
    saveSession() {
        try {
            localStorage.setItem(this.config.sessionKey, JSON.stringify(this.state.isLoggedIn));
            localStorage.setItem(this.config.userKey, JSON.stringify(this.state.currentUser));
        } catch (error) {
            console.error('Error saving session:', error);
        }
    },

    // Limpiar sesión
    clearSession() {
        this.state.isLoggedIn = false;
        this.state.currentUser = null;
        localStorage.removeItem(this.config.sessionKey);
        localStorage.removeItem(this.config.userKey);
    },

    // Cerrar sesión
    logout() {
        this.clearSession();
        this.updateAllLoginButtons();

        // Redirigir a inicio
        if (window.location.pathname !== '/index.html') {
            window.location.href = '../../index.html';
        }
    },

    // Actualizar todos los botones de login en la página
    updateAllLoginButtons() {
        const loginButtons = document.querySelectorAll('#loginBtn, .btn-login');

        loginButtons.forEach(button => {
            if (this.state.isLoggedIn && this.state.currentUser) {
                // Usuario logueado - mostrar info de usuario
                button.innerHTML = `
                    <i class="fas fa-user-circle me-1"></i>
                    <span class="d-none d-md-inline">${this.state.currentUser.nombre}</span>
                `;
                button.classList.remove('btn-login');
                button.classList.add('btn-user-logged');

                // Cambiar comportamiento del click
                button.onclick = (e) => {
                    e.preventDefault();
                    this.showUserMenu(e);
                };

            } else {
                // Usuario no logueado - mostrar botón de login
                button.innerHTML = `
                    <i class="fas fa-user me-1"></i>
                    <span class="d-none d-md-inline">Iniciar sesión</span>
                `;
                button.classList.remove('btn-user-logged');
                button.classList.add('btn-login');
                button.onclick = null;
                button.href = 'pages/auth/login.html';
            }
        });

        // Disparar evento personalizado para otros módulos
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: {
                isLoggedIn: this.state.isLoggedIn,
                user: this.state.currentUser
            }
        }));
    },

    // Mostrar menú de usuario
    showUserMenu(event) {
        event.preventDefault();

        // Crear menú desplegable
        const existingMenu = document.querySelector('.user-dropdown-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement('div');
        menu.className = 'user-dropdown-menu';
        menu.innerHTML = `
            <div class="dropdown-item">
                <i class="fas fa-user me-2"></i>
                Mi Perfil
            </div>
            <div class="dropdown-item">
                <i class="fas fa-shopping-bag me-2"></i>
                Mis Pedidos
            </div>
            <hr class="dropdown-divider">
            <div class="dropdown-item logout-item" onclick="AuthModule.logout()">
                <i class="fas fa-sign-out-alt me-2"></i>
                Cerrar Sesión
            </div>
        `;

        // Posicionar menú
        const button = event.target.closest('a');
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.right = (window.innerWidth - rect.right) + 'px';
        menu.style.zIndex = '9999';

        document.body.appendChild(menu);

        // Cerrar menú al hacer click fuera
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    },

    // Actualizar estado de UI
    updateUIState() {
        this.updateAllLoginButtons();
    },

    // Validar formulario de login
    validateLoginForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        return isValid;
    },

    // Validar campo individual
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `El campo ${this.getFieldLabel(fieldName)} es requerido.`;
        }

        if (value && fieldName === 'correo') {
            if (!this.config.emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingrese un correo electrónico válido.';
            }
        }

        if (value && fieldName === 'password') {
            if (value.length < this.config.minPasswordLength) {
                isValid = false;
                errorMessage = `La contraseña debe tener al menos ${this.config.minPasswordLength} caracteres.`;
            }
        }

        if (isValid) {
            this.showFieldSuccess(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Obtener etiqueta del campo
    getFieldLabel(fieldName) {
        const labels = {
            'correo': 'Correo',
            'password': 'Contraseña'
        };
        return labels[fieldName] || fieldName;
    },

    // Mostrar error en campo
    showFieldError(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        const feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = 'block';
        }
    },

    // Mostrar éxito en campo
    showFieldSuccess(field) {
        field.classList.remove('is-invalid');
        if (field.value.trim()) {
            field.classList.add('is-valid');
        }

        const feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.style.display = 'none';
        }
    },

    // Limpiar error de campo
    clearFieldError(event) {
        const field = event.target;
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
            const feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.style.display = 'none';
            }
        }
    },

    // Toggle visibilidad de contraseña
    togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        const toggleButton = document.getElementById('togglePassword');
        const icon = toggleButton.querySelector('i');

        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    },

    // Mostrar/ocultar loading
    showLoading(show) {
        const loginButton = document.getElementById('loginButton');
        const btnText = loginButton.querySelector('.btn-text');
        const btnLoading = loginButton.querySelector('.btn-loading');

        if (show) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            loginButton.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            loginButton.disabled = false;
        }
    },

    // Mostrar mensaje
    showMessage(message, type) {
        const messageDiv = document.getElementById('loginMessage');
        const messageText = document.getElementById('messageText');
        const alert = messageDiv.querySelector('.alert');

        messageText.textContent = message;
        alert.className = `alert alert-${type}`;

        messageDiv.style.display = 'block';
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
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
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AuthModule.init();
});

// Exponer globalmente
window.AuthModule = AuthModule;
