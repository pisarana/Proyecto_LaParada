// ===== MÓDULO DE CHECKOUT =====
const CheckoutModule = {
    // Estado
    state: {
        cartItems: [],
        orderSummary: {
            subtotal: 0,
            shipping: 10,
            discount: 0,
            total: 0
        },
        paymentMethod: 'tarjeta',
        isProcessing: false
    },

    // Configuración para APIs de pago
    config: {
        stripe: {
            publicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY', // Reemplazar
        },
        paypal: {
            clientId: 'YOUR_PAYPAL_CLIENT_ID' // Reemplazar
        }
    },

    // Inicializar
    init() {
        this.loadCartData();
        this.renderOrderSummary();
        this.bindEvents();
        this.initPaymentMethods();
        this.loadUserData();
        console.log('💳 Checkout Module initialized');
    },

    // Cargar datos del carrito
    loadCartData() {
        try {
            const cartData = localStorage.getItem('laparada_cart');
            if (cartData) {
                this.state.cartItems = JSON.parse(cartData);
            }

            if (this.state.cartItems.length === 0) {
                alert('Tu carrito está vacío');
                window.location.href = '../cart/cart.html';
                return;
            }

            this.calculateTotals();
        } catch (error) {
            console.error('Error loading cart data:', error);
        }
    },

    // Calcular totales
    calculateTotals() {
        this.state.orderSummary.subtotal = this.state.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Envío gratis si supera S/. 50
        this.state.orderSummary.shipping = this.state.orderSummary.subtotal >= 50 ? 0 : 10;

        this.state.orderSummary.total = this.state.orderSummary.subtotal +
            this.state.orderSummary.shipping -
            this.state.orderSummary.discount;
    },

    // Renderizar resumen del pedido
    renderOrderSummary() {
        const orderItems = document.getElementById('orderItems');
        const orderSubtotal = document.getElementById('orderSubtotal');
        const orderShipping = document.getElementById('orderShipping');
        const orderTotal = document.getElementById('orderTotal');

        // Renderizar items
        orderItems.innerHTML = this.state.cartItems.map(item => `
            <div class="order-item">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     class="order-item-image"
                     onerror="this.src='https://via.placeholder.com/50x50/f8f9fa/6c757d?text=Producto'">
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-details">Cantidad: ${item.quantity}</div>
                </div>
                <div class="order-item-price">S/. ${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Actualizar totales
        orderSubtotal.textContent = `S/. ${this.state.orderSummary.subtotal.toFixed(2)}`;
        orderShipping.textContent = this.state.orderSummary.shipping === 0 ? 'GRATIS' : `S/. ${this.state.orderSummary.shipping.toFixed(2)}`;
        orderTotal.textContent = `S/. ${this.state.orderSummary.total.toFixed(2)}`;

        // Mostrar/ocultar descuento
        if (this.state.orderSummary.discount > 0) {
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('orderDiscount').textContent = `-S/. ${this.state.orderSummary.discount.toFixed(2)}`;
        }
    },

    // Cargar datos del usuario (si está logueado)
    loadUserData() {
        try {
            const userData = localStorage.getItem('laparada_user');
            if (userData) {
                const user = JSON.parse(userData);
                document.getElementById('nombre').value = user.nombre || '';
                document.getElementById('apellido').value = user.apellido || '';
                document.getElementById('correo').value = user.correo || '';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },

    // Vincular eventos
    bindEvents() {
        const checkoutForm = document.getElementById('checkoutForm');

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', this.handleSubmit.bind(this));

            // Validación en tiempo real
            const inputs = checkoutForm.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        }

        // Formatear campos específicos
        this.bindCardFormatting();
    },

    // Formatear campos de tarjeta
    bindCardFormatting() {
        const numeroTarjeta = document.getElementById('numero_tarjeta');
        const caducidad = document.getElementById('caducidad');
        const cvv = document.getElementById('cvv');

        if (numeroTarjeta) {
            numeroTarjeta.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        if (caducidad) {
            caducidad.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        if (cvv) {
            cvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    },

    // Cambiar método de pago
    togglePaymentMethod(method) {
        this.state.paymentMethod = method;

        const cardFields = document.getElementById('cardPaymentFields');
        const paypalFields = document.getElementById('paypalPaymentFields');

        if (method === 'tarjeta') {
            cardFields.style.display = 'block';
            paypalFields.style.display = 'none';

            // Hacer campos de tarjeta requeridos
            document.getElementById('numero_tarjeta').required = true;
            document.getElementById('caducidad').required = true;
            document.getElementById('cvv').required = true;
        } else if (method === 'paypal') {
            cardFields.style.display = 'none';
            paypalFields.style.display = 'block';

            // Quitar requerimiento de campos de tarjeta
            document.getElementById('numero_tarjeta').required = false;
            document.getElementById('caducidad').required = false;
            document.getElementById('cvv').required = false;

            this.initPayPal();
        }
    },

    // Inicializar métodos de pago
    initPaymentMethods() {
        // Stripe initialization
        if (window.Stripe && this.config.stripe.publicKey) {
            this.stripe = Stripe(this.config.stripe.publicKey);
        }
    },

    // Inicializar PayPal
    initPayPal() {
        if (window.paypal) {
            paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: this.state.orderSummary.total.toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then((details) => {
                        this.processPayPalPayment(details);
                    });
                }
            }).render('#paypal-button-container');
        }
    },

    // Procesar pago PayPal
    processPayPalPayment(details) {
        console.log('PayPal payment completed:', details);
        this.completeOrder({
            method: 'paypal',
            transactionId: details.id,
            payerId: details.payer.payer_id
        });
    },

    // Validar campo
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validación por tipo de campo
        switch (field.id) {
            case 'nombre':
            case 'apellido':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Debe tener al menos 2 caracteres';
                }
                break;

            case 'correo':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingrese un correo válido';
                }
                break;

            case 'numero_tarjeta':
                const cardNumber = value.replace(/\s/g, '');
                if (cardNumber.length < 13 || cardNumber.length > 19) {
                    isValid = false;
                    errorMessage = 'Número de tarjeta inválido';
                }
                break;

            case 'caducidad':
                const expRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
                if (!expRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Formato: MM/AA';
                } else {
                    // Validar que no esté vencida
                    const [month, year] = value.split('/');
                    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                    if (expDate < new Date()) {
                        isValid = false;
                        errorMessage = 'Tarjeta vencida';
                    }
                }
                break;

            case 'cvv':
                if (value.length < 3 || value.length > 4) {
                    isValid = false;
                    errorMessage = 'CVV de 3-4 dígitos';
                }
                break;
        }

        // Mostrar/ocultar error
        if (isValid) {
            this.showFieldSuccess(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Mostrar error en campo
    showFieldError(field, message) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    },

    // Mostrar éxito en campo
    showFieldSuccess(field) {
        field.classList.remove('is-invalid');
        if (field.value.trim()) {
            field.classList.add('is-valid');
        }
    },

    // Limpiar error de campo
    clearFieldError(event) {
        const field = event.target;
        if (field.value.trim()) {
            field.classList.remove('is-invalid');
        }
    },

    // Manejar envío del formulario
    async handleSubmit(event) {
        event.preventDefault();

        if (this.state.isProcessing) return;

        const form = event.target;
        const isValid = this.validateForm(form);

        if (!isValid) {
            LaParadaApp.showNotification('Por favor corrija los errores en el formulario', 'error');
            return;
        }

        this.state.isProcessing = true;
        this.showLoading(true);

        try {
            const formData = new FormData(form);
            const orderData = this.prepareOrderData(formData);

            if (this.state.paymentMethod === 'tarjeta') {
                await this.processCardPayment(orderData);
            } else if (this.state.paymentMethod === 'paypal') {
                // PayPal se maneja en su propio flujo
                LaParadaApp.showNotification('Complete el pago con PayPal', 'info');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            LaParadaApp.showNotification('Error al procesar el pago. Intente nuevamente.', 'error');
        } finally {
            this.state.isProcessing = false;
            this.showLoading(false);
        }
    },
    // En checkout.js, agregar:
    async processStripePayment(orderData) {
        if (!this.stripe) {
            throw new Error('Stripe no está configurado');
        }

        const cardElement = this.stripe.elements().create('card');
        cardElement.mount('#card-element');

        const { token, error } = await this.stripe.createToken(cardElement);

        if (error) {
            throw new Error(error.message);
        }

        orderData.paymentDetails = {
            cardToken: token.id,
            last4: token.card.last4,
            brand: token.card.brand
        };

        // Enviar al backend
        const response = await fetch(`${ApiConfig.baseURL}/checkout/process-payment`, {
            method: 'POST',
            headers: ApiConfig.headers,
            body: JSON.stringify(orderData)
        });

        return await response.json();
    },

    // Validar formulario completo
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    },

    // Preparar datos del pedido
    prepareOrderData(formData) {
        return {
            customer: {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                correo: formData.get('correo')
            },
            shipping: {
                direccion: formData.get('direccion'),
                ciudad: formData.get('ciudad'),
                referencia: formData.get('referencia') || ''
            },
            items: this.state.cartItems,
            totals: this.state.orderSummary,
            paymentMethod: this.state.paymentMethod
        };
    },

    // Procesar pago con tarjeta (Stripe/backend)
    async processCardPayment(orderData) {
        if (ApiConfig.mode === 'real') {
            // Integración real con backend
            const response = await fetch(`${ApiConfig.baseURL}/checkout/process-payment`, {
                method: 'POST',
                headers: ApiConfig.headers,
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                this.completeOrder(result);
            } else {
                throw new Error(result.message);
            }
        } else {
            // Simulación de pago
            await new Promise(resolve => setTimeout(resolve, 3000));

            this.completeOrder({
                method: 'tarjeta',
                transactionId: 'TXN_' + Date.now(),
                orderId: 'ORD_' + Date.now()
            });
        }
    },

    // Completar pedido
    completeOrder(paymentResult) {
        // Limpiar carrito
        localStorage.removeItem('laparada_cart');

        // Guardar datos del pedido
        const orderData = {
            orderId: paymentResult.orderId || 'ORD_' + Date.now(),
            transactionId: paymentResult.transactionId,
            paymentMethod: paymentResult.method,
            total: this.state.orderSummary.total,
            items: this.state.cartItems,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('last_order', JSON.stringify(orderData));

        LaParadaApp.showNotification('¡Pago procesado exitosamente!', 'success');

        // Redirigir a página de confirmación
        setTimeout(() => {
            window.location.href = 'confirmation.html?order=' + orderData.orderId;
        }, 2000);
    },

    // Mostrar loading
    showLoading(show) {
        const submitButton = document.getElementById('submitCheckout');
        const submitText = submitButton.querySelector('.submit-text');
        const submitLoading = submitButton.querySelector('.submit-loading');

        if (show) {
            submitText.style.display = 'none';
            submitLoading.style.display = 'inline-flex';
            submitButton.disabled = true;
        } else {
            submitText.style.display = 'inline-flex';
            submitLoading.style.display = 'none';
            submitButton.disabled = false;
        }
    },

    // Volver al carrito
    goBack() {
        if (confirm('¿Deseas volver al carrito? Se perderán los datos ingresados.')) {
            window.location.href = '../cart/cart.html';
        }
    },

    // Mostrar términos y condiciones
    showTerms() {
        alert('Términos y condiciones:\n\n1. Al realizar la compra, acepta nuestras condiciones de venta.\n2. Los precios incluyen IGV.\n3. Los productos están sujetos a disponibilidad.\n4. El tiempo de entrega es de 24-48 horas.\n\n(Implementar modal completo según necesidades)');
    },

    // Mostrar política de privacidad
    showPrivacy() {
        alert('Política de privacidad:\n\n1. Sus datos personales están protegidos.\n2. No compartimos información con terceros.\n3. Usamos cookies para mejorar la experiencia.\n4. Sus datos de pago son procesados de forma segura.\n\n(Implementar modal completo según necesidades)');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    CheckoutModule.init();
});

// Exponer globalmente
window.CheckoutModule = CheckoutModule;
