// ===== PRODUCTS MANAGER =====
class ProductsManager {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
    }

    // Inicializar
    async init() {
        console.log('🛍️ Initializing Products Manager...');

        const currentPath = window.location.pathname;

        if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
            await this.loadFeaturedProducts();
        } else if (currentPath.includes('catalog.html')) {
            await this.loadAllProducts();
        }

        this.updateCartBadge();
        console.log('✅ Products Manager ready');
    }

    // ===== LOAD FEATURED PRODUCTS (INDEX) =====
    // ===== LOAD FEATURED PRODUCTS (INDEX) =====
    async loadFeaturedProducts() {
        try {
            console.log('⭐ Loading featured products for index...');

            // ✅ USAR TU CONTENEDOR REAL
            const container = document.querySelector('#productsContainer');
            if (!container) {
                console.log('❌ productsContainer not found!');
                return;
            }

            console.log('✅ Found container:', container);
            this.showLoading(container);

            // Cargar productos desde API
            this.products = await API.getProducts();

            console.log(`✅ Loaded ${this.products.length} products from API`);

            if (this.products.length > 0) {
                // Tomar primeros 6 para featured
                const featuredProducts = this.products.slice(0, 6);
                this.renderProducts(container, featuredProducts);
            } else {
                this.showError(container);
            }

        } catch (error) {
            console.error('❌ Error loading featured products:', error);
            this.showError(document.querySelector('#productsContainer'));
        }
    }

    // ===== LOAD ALL PRODUCTS (CATALOG) =====
    async loadAllProducts() {
        try {
            console.log('📋 Loading all products for catalog...');

            // ✅ USAR CONTENEDOR DE CATALOG (cuando tengas catalog.html)
            const container = document.querySelector('#productsGrid') || document.querySelector('#productsContainer');
            if (!container) {
                console.log('❌ Products container not found in catalog');
                return;
            }

            this.showLoading(container);

            // Cargar todos los productos desde API
            this.products = await API.getProducts();

            console.log(`✅ Loaded ${this.products.length} products`);
            this.renderProducts(container, this.products);

        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.showError(container);
        }
    }

    // ===== RENDER PRODUCTS =====
    renderProducts(container) {
        if (!container || this.products.length === 0) {
            this.showError(container);
            return;
        }

        const productsHTML = this.products.map(product => this.createProductCard(product)).join('');
        container.innerHTML = productsHTML;
    }

    // ===== CREATE PRODUCT CARD =====
    createProductCard(product) {
        console.log('🃏 Creating card for product:', product);
        console.log('🖼️ Image field check:', {
            imagen: product.imagen,
            imagenUrl: product.imagenUrl,
            imageUrl: product.imageUrl,
            image: product.image
        });

        // ✅ FUNCIÓN MEJORADA PARA MANEJAR RUTAS DUPLICADAS
        const getImageUrl = (product) => {
            const imagen = product.imagen || product.imagenUrl || product.imageUrl || product.image;

            console.log('🔍 Original imagen value:', imagen);

            if (!imagen || imagen === null || imagen === undefined || imagen === '') {
                console.log('⚠️ No image found, using placeholder');
                return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s';
            }

            // Si ya es una URL completa (HTTP)
            if (imagen.startsWith('http')) {
                console.log('✅ Using HTTP image:', imagen);
                return imagen;
            }

            // Si ya es una ruta absoluta desde la raíz
            if (imagen.startsWith('/')) {
                console.log('✅ Using absolute path:', imagen);
                return imagen;
            }

            // ✅ Si ya contiene la ruta completa (empieza con frontend/)
            if (imagen.startsWith('frontend/')) {
                const finalPath = '/' + imagen;
                console.log('✅ Using existing full path:', finalPath);
                return finalPath;
            }

            // Si es solo el nombre del archivo
            const fullPath = '/frontend/assets/images/productos/' + imagen;
            console.log('✅ Building full path:', fullPath);
            return fullPath;
        };

        const imageUrl = getImageUrl(product);
        const precio = parseFloat(product.precio || 0).toFixed(2);

        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card producto-card h-100 shadow-sm">
                <div class="card-img-wrapper">
                    <img src="${imageUrl}" 
                         class="card-img-top" 
                         alt="${this.escapeHtml(product.nombre || 'Producto')}"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s'">
                    ${product.destacado ? '<div class="badge bg-warning position-absolute top-0 start-0 m-2">Destacado</div>' : ''}
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${this.escapeHtml(product.nombre || 'Sin nombre')}</h5>
                    <p class="card-text text-muted small">${this.escapeHtml(product.descripcion || 'Producto de calidad')}</p>
                    <p class="card-text"><small class="text-muted">Categoría: ${this.escapeHtml(product.categoria || 'General')}</small></p>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="h5 text-primary mb-0">S/ ${precio}</span>
                            <span class="badge ${(product.stock || 0) > 0 ? 'bg-success' : 'bg-danger'}">
                                Stock: ${product.stock || 0}
                            </span>
                        </div>
                        
                        <button class="btn btn-primary w-100 ${(product.stock || 0) === 0 ? 'disabled' : ''}" 
                                onclick="PRODUCTS.addToCart(${product.id})"
                                ${(product.stock || 0) === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-2"></i>
                            ${(product.stock || 0) === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }


    // ✅ MÉTODO HELPER PARA ESCAPAR HTML
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // ✅ AGREGAR MÉTODO escapeHtml SI NO EXISTE
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }


    // ===== ADD TO CART =====
    // ===== ADD TO CART - DELEGADO =====
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            console.error('❌ Product not found:', productId);
            return;
        }

        // ✅ DELEGAR AL CART MANAGER
        if (window.CART) {
            CART.addToCart(productId, product);
        } else {
            console.error('❌ Cart Manager not available');
        }
    }


    // ===== UPDATE CART BADGE =====
    updateCartBadge() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

        // Buscar diferentes posibles badges
        const badges = [
            document.querySelector('.cart-count'),
            document.querySelector('#cart-badge'),
            document.querySelector('.badge-cart'),
            document.querySelector('[data-cart-count]')
        ];

        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'inline' : 'none';
            }
        });

        console.log('🛒 Cart updated:', totalItems, 'items');
    }

    // ===== UI HELPERS =====
    showLoading(container) {
        if (!container) return;

        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando productos...</p>
            </div>
        `;
    }

    showError(container) {
        if (!container) return;

        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No se pudieron cargar los productos. 
                    <button class="btn btn-outline-warning btn-sm ms-2" onclick="location.reload()">
                        Reintentar
                    </button>
                </div>
            </div>
        `;
    }

    showToast(message) {
        console.log('📢 Showing toast:', message);

        // Remove existing toasts
        document.querySelectorAll('.toast-custom').forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = 'toast-custom';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
        `;
        toast.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Global instance
window.PRODUCTS = new ProductsManager();
console.log('🛍️ Products Manager loaded');
