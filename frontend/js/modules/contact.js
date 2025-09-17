// ===== MÓDULO CONTACTO =====
const ContactModule = {
    // Configuración
    config: {
        apiEndpoint: 'https://formspree.io/f/YOUR_FORM_ID', // Cambiar por tu endpoint
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\+]?[1-9][\d]{0,15}$/
    },

    // Estado
    state: {
        isSubmitting: false,
        formData: {}
    },

    // Inicializar
    init() {
        this.clearInitialErrors(); // NUEVO: Limpiar errores iniciales
        this.bindEvents();
        this.updateCartFromStorage();
        console.log('📞 Contact Module initialized');
    },
    clearInitialErrors() {
        // Esperar un momento para que el DOM esté completamente cargado
        setTimeout(() => {
            const formControls = document.querySelectorAll('.form-control');
            const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');

            // Remover todas las clases de validación
            formControls.forEach(control => {
                control.classList.remove('is-invalid', 'is-valid');
            });

            // Ocultar todos los mensajes de error
            invalidFeedbacks.forEach(feedback => {
                feedback.style.display = 'none';
            });

            console.log('✅ Errores iniciales limpiados');
        }, 100);
    },
    // Vincular eventos
    bindEvents() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));

            // Validación en tiempo real
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        }
    },

    // Manejar envío del formulario
    async handleFormSubmit(event) {
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
            this.state.formData = Object.fromEntries(formData);

            // Simular envío (reemplazar con tu lógica de backend)
            await this.submitForm(this.state.formData);

            this.showMessage('¡Gracias por contactarnos! Te responderemos pronto.', 'success');
            form.reset();
            this.clearAllValidation(form);

        } catch (error) {
            console.error('Error sending form:', error);
            this.showMessage('Hubo un error al enviar el mensaje. Por favor intente nuevamente.', 'danger');
        } finally {
            this.state.isSubmitting = false;
            this.showLoading(false);
        }
    },

    // Simular envío del formulario
    async submitForm(formData) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Aquí puedes integrar con:
        // 1. Formspree: fetch(this.config.apiEndpoint, {...})
        // 2. EmailJS: emailjs.send(...)
        // 3. Web3Forms: fetch('https://api.web3forms.com/submit', {...})
        // 4. Tu backend en Spring Boot: fetch('/api/contact', {...})

        console.log('Form data to send:', formData);

        // Simular éxito/error aleatoriamente para demo
        if (Math.random() > 0.1) {
            return { success: true };
        } else {
            throw new Error('Network error');
        }
    },

    // Validar formulario completo
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });

        return isValid;
    },
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Solo validar si el usuario ha interactuado con el campo
        if (!value && field.hasAttribute('required')) {
            isValid = false;
            errorMessage = `El campo ${this.getFieldLabel(fieldName)} es requerido.`;
        }

        // Validaciones específicas solo si hay valor
        if (value) {
            if (fieldName === 'correo' && !this.config.emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Ingrese un correo electrónico válido.';
            }

            if (fieldName === 'nombre' && value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres.';
            }

            if (fieldName === 'apellido' && value.length < 2) {
                isValid = false;
                errorMessage = 'El apellido debe tener al menos 2 caracteres.';
            }

            if (fieldName === 'asunto' && value.length < 5) {
                isValid = false;
                errorMessage = 'El asunto debe tener al menos 5 caracteres.';
            }

            if (fieldName === 'mensaje' && value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres.';
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

    // Obtener etiqueta del campo
    getFieldLabel(fieldName) {
        const labels = {
            'nombre': 'Nombre',
            'apellido': 'Apellido',
            'correo': 'Correo',
            'asunto': 'Asunto',
            'mensaje': 'Mensaje'
        };
        return labels[fieldName] || fieldName;
    },

    // Mostrar error en campo
    showFieldError(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = 'block'; // Mostrar explícitamente
        }
    },

    // Mostrar éxito en campo
    showFieldSuccess(field) {
        field.classList.remove('is-invalid');

        // Solo mostrar válido si tiene contenido
        if (field.value.trim()) {
            field.classList.add('is-valid');
        }

        // Ocultar mensaje de error
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.style.display = 'none';
        }
    },
    // Limpiar error de campo
    clearFieldError(event) {
        const field = event.target;

        // Solo limpiar si hay contenido
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
            const feedback = field.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.style.display = 'none';
            }
        }
    },
    // Limpiar todas las validaciones
    clearAllValidation(form) {
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    },

    // Mostrar/ocultar loading
    showLoading(show) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (show) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    },

    // Mostrar mensaje de respuesta
    showMessage(message, type) {
        const responseDiv = document.getElementById('responseMessage');
        const responseText = document.getElementById('responseText');
        const alert = responseDiv.querySelector('.alert');

        responseText.textContent = message;
        alert.className = `alert alert-${type}`;

        responseDiv.style.display = 'block';
        responseDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto ocultar después de 5 segundos para mensajes de éxito
        if (type === 'success') {
            setTimeout(() => {
                responseDiv.style.display = 'none';
            }, 5000);
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

    // Utilidades
    utils: {
        // Sanitizar entrada de usuario
        sanitizeInput(input) {
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        },

        // Formatear datos para envío
        formatFormData(formData) {
            return {
                nombre: formData.nombre?.trim(),
                apellido: formData.apellido?.trim(),
                correo: formData.correo?.trim().toLowerCase(),
                asunto: formData.asunto?.trim(),
                mensaje: formData.mensaje?.trim(),
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ContactModule.init();
});

// Exponer globalmente
window.ContactModule = ContactModule;
