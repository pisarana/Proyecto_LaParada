// ===== MÓDULO DE REGISTRO =====
const RegisterModule = {
    // Configuración
    config: {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\+]?[1-9][\d]{8,14}$/,
        minPasswordLength: 6,
        sessionKey: 'laparada_session',
        userKey: 'laparada_user'
    },

    // Estado
    state: {
        isSubmitting: false,
        passwordStrength: 'weak'
    },

    // Inicializar
    init() {
        this.bindEvents();
        this.updateCartFromStorage();
        console.log('📝 Register Module initialized');
    },

    // Vincular eventos
    bindEvents() {
        const registerForm = document.getElementById('registerForm');
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');
        const termsCheckbox = document.getElementById('terminos'); // ← AGREGAR ESTO
        
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
            
            // Validación en tiempo real
            const inputs = registerForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        }
    
        if (togglePassword) {
            togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        }
    
        if (passwordField) {
            passwordField.addEventListener('input', this.checkPasswordStrength.bind(this));
        }
        
        // NUEVO: Validación del checkbox en tiempo real
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.hideCheckboxError(e.target);
                }
            });
        }
    },

    // Manejar registro
    async handleRegister(event) {
        event.preventDefault();

        if (this.state.isSubmitting) return;

        const form = event.target;
        const isValid = this.validateForm(form);

        if (!isValid) {
            this.showMessage('Por favor corrija los errores en el formulario.', 'danger');
            return;
        }

        this.state.isSubmitting = true;
        this.showLoading(true);

        try {
            const formData = new FormData(form);
            const userData = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                correo: formData.get('correo'),
                telefono: formData.get('telefono'),
                password: formData.get('password')
            };

            const registerResult = await this.registerUser(userData);

            if (registerResult.success) {
                this.handleRegisterSuccess(registerResult.user);
            } else {
                this.showMessage(registerResult.message, 'danger');
            }

        } catch (error) {
            console.error('Register error:', error);
            this.showMessage('Error de conexión. Por favor intente nuevamente.', 'danger');
        } finally {
            this.state.isSubmitting = false;
            this.showLoading(false);
        }
    },

    // Registrar usuario (mock - reemplazar con backend real)
    async registerUser(userData) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar si el email ya existe (simulado)
        const existingEmails = [
            'admin@laparada.com',
            'cliente@laparada.com'
        ];

        if (existingEmails.includes(userData.correo)) {
            return {
                success: false,
                message: 'Este correo ya está registrado'
            };
        }

        // Simular registro exitoso
        const newUser = {
            id: Date.now(),
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo,
            telefono: userData.telefono,
            rol: 'CLIENTE',
            fechaRegistro: new Date().toISOString()
        };

        return {
            success: true,
            user: newUser
        };
    },

    // Manejar registro exitoso
    handleRegisterSuccess(user) {
        this.showMessage(`¡Cuenta creada exitosamente! Bienvenido ${user.nombre}`, 'success');

        // Limpiar formulario
        document.getElementById('registerForm').reset();
        this.clearAllValidation();

        // Redirigir a login después de 3 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    },

    // Validar formulario completo
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        const checkbox = form.querySelector('#terminos');  // Checkbox términos
        let isValid = true;

        // Validar campos de texto
        inputs.forEach(input => {
            if (input.type !== 'checkbox' && !this.validateField({ target: input })) {
                isValid = false;
            }
        });

        // NUEVA VALIDACIÓN: Checkbox de términos
        if (!checkbox.checked) {
            this.showCheckboxError(checkbox, 'Debe aceptar los términos y condiciones.');
            isValid = false;
        } else {
            this.hideCheckboxError(checkbox);
        }

        return isValid;
    },
    showCheckboxError(checkbox, message) {
        // Agregar clase de error al checkbox
        checkbox.classList.add('is-invalid');

        // Buscar o crear mensaje de error
        let errorMsg = checkbox.parentNode.querySelector('.checkbox-error');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'checkbox-error invalid-feedback';
            errorMsg.style.display = 'block';
            checkbox.parentNode.appendChild(errorMsg);
        }

        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    },

    // NUEVA FUNCIÓN: Ocultar error en checkbox  
    hideCheckboxError(checkbox) {
        checkbox.classList.remove('is-invalid');
        const errorMsg = checkbox.parentNode.querySelector('.checkbox-error');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
    },
    // Validar campo individual
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Validar campo requerido
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `El campo ${this.getFieldLabel(fieldName)} es requerido.`;
        }

        // Validaciones específicas
        if (value) {
            switch (fieldName) {
                case 'correo':
                    if (!this.config.emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingrese un correo electrónico válido.';
                    }
                    break;

                case 'telefono':
                    if (!this.config.phoneRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Ingrese un teléfono válido (9 dígitos mínimo).';
                    }
                    break;

                case 'nombre':
                case 'apellido':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = `El ${fieldName} debe tener al menos 2 caracteres.`;
                    }
                    break;

                case 'password':
                    if (value.length < this.config.minPasswordLength) {
                        isValid = false;
                        errorMessage = `La contraseña debe tener al menos ${this.config.minPasswordLength} caracteres.`;
                    }
                    break;
            }
        }

        // Mostrar/ocultar error
        if (isValid) {
            this.showFieldSuccess(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Verificar fortaleza de la contraseña
    checkPasswordStrength(event) {
        const password = event.target.value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        let strength = 'weak';
        let score = 0;

        // Criterios de fortaleza
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        // Determinar fortaleza
        if (score >= 4) {
            strength = 'strong';
            strengthText.textContent = 'Contraseña fuerte';
        } else if (score >= 2) {
            strength = 'medium';
            strengthText.textContent = 'Contraseña media';
        } else {
            strength = 'weak';
            strengthText.textContent = 'Contraseña débil';
        }

        // Actualizar barra visual
        strengthBar.className = `strength-bar ${strength}`;
        this.state.passwordStrength = strength;
    },

    // Obtener etiqueta del campo
    getFieldLabel(fieldName) {
        const labels = {
            'nombre': 'Nombre',
            'apellido': 'Apellido',
            'correo': 'Correo',
            'telefono': 'Teléfono',
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

    // Limpiar todas las validaciones
    clearAllValidation() {
        const fields = document.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });

        // Resetear barra de fortaleza
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        if (strengthBar) {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Fortaleza de la contraseña';
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
        const registerButton = document.getElementById('registerButton');
        const btnText = registerButton.querySelector('.btn-text');
        const btnLoading = registerButton.querySelector('.btn-loading');

        if (show) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            registerButton.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            registerButton.disabled = false;
        }
    },

    // Mostrar mensaje
    showMessage(message, type) {
        const messageDiv = document.getElementById('registerMessage');
        const messageText = document.getElementById('registerMessageText');
        const alert = messageDiv.querySelector('.alert');

        messageText.textContent = message;
        alert.className = `alert alert-${type}`;

        messageDiv.style.display = 'block';
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 4000);
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
    RegisterModule.init();
});

// Exponer globalmente
window.RegisterModule = RegisterModule;
