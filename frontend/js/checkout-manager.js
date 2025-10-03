// ===== CHECKOUT MANAGER ADAPTADO =====

// ===== GLOBAL FUNCTIONS FOR HTML =====
const cartLink = '/frontend/pages/cart/cart.html';   // <- una sola verdad
class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
        this.products = [];
        this.isProcessing = false;
    }

    // ===== INICIALIZAR =====
    async init() {
        console.log('💳 Checkout Manager initializing...');

        const currentPath = window.location.pathname;

        if (currentPath.includes('checkout.html')) {
            await this.loadCheckoutPage();
        } else if (currentPath.includes('order-confirmation.html')) {
            this.loadConfirmationPage();
        }

        console.log('✅ Checkout Manager ready');
    }

    // ===== LOAD CHECKOUT PAGE =====
    async loadCheckoutPage() {
        console.log('💳 Loading checkout page...');

        // Verificar login
        if (!API.isLoggedIn()) {
            alert('Debes iniciar sesión para continuar con la compra');
            window.location.href = '../auth/login.html';
            return;
        }

        // Verificar carrito
        if (this.cart.length === 0) {
            alert('Tu carrito está vacío');
            window.location.href = cartLink;
            return;
        }

        try {
            // Cargar productos
            this.products = await API.getProducts();

            // Pre-llenar datos del usuario
            this.fillUserData();

            // Render order summary
            this.renderOrderSummary();

            // Bind form
            this.bindCheckoutForm();

            // Bind card formatting
            this.bindCardFormatting();

        } catch (error) {
            console.error('❌ Error loading checkout:', error);
            this.showError('Error al cargar la página de checkout');
        }
    }

    // ===== FILL USER DATA =====
    fillUserData() {
        const user = API.getUser();
        if (!user) return;

        // Pre-llenar campos del usuario
        const emailField = document.querySelector('#correo');
        if (emailField && user.email) {
            emailField.value = user.email;
        }

        // Extraer nombre y apellido si el nombre completo existe
        if (user.nombre) {
            const nameParts = user.nombre.split(' ');
            const nombreField = document.querySelector('#nombre');
            const apellidoField = document.querySelector('#apellido');

            if (nombreField && nameParts.length > 0) {
                nombreField.value = nameParts[0];
            }
            if (apellidoField && nameParts.length > 1) {
                apellidoField.value = nameParts.slice(1).join(' ');
            }
        }

        // Pre-llenar dirección si existe
        const direccionField = document.querySelector('#direccion');
        if (direccionField && user.direccion) {
            direccionField.value = user.direccion;
        }
    }

    // ===== RENDER ORDER SUMMARY =====
    renderOrderSummary() {
        const itemsContainer = document.querySelector('#orderItems');
        const subtotalElement = document.querySelector('#orderSubtotal');
        const shippingElement = document.querySelector('#orderShipping');
        const totalElement = document.querySelector('#orderTotal');

        if (!itemsContainer) {
            console.log('❌ Order items container not found');
            return;
        }

        let subtotal = 0;

        // Render items
        const itemsHTML = this.cart.map(item => {
            const product = this.products.find(p => p.id === item.id);
            if (!product) return '';

            const itemTotal = product.precio * item.quantity;
            subtotal += itemTotal;

            // Asegurar ruta absoluta para la imagen
            const imageUrl = product.imagenUrl.startsWith('/')
                ? product.imagenUrl
                : '/' + product.imagenUrl;

            return `
            <div class="order-item d-flex align-items-center py-3 border-bottom">
                <img src="${imageUrl}" 
                     alt="${product.nombre}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="ms-3 flex-grow-1">
                    <h6 class="mb-1">${product.nombre}</h6>
                    <small class="text-muted">Cantidad: ${item.quantity}</small>
                    <br>
                    <small class="text-success fw-bold">S/ ${product.precio} c/u</small>
                </div>
                <div class="text-end">
                    <strong class="text-success">S/ ${itemTotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
        }).join('');

        itemsContainer.innerHTML = itemsHTML;

        // Update totals
        const shipping = 10.00; // Costo fijo de envío
        const total = subtotal + shipping;

        if (subtotalElement) subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `S/ ${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `S/ ${total.toFixed(2)}`;
    }

    // ===== BIND CHECKOUT FORM =====
    bindCheckoutForm() {
        const form = document.querySelector('#checkoutForm');
        if (!form) {
            console.log('❌ Checkout form not found');
            return;
        }

        console.log('🔗 Binding checkout form...');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Validar formulario
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            await this.processOrder(form);
        });

        // Bind payment method toggle
        const paymentRadios = form.querySelectorAll('input[name="metodo_pago"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.togglePaymentMethod(e.target.value);
            });
        });
    }

    // ===== TOGGLE PAYMENT METHOD =====
    togglePaymentMethod(method) {
        const cardFields = document.querySelector('#cardPaymentFields');
        const paypalFields = document.querySelector('#paypalPaymentFields');

        if (method === 'tarjeta') {
            if (cardFields) cardFields.style.display = 'block';
            if (paypalFields) paypalFields.style.display = 'none';

            // Hacer requeridos los campos de tarjeta
            const cardInputs = cardFields.querySelectorAll('input');
            cardInputs.forEach(input => input.required = true);
        } else if (method === 'paypal') {
            if (cardFields) cardFields.style.display = 'none';
            if (paypalFields) paypalFields.style.display = 'block';

            // Quitar requeridos de campos de tarjeta
            const cardInputs = cardFields.querySelectorAll('input');
            cardInputs.forEach(input => input.required = false);
        }
    }

    // ===== BIND CARD FORMATTING =====
    bindCardFormatting() {
        // Formatear número de tarjeta
        const cardNumber = document.querySelector('#numero_tarjeta');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Formatear fecha de caducidad
        const expiry = document.querySelector('#caducidad');
        if (expiry) {
            expiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Solo números en CVV
        const cvv = document.querySelector('#cvv');
        if (cvv) {
            cvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    // ===== PROCESS ORDER =====
    async processOrder(form) {
        if (this.isProcessing) return;

        console.log('🔄 Processing order...');

        try {
            this.isProcessing = true;
            const submitButton = form.querySelector('#submitCheckout');

            // Loading state
            this.setButtonLoading(submitButton, true);

            // Get form data
            const formData = new FormData(form);
            const orderData = this.buildOrderData(formData);

            console.log('📦 Order data:', orderData);

            // Create order via API
            const response = await API.createOrder(orderData);

            console.log('✅ Order created:', response);

            // Clear cart
            localStorage.removeItem('lp_cart');

            // Redirect to confirmation
            window.location.href = `order-confirmation.html?orderId=${response.id}`;

        } catch (error) {
            console.error('❌ Error processing order:', error);
            this.showError(`Error al procesar el pedido: ${error.message}`);

            const submitButton = form.querySelector('#submitCheckout');
            this.setButtonLoading(submitButton, false);
        } finally {
            this.isProcessing = false;
        }
    }
    // ===== BUILD ORDER DATA - FORMATO CORRECTO =====
    buildOrderData(formData) {
        const user = API.getUser();

        // Items del carrito - FORMATO EXACTO PARA BACKEND
        const items = this.cart.map(item => ({
            productoId: parseInt(item.id),
            cantidad: parseInt(item.quantity)
        }));

        // Calcular total
        const subtotal = this.cart.reduce((sum, item) => {
            const product = this.products.find(p => p.id === item.id);
            return sum + (product ? product.precio * item.quantity : 0);
        }, 0);

        const shipping = 10.00;
        const total = subtotal + shipping;

        // Dirección completa
        const direccion = formData.get('direccion') || 'Dirección no especificada';
        const ciudad = formData.get('ciudad') || 'Lima';
        const referencia = formData.get('referencia');

        const direccionCompleta = referencia
            ? `${direccion}, ${ciudad} - Ref: ${referencia}`
            : `${direccion}, ${ciudad}`;

        // OBJETO EN FORMATO EXACTO PARA BACKEND
        const orderData = {
            usuarioId: parseInt(user.id),
            items: items,
            direccionEntrega: direccionCompleta,
            metodoPago: formData.get('metodo_pago')?.toUpperCase() || 'TARJETA',
            tipoEntrega: 'DELIVERY',
            total: parseFloat(total.toFixed(2))
        };

        console.log('📦 Order data (detailed):', orderData);
        console.log('📋 Items details:', items);

        return orderData;
    }


    // ===== UI HELPERS =====
    setButtonLoading(button, loading) {
        if (!button) return;

        const submitText = button.querySelector('.submit-text');
        const submitLoading = button.querySelector('.submit-loading');

        if (loading) {
            button.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoading) submitLoading.style.display = 'inline';
        } else {
            button.disabled = false;
            if (submitText) submitText.style.display = 'inline';
            if (submitLoading) submitLoading.style.display = 'none';
        }
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;

        const container = document.querySelector('.checkout-form-container');
        if (container) {
            container.insertBefore(alert, container.firstChild);
        }

        setTimeout(() => alert.remove(), 5000);
    }
}


window.CheckoutModule = {
    goBack: () => {
        window.location.href = cartLink;
    },

    togglePaymentMethod: (method) => {
        if (window.CHECKOUT) {
            CHECKOUT.togglePaymentMethod(method);
        }
    },

    showTerms: () => {
        alert('Términos y condiciones - Funcionalidad pendiente');
    },

    showPrivacy: () => {
        alert('Política de privacidad - Funcionalidad pendiente');
    }
};

// ===== GLOBAL INSTANCE =====
window.CHECKOUT = new CheckoutManager();
console.log('💳 Checkout Manager loaded');
