// ===== CART MANAGER - LÓGICA LIMPIA =====
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
        this.products = [];
    }

    // ===== INICIALIZAR =====
    init() {
        console.log('🛒 Cart Manager initializing...');

        const currentPath = window.location.pathname;
        const cartLink = '/frontend/pages/cart/cart.html';   // <- una sola verdad

        if (currentPath.includes(cartLink)) {
            this.loadCartPage();
        }

        this.updateCartBadge();
        console.log('✅ Cart Manager ready');
    }

    // ===== ADD TO CART (MÉTODO PRINCIPAL) =====
    async addToCart(productId, productData = null) {
        console.log('🛒 Adding to cart:', productId);

        try {
            // Si no tenemos los datos del producto, cargarlos
            if (!productData) {
                if (this.products.length === 0) {
                    this.products = await API.getProducts();
                }
                productData = this.products.find(p => p.id === productId);
            }

            if (!productData) {
                console.error('❌ Product not found:', productId);
                return false;
            }

            // Buscar si ya existe en el carrito
            const existingIndex = this.cart.findIndex(item => item.id === productId);

            if (existingIndex >= 0) {
                // Ya existe, aumentar cantidad
                const currentQuantity = this.cart[existingIndex].quantity;

                if (currentQuantity < productData.stock) {
                    this.cart[existingIndex].quantity++;
                    console.log('✅ Quantity increased to:', this.cart[existingIndex].quantity);
                } else {
                    alert('No hay más stock disponible');
                    return false;
                }
            } else {
                // No existe, agregar nuevo
                this.cart.push({
                    id: productData.id,
                    nombre: productData.nombre,
                    precio: parseFloat(productData.precio),
                    imagen: productData.imagenUrl,
                    quantity: 1,
                    stock: productData.stock
                });
                console.log('✅ New product added to cart');
            }

            // Guardar y actualizar UI
            this.saveCart();
            this.updateCartBadge();
            this.refreshCartPage();

            this.showToast(`${productData.nombre} agregado al carrito`);
            return true;

        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            return false;
        }
    }

    // ===== UPDATE QUANTITY =====
    updateQuantity(productId, newQuantity) {
        console.log(`🔄 Updating quantity: ${productId} → ${newQuantity}`);

        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex === -1) {
            console.error('❌ Item not found in cart');
            return;
        }

        const item = this.cart[itemIndex];
        const product = this.products.find(p => p.id === productId);

        if (product && newQuantity > product.stock) {
            alert(`Solo hay ${product.stock} unidades disponibles`);
            return;
        }

        // Actualizar cantidad
        this.cart[itemIndex].quantity = newQuantity;

        // Guardar y actualizar
        this.saveCart();
        this.updateCartBadge();
        this.refreshCartPage();

        console.log('✅ Quantity updated successfully');
    }

    // ===== REMOVE FROM CART =====
    removeFromCart(productId) {
        console.log(`🗑️ Removing product: ${productId}`);

        const originalLength = this.cart.length;
        this.cart = this.cart.filter(item => item.id !== productId);

        if (this.cart.length < originalLength) {
            this.saveCart();
            this.updateCartBadge();
            this.refreshCartPage();
            this.showToast('Producto eliminado del carrito', 'warning');
            console.log('✅ Product removed successfully');
        }
    }

    // ===== CLEAR CART =====
    clearCart(confirmDialog = true) {
        // Si se pide confirmación y el usuario cancela, no hacer nada
        if (confirmDialog && !confirm('¿Estás seguro de vaciar el carrito?')) return;

        this.cart = [];

        // Guardar carrito vacío en localStorage
        this.saveCart();

        // Actualizar badge del carrito
        this.updateCartBadge();

        // Refrescar página del carrito si estás en cart.html
        if (typeof this.refreshCartPage === "function") {
            this.refreshCartPage();
        }

        // Solo mostrar alerta si el vaciado fue manual
        if (confirmDialog && typeof this.showToast === "function") {
            this.showToast('Carrito vaciado', 'info');
        }
    }

    // ===== SAVE CART =====
    saveCart() {
        localStorage.setItem('lp_cart', JSON.stringify(this.cart));
        console.log('💾 Cart saved:', this.cart.length, 'items');
    }

    // ===== UPDATE CART BADGE =====
    updateCartBadge() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        const badges = [
            document.querySelector('#cartCount'),
            document.querySelector('.cart-count'),
            document.querySelector('.cart-badge')
        ];

        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
            }
        });

        console.log('🛒 Badge updated:', totalItems, 'items');
    }

    // ===== REFRESH CART PAGE =====
    refreshCartPage() {
        const cartContainer = document.querySelector('#cartTableBody');
        if (cartContainer) {
            console.log('🔄 Refreshing cart page...');

            if (this.cart.length === 0) {
                this.showEmptyCart();
            } else {
                this.renderCartItems(cartContainer);
                this.renderCartSummary();
                this.showCartElements();
            }
        }
    }

    // ===== LOAD CART PAGE =====
    async loadCartPage() {
        console.log('🛒 Loading cart page...');

        const cartContainer = document.querySelector('#cartTableBody');
        if (!cartContainer) {
            console.log('❌ Cart container not found');
            return;
        }

        if (this.cart.length === 0) {
            this.showEmptyCart();
            return;
        }

        try {
            // Cargar productos si no están cargados
            if (this.products.length === 0) {
                this.products = await API.getProducts();
            }

            this.renderCartItems(cartContainer);
            this.renderCartSummary();
            this.showCartElements();

        } catch (error) {
            console.error('❌ Error loading cart page:', error);
        }
    }

    // ===== RENDER CART ITEMS =====
    renderCartItems(container) {
        const cartItemsHTML = this.cart.map(item => {
            const product = this.products.find(p => p.id === item.id);
            if (!product) return '';

            const subtotal = (product.precio * item.quantity).toFixed(2);

            // Usar ruta absoluta para las imágenes almacenadas en el backend
            const imageUrl = product.imagenUrl.startsWith('/')
                ? product.imagenUrl
                : '/' + product.imagenUrl;

            return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${imageUrl}" 
                             alt="${product.nombre}" 
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                        <div class="ms-3">
                            <h6 class="mb-0">${product.nombre}</h6>
                            <small class="text-muted">${product.categoria}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <strong>S/ ${product.precio}</strong>
                </td>
                <td class="text-center">
                    <div class="d-flex align-items-center justify-content-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" 
                                onclick="CART.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="fw-bold mx-2" style="min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary ms-2" 
                                onclick="CART.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <small class="text-muted d-block mt-1">Stock: ${product.stock}</small>
                </td>
                <td class="text-center">
                    <strong class="text-success">S/ ${subtotal}</strong>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" 
                            onclick="CART.removeFromCart(${item.id})"
                            title="Eliminar producto">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        }).join('');

        container.innerHTML = cartItemsHTML;
    }


    // ===== RENDER CART SUMMARY =====
    renderCartSummary() {
        const total = this.cart.reduce((sum, item) => {
            const product = this.products.find(p => p.id === item.id);
            return sum + (product ? product.precio * item.quantity : 0);
        }, 0).toFixed(2);

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        // Actualizar elementos del resumen
        const subtotalElement = document.querySelector('#cartSubtotal');
        const totalElement = document.querySelector('#cartTotal');

        if (subtotalElement) subtotalElement.textContent = `S/ ${total}`;
        if (totalElement) totalElement.textContent = `S/ ${total}`;
    }

    // ===== SHOW/HIDE ELEMENTS =====
    showCartElements() {
        const elements = [
            '#cartTableContainer',
            '#cartActions',
            '#cartSummaryContainer'
        ];

        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = 'block';
        });

        const emptyState = document.querySelector('#emptyCartState');
        if (emptyState) emptyState.style.display = 'none';
    }

    showEmptyCart() {
        const hideElements = [
            '#cartTableContainer',
            '#cartActions',
            '#cartSummaryContainer'
        ];

        hideElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.style.display = 'none';
        });

        const emptyState = document.querySelector('#emptyCartState');
        if (emptyState) emptyState.style.display = 'block';
    }

    // ===== TOAST MESSAGES =====
    showToast(message, type = 'success') {
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${colors[type]}; color: white; 
            padding: 12px 20px; border-radius: 5px; z-index: 9999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        toast.innerHTML = `<i class="fas fa-info-circle me-2"></i>${message}`;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// ===== GLOBAL INSTANCE =====
window.CART = new CartManager();
console.log('🛒 Cart Manager loaded');// ===== CART MODULE PARA HTML (al final del archivo) =====
window.CartModule = {
    // Función para ir al checkout
    proceedToCheckout: () => {
        console.log('🛒 Proceeding to checkout...');

        const cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');

        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de continuar.');
            return;
        }

        // Verificar login
        if (!API.isLoggedIn()) {
            if (confirm('Debes iniciar sesión para continuar. ¿Quieres ir al login?')) {
                window.location.href = '../auth/login.html';
            }
            return;
        }

        // Ir a checkout
        window.location.href = '../checkout/checkout.html';
    },

    // Función para limpiar carrito
    clearCart: () => {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            if (window.CART) {
                CART.clearCart();
            } else {
                localStorage.removeItem('lp_cart');
                window.location.reload();
            }
        }
    },

    // Función para aplicar cupón (placeholder)
    applyCoupon: () => {
        const couponInput = document.querySelector('#couponInput');
        if (couponInput && couponInput.value.trim()) {
            alert(`Función de cupón "${couponInput.value}" será implementada próximamente.`);
        } else {
            alert('Ingresa un código de cupón válido.');
        }
    }
};

console.log('🛒 CartModule functions loaded');

