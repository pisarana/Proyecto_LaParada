// ===== MÓDULO DEL CARRITO =====
const CartModule = {
    // Estado
    state: {
        cartItems: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        appliedCoupon: null
    },

    // Configuración
    config: {
        storageKey: 'laparada_cart',
        freeShippingMinimum: 50,
        coupons: {
            'DESCUENTO10': { type: 'percentage', value: 10, minimum: 20 },
            'ENVIOGRATIS': { type: 'free_shipping', value: 0, minimum: 30 },
            'NUEVO5': { type: 'fixed', value: 5, minimum: 15 }
        }
    },

    // Inicializar
    init() {
        this.loadCartFromStorage();
        this.renderCart();
        this.bindEvents();
        console.log('🛒 Cart Module initialized');
    },

    // Vincular eventos
    bindEvents() {
        // Aplicar cupón con Enter
        document.getElementById('couponInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyCoupon();
            }
        });

        // Actualizar contador del navbar
        this.updateNavbarCart();
    },

    // Cargar carrito desde localStorage
    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem(this.config.storageKey);
            if (cartData) {
                this.state.cartItems = JSON.parse(cartData);
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.state.cartItems = [];
        }
    },

    // Guardar carrito en localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.state.cartItems));

            // Disparar evento personalizado para sincronización
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { cartItems: this.state.cartItems }
            }));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    },

    // Renderizar carrito completo
    renderCart() {
        this.calculateTotals();

        if (this.state.cartItems.length === 0) {
            this.showEmptyState();
        } else {
            this.showCartContent();
            this.renderCartItems();
            this.renderCartSummary();
            this.loadRecommendedProducts();
        }

        this.updateNavbarCart();
    },

    // Mostrar estado vacío
    showEmptyState() {
        document.getElementById('cartTableContainer').style.display = 'none';
        document.getElementById('cartActions').style.display = 'none';
        document.getElementById('cartSummaryContainer').style.display = 'none';
        document.getElementById('recommendedSection').style.display = 'none';
        document.getElementById('emptyCartState').style.display = 'block';
    },

    // Mostrar contenido del carrito
    showCartContent() {
        document.getElementById('emptyCartState').style.display = 'none';
        document.getElementById('cartTableContainer').style.display = 'block';
        document.getElementById('cartActions').style.display = 'block';
        document.getElementById('cartSummaryContainer').style.display = 'block';
        document.getElementById('recommendedSection').style.display = 'block';
    },

    // Renderizar items del carrito
    renderCartItems() {
        const tbody = document.getElementById('cartTableBody');

        tbody.innerHTML = this.state.cartItems.map(item => `
            <tr data-item-id="${item.id}">
                <td>
                    <div class="cart-item-product">
                        <img src="${item.image}" 
                             alt="${item.name}" 
                             class="cart-item-image"
                             onerror="this.src='https://via.placeholder.com/60x60/f8f9fa/6c757d?text=Producto'">
                        <div class="cart-item-info">
                            <h6>${item.name}</h6>
                            <span class="cart-item-category">${this.getCategoryName(item.category)}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="cart-item-price">S/. ${item.price.toFixed(2)}</span>
                </td>
                <td>
                    <div class="quantity-controls">
                        <button class="quantity-btn" 
                                onclick="CartModule.updateQuantity(${item.id}, ${item.quantity - 1})"
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="quantity-input" 
                               value="${item.quantity}"
                               min="1" 
                               max="${item.stock || 99}"
                               onchange="CartModule.updateQuantity(${item.id}, this.value)">
                        <button class="quantity-btn" 
                                onclick="CartModule.updateQuantity(${item.id}, ${item.quantity + 1})"
                                ${item.quantity >= (item.stock || 99) ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <span class="cart-item-subtotal">S/. ${(item.price * item.quantity).toFixed(2)}</span>
                </td>
                <td>
                    <button class="remove-item-btn" 
                            onclick="CartModule.removeItem(${item.id})"
                            title="Eliminar producto">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    // Renderizar resumen del carrito
    renderCartSummary() {
        document.getElementById('cartSubtotal').textContent = `S/. ${this.state.subtotal.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `S/. ${this.state.total.toFixed(2)}`;

        // Mostrar/ocultar envío
        const shippingRow = document.getElementById('shippingRow');
        if (this.state.shipping > 0) {
            shippingRow.style.display = 'flex';
            document.getElementById('cartShipping').textContent = `S/. ${this.state.shipping.toFixed(2)}`;
        } else {
            shippingRow.style.display = 'none';
        }

        // Mostrar/ocultar descuento
        const discountRow = document.getElementById('discountRow');
        if (this.state.discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('cartDiscount').textContent = `-S/. ${this.state.discount.toFixed(2)}`;
        } else {
            discountRow.style.display = 'none';
        }
    },

    // Calcular totales
    calculateTotals() {
        this.state.subtotal = this.state.cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Calcular envío
        this.state.shipping = this.state.subtotal >= this.config.freeShippingMinimum ? 0 : 10;

        // Aplicar envío gratis si hay cupón
        if (this.state.appliedCoupon && this.state.appliedCoupon.type === 'free_shipping') {
            this.state.shipping = 0;
        }

        // Calcular total
        this.state.total = this.state.subtotal + this.state.shipping - this.state.discount;

        // Asegurar que el total no sea negativo
        if (this.state.total < 0) {
            this.state.total = 0;
        }
    },

    // Actualizar cantidad
    updateQuantity(productId, newQuantity) {
        newQuantity = parseInt(newQuantity);

        if (newQuantity < 1) {
            this.removeItem(productId);
            return;
        }

        const itemIndex = this.state.cartItems.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            const item = this.state.cartItems[itemIndex];

            // Verificar stock disponible
            if (newQuantity > (item.stock || 99)) {
                LaParadaApp.showNotification(`Stock insuficiente. Solo quedan ${item.stock} unidades.`, 'warning');
                return;
            }

            this.state.cartItems[itemIndex].quantity = newQuantity;
            this.saveCartToStorage();
            this.renderCart();

            LaParadaApp.showNotification(`Cantidad actualizada: ${item.name}`, 'success');
        }
    },

    // Remover item
    removeItem(productId) {
        const itemIndex = this.state.cartItems.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            const removedItem = this.state.cartItems[itemIndex];
            this.state.cartItems.splice(itemIndex, 1);
            this.saveCartToStorage();
            this.renderCart();

            LaParadaApp.showNotification(`${removedItem.name} eliminado del carrito`, 'info');
        }
    },

    // Vaciar carrito
    clearCart() {
        if (this.state.cartItems.length === 0) return;

        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.state.cartItems = [];
            this.state.appliedCoupon = null;
            this.state.discount = 0;
            this.saveCartToStorage();
            this.renderCart();

            LaParadaApp.showNotification('Carrito vacío', 'info');
        }
    },

    // Aplicar cupón
    applyCoupon() {
        const couponCode = document.getElementById('couponInput').value.trim().toUpperCase();

        if (!couponCode) {
            LaParradaApp.showNotification('Ingresa un código de cupón', 'warning');
            return;
        }

        if (this.state.appliedCoupon && this.state.appliedCoupon.code === couponCode) {
            LaParadaApp.showNotification('Este cupón ya está aplicado', 'info');
            return;
        }

        const coupon = this.config.coupons[couponCode];
        if (!coupon) {
            LaParadaApp.showNotification('Código de cupón inválido', 'error');
            return;
        }

        if (this.state.subtotal < coupon.minimum) {
            LaParadaApp.showNotification(`Este cupón requiere una compra mínima de S/. ${coupon.minimum.toFixed(2)}`, 'warning');
            return;
        }

        // Aplicar cupón
        this.state.appliedCoupon = { ...coupon, code: couponCode };

        switch (coupon.type) {
            case 'percentage':
                this.state.discount = this.state.subtotal * (coupon.value / 100);
                break;
            case 'fixed':
                this.state.discount = coupon.value;
                break;
            case 'free_shipping':
                this.state.discount = 0; // El envío gratis se maneja en calculateTotals
                break;
        }

        this.renderCart();
        LaParadaApp.showNotification(`Cupón aplicado: ${couponCode}`, 'success');

        // Limpiar input
        document.getElementById('couponInput').value = '';
    },

    // Proceder al checkout

    async proceedToCheckout() {
        if (this.state.cartItems.length === 0) {
            LaParadaApp.showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        // Verificar stock antes de proceder
        const stockCheck = await this.verifyStock();
        if (!stockCheck.valid) {
            LaParadaApp.showNotification(stockCheck.message, 'error');
            return;
        }

        // ESTA ES LA LÍNEA CLAVE - Redirigir a checkout
        LaParadaApp.showNotification('Redirigiendo al checkout...', 'info');

        setTimeout(() => {
            window.location.href = '../checkout/checkout.html'; // ← AQUÍ SE LLAMA
        }, 1000);
    },

    // Verificar stock
    async verifyStock() {
        try {
            for (const item of this.state.cartItems) {
                if (ApiConfig.mode === 'real') {
                    // Verificar stock en backend
                    const response = await fetch(`${ApiConfig.baseURL}/productos/${item.id}/stock`, {
                        headers: ApiConfig.headers
                    });
                    const stockData = await response.json();

                    if (stockData.stock < item.quantity) {
                        return {
                            valid: false,
                            message: `Stock insuficiente para ${item.name}. Solo quedan ${stockData.stock} unidades.`
                        };
                    }
                } else {
                    // Verificación mock
                    const mockProduct = MockData.products.find(p => p.id === item.id);
                    if (mockProduct && mockProduct.stock < item.quantity) {
                        return {
                            valid: false,
                            message: `Stock insuficiente para ${item.name}. Solo quedan ${mockProduct.stock} unidades.`
                        };
                    }
                }
            }

            return { valid: true };
        } catch (error) {
            console.error('Error verifying stock:', error);
            return {
                valid: false,
                message: 'Error al verificar disponibilidad. Intenta nuevamente.'
            };
        }
    },

    // Cargar productos recomendados
    async loadRecommendedProducts() {
        try {
            let recommendedProducts = [];

            if (ApiConfig.mode === 'real') {
                // Obtener recomendaciones del backend
                const response = await fetch(`${ApiConfig.baseURL}/productos/recomendados?limit=4`, {
                    headers: ApiConfig.headers
                });
                recommendedProducts = await response.json();
            } else {
                // Recomendaciones mock basadas en categorías del carrito
                const cartCategories = [...new Set(this.state.cartItems.map(item => item.category))];
                recommendedProducts = MockData.products
                    .filter(product =>
                        cartCategories.includes(product.category) &&
                        !this.state.cartItems.some(cartItem => cartItem.id === product.id)
                    )
                    .slice(0, 4);
            }

            this.renderRecommendedProducts(recommendedProducts);
        } catch (error) {
            console.error('Error loading recommended products:', error);
        }
    },

    // Renderizar productos recomendados
    renderRecommendedProducts(products) {
        const container = document.getElementById('recommendedProducts');

        if (products.length === 0) {
            document.getElementById('recommendedSection').style.display = 'none';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="recommended-item" onclick="CartModule.goToProduct(${product.id})">
                <img src="${product.image}" 
                     alt="${product.name}"
                     onerror="this.src='https://via.placeholder.com/200x120/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                <h6>${product.name}</h6>
                <div class="price">S/. ${product.price.toFixed(2)}</div>
            </div>
        `).join('');
    },

    // Ir a producto
    goToProduct(productId) {
        window.location.href = `../products/detail.html?id=${productId}`;
    },

    // Obtener nombre de categoría
    getCategoryName(categoryId) {
        const category = MockData.categories?.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    },

    // Actualizar contador del navbar
    updateNavbarCart() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.state.cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    // Función pública para agregar productos (llamada desde otros módulos)
    addProduct(product, quantity = 1) {
        const existingItemIndex = this.state.cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            this.state.cartItems[existingItemIndex].quantity += quantity;
        } else {
            this.state.cartItems.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCartToStorage();
        this.updateNavbarCart();
    },

    // Obtener total de items
    getTotalItems() {
        return this.state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },

    // Obtener items del carrito
    getCartItems() {
        return [...this.state.cartItems];
    }
};

// Integración con el sistema global
if (window.LaParadaApp) {
    // Sobrescribir función addToCart del app principal
    window.LaParadaApp.addToCart = function (product, quantity = 1) {
        CartModule.addProduct(product, quantity);
        this.showNotification(`${product.name} agregado al carrito`, 'success');
    };
}

// Escuchar eventos de storage para sincronización
window.addEventListener('storage', (e) => {
    if (e.key === CartModule.config.storageKey) {
        CartModule.loadCartFromStorage();
        CartModule.renderCart();
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    CartModule.init();
});

// Exponer globalmente
window.CartModule = CartModule;
