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
                        window.location.href = '../admin/dashboard.html';
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

                // Get form data
                const formData = new FormData(registerForm);
                const userData = {
                    nombre: `${formData.get('nombre')} ${formData.get('apellidos')}`,
                    email: formData.get('correo'),
                    password: formData.get('password')
                };

                console.log('🔍 Register data:', { ...userData, password: '***' });

                // Call API
                await API.register(userData);

                // Success message
                this.showMessage('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success');

                // Redirect to login
                setTimeout(() => {
                    console.log('🔄 Redirecting to login...');
                    window.location.href = '../../login.html';
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
    updateNavbar() {
        const loginBtn = document.getElementById('loginBtn');
        if (!loginBtn) return;

        const user = API.getUser();

        if (user) {
            console.log('👤 User logged in, updating navbar:', user.nombre);

            loginBtn.innerHTML = `
                <div class="user-menu">
                    <i class="fas fa-user-circle"></i>
                    <span class="d-none d-md-inline ms-1">${user.nombre}</span>
                    <i class="fas fa-chevron-down ms-1"></i>
                </div>
            `;

            // Add click handler for user menu
            loginBtn.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu(e);
            };

        } else {
            console.log('🚪 No user logged in');

            // Reset to original login button
            loginBtn.innerHTML = `
                <i class="fas fa-user me-1"></i>
                <span class="d-none d-md-inline">Iniciar sesión</span>
            `;
            loginBtn.onclick = null;
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
                window.location.href = '../index.html';
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

// Global instance
window.AUTH = new AuthManager();
console.log('🔐 Auth Manager loaded');
