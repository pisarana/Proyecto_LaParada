// ===== MÓDULO DE PRODUCTOS =====
const ProductsModule = {
    // Configuración
    config: {
        itemsPerPage: 6,
        loadDelay: 800,
        animationDelay: 100
    },

    // Estado
    state: {
        products: [],
        filteredProducts: [],
        currentPage: 1,
        isLoading: false
    },

    // Inicializar
    init() {
        this.bindEvents();
        this.loadFeaturedProducts();
    },

    // Vincular eventos
    bindEvents() {
        // Buscar productos
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input',
                LaParadaApp.utils.debounce(this.handleSearch.bind(this), 300)
            );
        }

        // Filtrar por categoría
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', this.handleCategoryFilter.bind(this));
        });
    },

    // Cargar productos destacados
    async loadFeaturedProducts() {
        const container = document.getElementById('productsContainer');
        const loadingElement = document.getElementById('productsLoading');

        if (!container) return;

        this.state.isLoading = true;
        this.showLoading(true);

        try {
            // Simular carga desde API
            await this.delay(this.config.loadDelay);

            const featuredProducts = await this.getFeaturedProducts();
            this.state.products = featuredProducts;
            this.state.filteredProducts = featuredProducts;

            this.renderProducts(featuredProducts);

        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Error al cargar productos');
        } finally {
            this.state.isLoading = false;
            this.showLoading(false);
        }
    },

    // Obtener productos destacados (mock data)
    async getFeaturedProducts() {
        return [
            {
                id: 1,
                name: "Coca Cola 500ml",
                category: "Bebidas",
                categoryId: 1,
                price: 2.50,
                originalPrice: 3.00,
                image: "assets/images/products/cocacola.jpg",
                description: "Gaseosa Coca Cola 500ml refrescante",
                stock: 50,
                rating: 4.5,
                reviews: 128,
                discount: 17,
                isNew: false,
                isFeatured: true
            },
            {
                id: 2,
                name: "Galletas Oreo Original",
                category: "Snacks",
                categoryId: 2,
                price: 3.20,
                originalPrice: 3.80,
                image: "assets/images/products/galletasoreo.png",
                description: "Galletas Oreo original 154g, el clásico sabor que amas",
                stock: 35,
                rating: 4.8,
                reviews: 89,
                discount: 16,
                isNew: false,
                isFeatured: true
            },
            {
                id: 3,
                name: "Leche Gloria Evaporada",
                category: "Lácteos",
                categoryId: 3,
                price: 4.80,
                originalPrice: 5.20,
                image: "assets/images/products/glorialeche.jpg",
                description: "Leche evaporada Gloria 400ml, ideal para tus preparaciones",
                stock: 42,
                rating: 4.6,
                reviews: 156,
                discount: 8,
                isNew: true,
                isFeatured: true
            },
            {
                id: 4,
                name: "Pan Integral Bimbo",
                category: "Panadería",
                categoryId: 4,
                price: 5.50,
                originalPrice: 6.00,
                image: "assets/images/products/pan-bimbo.png",
                description: "Pan integral Bimbo 680g, perfecto para un desayuno saludable",
                stock: 28,
                rating: 4.3,
                reviews: 67,
                discount: 8,
                isNew: false,
                isFeatured: true
            },
            {
                id: 5,
                name: "Aceite Primor 1L",
                category: "Abarrotes",
                categoryId: 5,
                price: 8.90,
                originalPrice: 9.50,
                image: "assets/images/products/aceite-primor.jpg",
                description: "Aceite vegetal Primor 1 litro, ideal para cocinar",
                stock: 33,
                rating: 4.4,
                reviews: 94,
                discount: 6,
                isNew: false,
                isFeatured: true
            },
            {
                id: 6,
                name: "Yogurt Gloria Fresa",
                category: "Lácteos",
                categoryId: 3,
                price: 1.80,
                originalPrice: 2.20,
                image: "assets/images/products/yogurt-gloria.jpg",
                description: "Yogurt Gloria sabor fresa 150ml, cremoso y delicioso",
                stock: 45,
                rating: 4.7,
                reviews: 203,
                discount: 18,
                isNew: true,
                isFeatured: true
            }
        ];
    },

    // Renderizar productos
    renderProducts(products) {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="no-products">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h4>No se encontraron productos</h4>
                        <p class="text-muted">Intenta con otros términos de búsqueda</p>
                    </div>
                </div>
            `;
            return;
        }

        const productsHTML = products.map((product, index) => this.createProductCard(product, index)).join('');
        container.innerHTML = productsHTML;

        // Animar entrada de productos
        this.animateProductCards();
    },
    // Crear tarjeta de producto mejorada
    createProductCard(product, index) {
        const discountBadge = product.discount > 0 ? `
        <div class="discount-badge">-${product.discount}%</div>
    ` : '';

        const newBadge = product.isNew ? `
        <div class="new-badge">Nuevo</div>
    ` : '';

        // Calcular ahorro en soles
        const savingsAmount = product.originalPrice && product.originalPrice > product.price ?
            (product.originalPrice - product.price).toFixed(2) : 0;

        const originalPriceHTML = product.originalPrice && product.originalPrice > product.price ? `
        <span class="original-price">S/. ${product.originalPrice.toFixed(2)}</span>
        <span class="savings-amount">Ahorras S/. ${savingsAmount}</span>
    ` : '';

        const ratingHTML = this.generateRatingStars(product.rating);

        return `
        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
            <div class="product-card" style="animation-delay: ${index * this.config.animationDelay}ms">
                <div class="product-image-container">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/300x250/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                    ${discountBadge}
                    ${newBadge}
                    <div class="product-overlay">
                        <button class="btn btn-quick-view" onclick="ProductsModule.quickView(${product.id})" title="Vista rápida">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-add-to-cart" onclick="ProductsModule.addToCart(${product.id})" title="Agregar al carrito">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-body">
                    <div class="product-category">${product.category}</div>
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${ratingHTML}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="current-price">S/. ${product.price.toFixed(2)}</span>
                            ${originalPriceHTML}
                        </div>
                        <div class="product-stock">
                            <span class="stock-indicator ${this.getStockClass(product.stock)}">
                                <i class="fas fa-box me-1"></i>
                                ${this.getStockText(product.stock)}
                            </span>
                        </div>
                    </div>
                    <button class="btn btn-add-full w-100" onclick="ProductsModule.addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    },

    // Función helper para clase de stock
    getStockClass(stock) {
        if (stock > 10) return 'in-stock';
        if (stock > 0) return 'low-stock';
        return 'out-of-stock';
    },

    // Función helper para texto de stock
    getStockText(stock) {
        if (stock > 10) return 'Disponible';
        if (stock > 0) return `Solo quedan ${stock}`;
        return 'Agotado';
    },


    // Generar estrellas de rating
    generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';

        // Estrellas llenas
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        // Estrella media
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        // Estrellas vacías
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return `<div class="stars">${starsHTML}</div>`;
    },

    // Animar tarjetas de productos
    animateProductCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * this.config.animationDelay);
        });
    },

    // Agregar al carrito
    addToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            LaParadaApp.addToCart(product);
        }
    },

    // Vista rápida del producto
    quickView(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (product) {
            // Aquí podrías abrir un modal con detalles del producto
            console.log('Quick view for:', product);
            LaParadaApp.showNotification(`Vista rápida de ${product.name}`, 'info');
        }
    },

    // Manejar búsqueda
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            this.state.filteredProducts = this.state.products;
        } else {
            this.state.filteredProducts = this.state.products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        this.renderProducts(this.state.filteredProducts);
    },

    // Manejar filtro por categoría
    handleCategoryFilter(event) {
        event.preventDefault();
        const categoryId = parseInt(event.target.dataset.categoryId);

        if (categoryId === 0) {
            this.state.filteredProducts = this.state.products;
        } else {
            this.state.filteredProducts = this.state.products.filter(
                product => product.categoryId === categoryId
            );
        }

        this.renderProducts(this.state.filteredProducts);

        // Actualizar estado visual del filtro
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.classList.remove('active');
        });
        event.target.classList.add('active');
    },

    // Mostrar/ocultar loading
    showLoading(show) {
        const loadingElement = document.getElementById('productsLoading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    },

    // Mostrar error
    showError(message) {
        const container = document.getElementById('productsContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                        <h4>Error</h4>
                        <p class="text-muted">${message}</p>
                        <button class="btn btn-primary" onclick="ProductsModule.loadFeaturedProducts()">
                            Intentar nuevamente
                        </button>
                    </div>
                </div>
            `;
        }
    },

    // Utilidad delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ProductsModule.init();
});

// Exponer globalmente
window.ProductsModule = ProductsModule;
