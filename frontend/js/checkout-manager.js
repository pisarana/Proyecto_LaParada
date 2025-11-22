// ===== CHECKOUT MANAGER ADAPTADO =====

// ===== GLOBAL FUNCTIONS FOR HTML =====
const cartLink = '/frontend/pages/cart/cart.html';   // <- una sola verdad

class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
        this.products = [];
        this.isProcessing = false;
        this.currentOrder = null;
    }

    // ===== INICIALIZAR =====
    async init() {
        console.log('💳 Checkout Manager initializing...');

        const currentPath = window.location.pathname;

        if (currentPath.includes('checkout.html')) {
            await this.loadCheckoutPage();
        } else if (currentPath.includes('order-confirmation.html')) {
            this.loadConfirmationPage();
            // ⚠️ salir aquí para evitar validaciones de carrito vacío
            return;
        }

        console.log('✅ Checkout Manager ready');
    }

    // ===== LOAD CHECKOUT PAGE =====
    async loadCheckoutPage() {
        console.log('💳 Loading checkout page...');

        if (!API.isLoggedIn()) {
            alert('Debes iniciar sesión para continuar con la compra');
            window.location.href = '../auth/login.html';
            return;
        }

        // Cargar carrito actualizado desde storage
        this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');

        if (this.cart.length === 0) {
            alert('Tu carrito está vacío');
            window.location.href = cartLink;
            return;
        }

        try {
            this.products = await API.getProducts();
        } catch (err) {
            console.warn('⚠ No se pudieron cargar productos del backend, seguiremos con lo que haya en el carrito', err);
            this.products = [];
        }

        this.fillUserData();
        this.renderOrderSummary();
        this.bindCheckoutForm();
        this.bindCardFormatting(); // 🟢 mantenemos formato de tarjeta

        this.togglePaymentMethod(document.querySelector('input[name="metodo_pago"]:checked')?.value || 'tarjeta');
    }

    // ===== FILL USER DATA =====
    fillUserData() {
        const user = API.getUser();
        if (!user) return;

        const emailField = document.querySelector('#correo');
        if (emailField && user.email) emailField.value = user.email;

        if (user.nombre) {
            const nameParts = user.nombre.split(' ');
            const nombreField = document.querySelector('#nombre');
            const apellidoField = document.querySelector('#apellido');
            if (nombreField && nameParts.length > 0) nombreField.value = nameParts[0];
            if (apellidoField && nameParts.length > 1) apellidoField.value = nameParts.slice(1).join(' ');
        }

        const direccionField = document.querySelector('#direccion');
        if (direccionField && user.direccion) direccionField.value = user.direccion;
    }

    // ===== RENDER ORDER SUMMARY =====
    renderOrderSummary() {
        const itemsContainer = document.querySelector('#orderItems');
        const subtotalElement = document.querySelector('#orderSubtotal');
        const shippingElement = document.querySelector('#orderShipping');
        const totalElement = document.querySelector('#orderTotal');

        if (!itemsContainer) return;

        let subtotal = 0;

        const itemsHTML = this.cart.map(item => {
            const idNum = Number(item.id);
            const product = this.products.find(p => Number(p.id) === idNum) || null;

            const nombre = product?.nombre || item.nombre || 'Producto';
            const precioNum = (product?.precio ?? item.precio ?? 0);
            const cantidad = Number(item.quantity || item.cantidad || 0);
            const itemTotal = (Number(precioNum) || 0) * cantidad;
            subtotal += itemTotal;

            const imageCandidate = product?.imagenUrl || product?.imagen || item.imagen || '';
            const imageUrl = imageCandidate
                ? (imageCandidate.startsWith('/') || imageCandidate.startsWith('http') ? imageCandidate : '/' + imageCandidate)
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s';

            return `
            <div class="order-item d-flex align-items-center py-3 border-bottom">
                <img src="${imageUrl}" alt="${this.escapeHtml(nombre)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="ms-3 flex-grow-1">
                    <h6 class="mb-1">${this.escapeHtml(nombre)}</h6>
                    <small class="text-muted">Cantidad: ${cantidad}</small>
                    <br>
                    <small class="text-success fw-bold">S/ ${Number(precioNum).toFixed(2)} c/u</small>
                </div>
                <div class="text-end">
                    <strong class="text-success">S/ ${itemTotal.toFixed(2)}</strong>
                </div>
            </div>`;
        }).join('');

        itemsContainer.innerHTML = itemsHTML;

        const shipping = 10.00;
        const total = subtotal + shipping;

        if (subtotalElement) subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `S/ ${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `S/ ${total.toFixed(2)}`;
    }

    // ===== BIND CHECKOUT FORM =====
    bindCheckoutForm() {
        const form = document.querySelector('#checkoutForm');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            await this.processOrder(form);
        });

        const paymentRadios = form.querySelectorAll('input[name="metodo_pago"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => this.togglePaymentMethod(e.target.value));
        });
    }

    // ===== TOGGLE PAYMENT METHOD =====
    togglePaymentMethod(method) {
        const cardFields = document.querySelector('#cardPaymentFields');
        if (method === 'tarjeta') {
            if (cardFields) cardFields.style.display = 'block';
            cardFields?.querySelectorAll('input').forEach(i => i.required = true);
        }
    }

    // ===== CARD FORMATTING =====
    bindCardFormatting() {
        const cardNumber = document.querySelector('#numero_tarjeta');
        const cardExpiry = document.querySelector('#caducidad');
        const cardCvv = document.querySelector('#cvv');

        if (cardNumber) {
            cardNumber.addEventListener('input', e => {
                let val = e.target.value.replace(/\D/g, '').substring(0,16);
                e.target.value = val.match(/.{1,4}/g)?.join(' ') || val;
            });
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('input', e => {
                let val = e.target.value.replace(/\D/g, '').substring(0,4);
                if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2);
                e.target.value = val;
            });
        }

        if (cardCvv) {
        cardCvv.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0,4); // permite 3 o 4 dígitos
        });
    }

    }

    // ===== PROCESS ORDER =====
    async processOrder(form) {
        if (this.isProcessing) return;

        try {
            this.isProcessing = true;
            const submitButton = form.querySelector('#submitCheckout');
            this.setButtonLoading(submitButton, true);

            this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
            if (this.cart.length === 0) {
                this.showError('El carrito está vacío');
                this.setButtonLoading(submitButton, false);
                this.isProcessing = false;
                return;
            }

            const formData = new FormData(form);
            const orderData = this.buildOrderData(formData);

            const response = await API.createOrder(orderData);

            const snapshotItems = orderData.items.map(item => {
                const idNum = Number(item.productoId);
                const productFromProducts = (this.products || []).find(p => Number(p.id) === idNum) || null;
                return {
                    productoId: idNum,
                    cantidad: Number(item.cantidad),
                    precio: Number(productFromProducts?.precio ?? 0),
                    producto: {
                        id: idNum,
                        nombre: productFromProducts?.nombre || 'Producto',
                        precio: Number(productFromProducts?.precio ?? 0),
                        imagenUrl: productFromProducts?.imagenUrl || productFromProducts?.imagen || ''
                    }
                };
            });

            const lastOrder = {
                id: response.id ?? Date.now(),
                usuario: API.getUser(),
                items: snapshotItems,
                direccionEntrega: orderData.direccionEntrega,
                total: Number(orderData.total),
                fechaCreacion: response.fechaCreacion ?? new Date().toISOString()
            };

            // Guardar para confirmation page
            sessionStorage.setItem("lastOrder", JSON.stringify(lastOrder));

            let allOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
            allOrders.push(lastOrder);
            localStorage.setItem("userOrders", JSON.stringify(allOrders));

            // Redirigir primero
            window.location.href = `./order-confirmation.html?orderId=${encodeURIComponent(lastOrder.id)}`;

        } catch (error) {
            console.error('❌ Error processing order:', error);
            this.showError(`Error al procesar el pedido: ${error.message || error}`);
        } finally {
            this.isProcessing = false;
        }
    }

    buildOrderData(formData) {
        const user = API.getUser();
        const cartFromStorage = JSON.parse(localStorage.getItem('lp_cart') || '[]');

        const items = cartFromStorage.map(item => ({
            productoId: Number(item.id),
            cantidad: Number(item.quantity ?? item.cantidad ?? 0)
        }));

        const subtotal = cartFromStorage.reduce((sum, item) => {
            const prod = (this.products || []).find(p => Number(p.id) === Number(item.id));
            const precio = Number(prod?.precio ?? item.precio ?? 0);
            return sum + (precio * Number(item.quantity ?? item.cantidad ?? 0));
        }, 0);

        const shipping = 10.00;
        const total = subtotal + shipping;

        const direccion = formData.get('direccion') || 'Dirección no especificada';
        const ciudad = formData.get('ciudad') || 'Lima';
        const referencia = formData.get('referencia');
        const direccionCompleta = referencia ? `${direccion}, ${ciudad} - Ref: ${referencia}` : `${direccion}, ${ciudad}`;

        return {
            usuarioId: Number(user?.id ?? 0),
            items,
            direccionEntrega: direccionCompleta,
            metodoPago: (formData.get('metodo_pago') || 'TARJETA').toUpperCase(),
            tipoEntrega: 'DELIVERY',
            total: Number(total.toFixed(2))
        };
    }

    // ===== LOAD CONFIRMATION PAGE =====
    loadConfirmationPage() {
        console.log('🎉 Loading order confirmation page...');
        const lastOrderStr = sessionStorage.getItem("lastOrder");
        if (!lastOrderStr) {
            console.warn("⚠ No lastOrder found in sessionStorage");
            return;
        }

        const lastOrder = JSON.parse(lastOrderStr);
        this.currentOrder = lastOrder;

        const container = document.querySelector('#confirmationContainer') || document.body;

        const itemsHTML = (lastOrder.items || []).map(item => {
            const nombre = item.producto?.nombre ?? 'Producto';
            const precio = Number(item.precio ?? 0);
            const cantidad = Number(item.cantidad ?? 0);
            return `
                <div class="order-item d-flex justify-content-between border-bottom py-2">
                    <span>${this.escapeHtml(String(nombre))} x ${cantidad}</span>
                    <strong>S/ ${(precio * cantidad).toFixed(2)}</strong>
                </div>`;
        }).join('');

        container.innerHTML = `
            <h3 class="mb-3">¡Pedido Confirmado! 🎉</h3>
            <p>Gracias por su compra. Aquí está el resumen de su pedido:</p>
            <p><strong>ID del pedido:</strong> ${this.escapeHtml(String(lastOrder.id))}</p>
            <div class="order-items mt-3">${itemsHTML}</div>
            <h4 class="mt-3">Total a pagar: <strong>S/ ${Number(lastOrder.total ?? 0).toFixed(2)}</strong></h4>
            <div class="mt-4">
                <a href="/frontend/pages/products/catalog.html" class="btn btn-primary me-2">Volver a la tienda</a>
                <a href="/frontend/index.html" class="btn btn-outline-secondary">Ir al inicio</a>
            </div>
        `;

        // Vaciar carrito después de mostrar confirmation
        localStorage.removeItem('lp_cart');
        if (window.PRODUCTS) {
            window.PRODUCTS.cart = [];
            window.PRODUCTS.updateCartBadge();
        }
    }

    escapeHtml(text) {
        if (!text && text !== 0) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

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
        alert.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${this.escapeHtml(String(message))}<button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>`;
        const container = document.querySelector('.checkout-form-container');
        if (container) container.insertBefore(alert, container.firstChild);
        setTimeout(() => alert.remove(), 5000);
    }
}

// ===== GLOBAL INSTANCE =====
window.CHECKOUT = new CheckoutManager();
console.log('💳 Checkout Manager loaded');