// ===== MÓDULO DE DETALLE DE PRODUCTO =====
const ProductDetailModule = {
    // Estado
    state: {
        currentProduct: null,
        selectedQuantity: 1,
        maxQuantity: 1,
        relatedProducts: []
    },

    // Inicializar
    init() {
        this.getProductFromURL();
        console.log('📦 Product Detail Module initialized');
    },

    // Obtener ID del producto desde URL
    getProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const categoryId = urlParams.get('category');
        
        if (!productId) {
            this.showError('Producto no especificado');
            return;
        }

        this.loadProduct(productId, categoryId);
    },

    // Cargar producto (preparado para backend)
    async loadProduct(productId, categoryId = null) {
        try {
            this.showLoading(true);
            
            let product;
            
            if (ApiConfig.mode === 'real') {
                // Llamada real al backend
                const response = await fetch(`${ApiConfig.baseURL}${ApiConfig.endpoints.productById}${productId}`, {
                    headers: ApiConfig.headers
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                product = await response.json();
            } else {
                // Modo mock
                product = MockData.products.find(p => p.id == productId);
                
                if (!product) {
                    throw new Error('Producto no encontrado');
                }
            }
            
            this.state.currentProduct = product;
            this.state.maxQuantity = product.stock;
            
            this.renderProduct(product);
            this.loadRelatedProducts(product.category);
            this.showLoading(false);
            
        } catch (error) {
            console.error('Error loading product:', error);
            this.showError(error.message);
        }
    },

    // Renderizar producto
    renderProduct(product) {
        // Actualizar meta tags para SEO
        document.title = `${product.name} - Minimarket La Parada`;
        document.querySelector('meta[name="description"]').setAttribute('content', product.description);
        document.querySelector('meta[name="keywords"]').setAttribute('content', `${product.name}, ${product.category}, ${product.brand || ''}`);
        
        // Actualizar breadcrumb
        this.updateBreadcrumb(product);
        
        // Renderizar contenido principal
        const productContent = document.getElementById('productContent');
        
        productContent.innerHTML = `
            <div class="row">
                <!-- Columna Izquierda - Imagen -->
                <div class="col-lg-6 mb-4">
                    <div class="product-image-section">
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="product-main-image"
                             onerror="this.src='https://via.placeholder.com/500x400/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                        
                        ${product.originalPrice ? `
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-danger fs-6">
                                    -${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Columna Derecha - Información -->
                <div class="col-lg-6">
                    <div class="product-info-section">
                        <!-- Categoría -->
                        <div class="product-category-tag">
                            <i class="${this.getCategoryIcon(product.category)} me-2"></i>
                            ${this.getCategoryName(product.category)}
                        </div>
                        
                        <!-- Título -->
                        <h1 class="product-title">${product.name}</h1>
                        
                        <!-- Rating -->
                        <div class="product-rating">
                            <div class="rating-stars">
                                ${this.renderStars(product.rating)}
                            </div>
                            <span class="rating-text">(${product.reviews} reseñas)</span>
                        </div>
                        
                        <!-- Precio -->
                        <div class="product-price-container">
                            <span class="product-current-price">S/. ${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `
                                <span class="product-original-price">S/. ${product.originalPrice.toFixed(2)}</span>
                                <div class="product-savings">
                                    Ahorras S/. ${(product.originalPrice - product.price).toFixed(2)}
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Descripción -->
                        <div class="product-description">
                            <p>${product.description}</p>
                        </div>
                        
                        <!-- Información del producto -->
                        <div class="product-info-grid">
                            <div class="info-item">
                                <span class="info-label">
                                    <i class="fas fa-industry me-2"></i>Marca:
                                </span>
                                <span class="info-value">${product.brand || 'Genérico'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">
                                    <i class="fas fa-barcode me-2"></i>Código:
                                </span>
                                <span class="info-value">${product.barcode || 'No disponible'}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">
                                    <i class="fas fa-boxes me-2"></i>Stock:
                                </span>
                                <span class="info-value">${product.stock} unidades</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">
                                    <i class="fas fa-star me-2 text-warning"></i>Rating:
                                </span>
                                <span class="info-value">${product.rating}/5.0</span>
                            </div>
                        </div>
                        
                        <!-- Selector de cantidad -->
                        <div class="quantity-selector">
                            <h6 class="mb-3">
                                <i class="fas fa-sort-numeric-up me-2"></i>
                                Cantidad:
                            </h6>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="ProductDetailModule.changeQuantity(-1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" 
                                       class="quantity-input" 
                                       id="quantityInput"
                                       value="1" 
                                       min="1" 
                                       max="${product.stock}"
                                       onchange="ProductDetailModule.validateQuantity()">
                                <button class="quantity-btn" onclick="ProductDetailModule.changeQuantity(1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Botones de acción -->
                        <div class="product-actions">
                            <button class="btn btn-add-to-cart w-100" 
                                    onclick="ProductDetailModule.addToCart()"
                                    ${product.stock <= 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus me-2"></i>
                                ${product.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                            </button>
                            
                            <div class="secondary-actions">
                                <button class="btn btn-secondary-action" onclick="ProductDetailModule.addToWishlist()">
                                    <i class="fas fa-heart me-2"></i>Favoritos
                                </button>
                                <button class="btn btn-secondary-action" onclick="ProductDetailModule.shareProduct()">
                                    <i class="fas fa-share-alt me-2"></i>Compartir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Características del producto -->
            ${product.features ? `
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="product-features">
                            <h5 class="features-title">
                                <i class="fas fa-list-check me-2"></i>
                                Características
                            </h5>
                            <ul class="features-list">
                                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    },

    // Actualizar breadcrumb
    updateBreadcrumb(product) {
        const breadcrumbProduct = document.getElementById('breadcrumbProduct');
        const breadcrumbNav = document.getElementById('breadcrumbNav');
        
        // Agregar categoría al breadcrumb
        const categoryItem = document.createElement('li');
        categoryItem.className = 'breadcrumb-item';
        categoryItem.innerHTML = `<a href="catalog.html?category=${product.category}">${this.getCategoryName(product.category)}</a>`;
        
        breadcrumbNav.insertBefore(categoryItem, breadcrumbProduct);
        breadcrumbProduct.textContent = product.name;
    },

    // Cambiar cantidad
    changeQuantity(delta) {
        const quantityInput = document.getElementById('quantityInput');
        let newQuantity = parseInt(quantityInput.value) + delta;
        
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > this.state.maxQuantity) newQuantity = this.state.maxQuantity;
        
        quantityInput.value = newQuantity;
        this.state.selectedQuantity = newQuantity;
    },

    // Validar cantidad
    validateQuantity() {
        const quantityInput = document.getElementById('quantityInput');
        let quantity = parseInt(quantityInput.value);
        
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        } else if (quantity > this.state.maxQuantity) {
            quantity = this.state.maxQuantity;
        }
        
        quantityInput.value = quantity;
        this.state.selectedQuantity = quantity;
    },

    // Agregar al carrito
    async addToCart() {
        const product = this.state.currentProduct;
        const quantity = this.state.selectedQuantity;
        
        if (!product || product.stock <= 0) return;
        
        try {
            if (ApiConfig.mode === 'real') {
                // Backend real
                const response = await fetch(`${ApiConfig.baseURL}${ApiConfig.endpoints.addToCart}`, {
                    method: 'POST',
                    headers: ApiConfig.headers,
                    body: JSON.stringify({
                        productId: product.id,
                        quantity: quantity
                    })
                });
                
                if (response.ok) {
                    LaParadaApp.showNotification(`${quantity}x ${product.name} agregado al carrito`, 'success');
                }
            } else {
                // Modo mock
                for (let i = 0; i < quantity; i++) {
                    LaParadaApp.addToCart(product);
                }
            }
            
            // Resetear cantidad
            document.getElementById('quantityInput').value = 1;
            this.state.selectedQuantity = 1;
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            LaParadaApp.showNotification('Error al agregar al carrito', 'error');
        }
    },

    // Agregar a favoritos
    addToWishlist() {
        const product = this.state.currentProduct;
        if (product) {
            LaParadaApp.showNotification(`${product.name} agregado a favoritos`, 'success');
            // Aquí implementar lógica de favoritos
        }
    },

    // Compartir producto
    shareProduct() {
        const product = this.state.currentProduct;
        if (!product) return;
        
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copiar URL
            navigator.clipboard.writeText(window.location.href).then(() => {
                LaParadaApp.showNotification('Enlace copiado al portapapeles', 'success');
            }).catch(() => {
                LaParadaApp.showNotification('No se pudo compartir el producto', 'error');
            });
        }
    },

    // Cargar productos relacionados
    async loadRelatedProducts(categoryId) {
        try {
            let relatedProducts;
            
            if (ApiConfig.mode === 'real') {
                const response = await fetch(`${ApiConfig.baseURL}/productos/categoria/${categoryId}?limit=4`, {
                    headers: ApiConfig.headers
                });
                relatedProducts = await response.json();
            } else {
                // Filtrar productos de la misma categoría (excluyendo el actual)
                relatedProducts = MockData.products
                    .filter(p => p.category === categoryId && p.id !== this.state.currentProduct.id)
                    .slice(0, 4);
            }
            
            this.renderRelatedProducts(relatedProducts);
            
        } catch (error) {
            console.error('Error loading related products:', error);
        }
    },

    // Renderizar productos relacionados
    renderRelatedProducts(products) {
        const container = document.getElementById('relatedProducts');
        
        if (products.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay productos relacionados disponibles.</p>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="related-product-card" onclick="ProductDetailModule.goToProduct(${product.id})">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="related-product-image"
                         onerror="this.src='https://via.placeholder.com/200x150/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                    <h6 class="related-product-name">${product.name}</h6>
                    <div class="related-product-price">S/. ${product.price.toFixed(2)}</div>
                </div>
            </div>
        `).join('');
    },

    // Ir a otro producto
    goToProduct(productId) {
        window.location.href = `detail.html?id=${productId}`;
    },

    // Renderizar estrellas
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    },

    // Obtener nombre de categoría
    getCategoryName(categoryId) {
        const category = MockData.categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    },

    // Obtener icono de categoría
    getCategoryIcon(categoryId) {
        const category = MockData.categories.find(cat => cat.id === categoryId);
        return category ? category.icon : 'fas fa-tag';
    },

    // Mostrar loading
    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const productSection = document.getElementById('productDetailSection');
        const errorState = document.getElementById('errorState');
        
        if (show) {
            loadingState.style.display = 'block';
            productSection.style.display = 'none';
            errorState.style.display = 'none';
        } else {
            loadingState.style.display = 'none';
            productSection.style.display = 'block';
            errorState.style.display = 'none';
        }
    },

    // Mostrar error
    showError(message) {
        const loadingState = document.getElementById('loadingState');
        const productSection = document.getElementById('productDetailSection');
        const errorState = document.getElementById('errorState');
        
        loadingState.style.display = 'none';
        productSection.style.display = 'none';
        errorState.style.display = 'block';
        
        console.error('Product Detail Error:', message);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ProductDetailModule.init();
});

// Exponer globalmente
window.ProductDetailModule = ProductDetailModule;
