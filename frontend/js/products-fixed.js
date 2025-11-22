// ===== CONFIG BACKEND =====
const API_BASE_URL = "http://localhost:8080/api/products";

// ===== PRODUCTS MANAGER =====
class ProductsManager {
    constructor() {
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('lp_cart') || '[]');
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    async init() {
        console.log('🛍️ Initializing Products Manager...');

        const currentPath = window.location.pathname;

        if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
            await this.loadFeaturedProducts();
        } else if (currentPath.includes('catalog.html')) {
            await this.loadAllProducts();
        }

        this.updateCartBadge();
        console.log('✅ Products UI Manager ready');
    }

    // ==========================================
    // FETCH PRODUCTS (BACKEND SPRING)
    // ==========================================
    async fetchAllProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}?page=0&size=999`);

            if (!response.ok) {
                console.error("❌ Error HTTP:", response.status);
                return [];
            }

            const data = await response.json();

            if (!data || !data.content) {
                console.error("❌ Backend devolvió formato inesperado:", data);
                return [];
            }

            return data.content;
        } catch (err) {
            console.error("❌ Error de conexión:", err);
            return [];
        }
    }

    // ==========================================
    // LOAD FEATURED PRODUCTS (INDEX)
    // ==========================================
    async loadFeaturedProducts() {
        try {
            console.log('⭐ Loading featured products...');

            const container = document.querySelector('#productsContainer');
            if (!container) return;

            this.showLoading(container);

            // Cargar productos del backend
            this.products = await this.fetchAllProducts();

            // Guardar en variable global
            window.PRODUCTS = this.products;

            console.log(`📦 Loaded featured: ${this.products.length} products`);

            if (this.products.length === 0) return this.showError(container);

            const featured = this.products.slice(0, 6);
            this.renderProducts(container, featured);

        } catch (error) {
            console.error('❌ Error loading featured:', error);
            this.showError(document.querySelector('#productsContainer'));
        }
    }

    // ==========================================
    // LOAD ALL PRODUCTS (CATALOG)
    // ==========================================
    async loadAllProducts() {
        try {
            console.log('📋 Loading ALL products...');

            const container =
                document.querySelector('#productsGrid') ||
                document.querySelector('#productsContainer');

            if (!container) return;

            this.showLoading(container);

            this.products = await this.fetchAllProducts();

            window.PRODUCTS = this.products;

            console.log(`📦 Loaded all: ${this.products.length} products`);

            this.renderProducts(container, this.products);

        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.showError(container);
        }
    }

    // ==========================================
    // RENDER PRODUCTS
    // ==========================================
    renderProducts(container, productsArray = []) {
        if (!container || productsArray.length === 0) {
            return this.showError(container);
        }

        container.innerHTML = productsArray
            .map(product => this.createProductCard(product))
            .join('');
    }

    // ==========================================
    // CREATE PRODUCT CARD
    // ==========================================
    createProductCard(product) {
        const imageUrl = this.getImageUrl(product);
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
                    <h5 class="card-title">${this.escapeHtml(product.nombre)}</h5>
                    <p class="card-text text-muted small">${this.escapeHtml(product.descripcion || '')}</p>

                    <p class="card-text">
                        <small class="text-muted">Categoría: ${this.escapeHtml(product.categoria || 'General')}</small>
                    </p>

                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="h5 text-primary mb-0">S/ ${precio}</span>
                            <span class="badge ${(product.stock || 0) > 0 ? 'bg-success' : 'bg-danger'}">
                                Stock: ${product.stock}
                            </span>
                        </div>

                        <button class="btn btn-primary w-100 ${(product.stock || 0) === 0 ? 'disabled' : ''}" 
                                onclick="ProductsUI.addToCart(${product.id})"
                                ${(product.stock || 0) === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-2"></i>
                            ${(product.stock || 0) === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ==========================================
    // IMAGE URL FIX
    // ==========================================
    getImageUrl(product) {
        const imagen = product.imagen || product.imagenUrl || product.imageUrl || product.image;

        if (!imagen) {
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s';
        }

        if (imagen.startsWith('http')) return imagen;
        if (imagen.startsWith('/')) return imagen;
        if (imagen.startsWith('frontend/')) return '/' + imagen;

        return '/frontend/assets/images/productos/' + imagen;
    }

    // ==========================================
    // ESCAPE HTML
    // ==========================================
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ==========================================
    // ADD TO CART
    // ==========================================
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            console.error('❌ Product not found:', productId);
            return;
        }

        if (window.CART) {
            CART.addToCart(productId, product);
        } else {
            console.error('❌ CART Manager missing');
        }
    }

    // ==========================================
    // UPDATE CART BADGE
    // ==========================================
    updateCartBadge() {
        const total = this.cart.reduce((s, i) => s + i.quantity, 0);

        const badges = [
            document.querySelector('.cart-count'),
            document.querySelector('#cart-badge'),
            document.querySelector('.badge-cart'),
            document.querySelector('[data-cart-count]')
        ];

        badges.forEach(b => {
            if (b) {
                b.textContent = total;
                b.style.display = total > 0 ? 'inline' : 'none';
            }
        });

        console.log('🛒 Cart badge updated:', total);
    }

    // ==========================================
    // HELPERS
    // ==========================================
    showLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2">Cargando productos...</p>
            </div>`;
    }

    showError(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No se pudieron cargar los productos.
                </div>
            </div>`;
    }
}

// === GLOBAL INSTANCE ===
window.ProductsUI = new ProductsManager();
console.log('🛍️ Products UI Manager loaded');