// ===== CATALOG MODULE - MINIMARKET LA PARADA =====
class CatalogModule {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            categories: [],
            priceMin: 0,
            priceMax: 100,
            search: '',
            sort: 'default'
        };
        this.init();
    }

    // ===== INITIALIZATION =====
    async init() {
        console.log('🛍️ Initializing Catalog Module...');

        await this.loadProducts();
        this.initializeFilters();
        this.bindEvents();
        this.updateProductsDisplay();

        console.log('✅ Catalog Module ready');
    }

    // ===== LOAD PRODUCTS FROM API =====
    async loadProducts() {
        const loadingState = document.getElementById('loadingState');
        const emptyState = document.getElementById('emptyState');
        const productsGrid = document.getElementById('productsGrid');

        try {
            console.log('📦 Loading products from API...');

            // Show loading
            this.showLoading(true);

            // Load products
            this.products = await API.getProducts();
            console.log(`✅ Loaded ${this.products.length} products`);

            // Update price range based on actual products
            this.updatePriceRange();

            // Filter and display products
            this.applyFilters();

        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.showError('Error al cargar productos: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    // ===== UPDATE PRICE RANGE =====
    updatePriceRange() {
        if (this.products.length === 0) return;

        const prices = this.products.map(p => parseFloat(p.precio) || 0);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Update sliders
        const priceMinSlider = document.getElementById('priceMin');
        const priceMaxSlider = document.getElementById('priceMax');

        if (priceMinSlider && priceMaxSlider) {
            priceMinSlider.min = Math.floor(minPrice);
            priceMinSlider.max = Math.ceil(maxPrice);
            priceMinSlider.value = Math.floor(minPrice);

            priceMaxSlider.min = Math.floor(minPrice);
            priceMaxSlider.max = Math.ceil(maxPrice);
            priceMaxSlider.value = Math.ceil(maxPrice);

            // Update display
            document.getElementById('priceMinValue').textContent = Math.floor(minPrice);
            document.getElementById('priceMaxValue').textContent = Math.ceil(maxPrice);

            // Update filters
            this.filters.priceMin = Math.floor(minPrice);
            this.filters.priceMax = Math.ceil(maxPrice);
        }
    }

    // ===== INITIALIZE FILTERS =====
    initializeFilters() {
        // Get unique categories from products
        const categories = [...new Set(this.products.map(p => p.categoria).filter(Boolean))];
        console.log('📂 Available categories:', categories);

        // Update category filters to match actual categories
        this.updateCategoryFilters(categories);
    }

    // ===== UPDATE CATEGORY FILTERS =====
    updateCategoryFilters(categories) {
        const categoryContainer = document.querySelector('.category-filters');
        if (!categoryContainer) return;

        // Clear existing filters
        categoryContainer.innerHTML = '';

        // Add filters for each category
        categories.forEach((category, index) => {
            const categoryId = category.toLowerCase().replace(/\s+/g, '-').replace(/[áéíóú]/g, (match) => {
                const accents = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };
                return accents[match];
            });

            const filterHtml = `
                <div class="form-check">
                    <input class="form-check-input category-filter" type="checkbox" 
                           value="${category}" id="cat-${categoryId}">
                    <label class="form-check-label" for="cat-${categoryId}">
                        <i class="${this.getCategoryIcon(category)} me-2"></i>
                        ${category}
                        <span class="category-count">(${this.products.filter(p => p.categoria === category).length})</span>
                    </label>
                </div>
            `;
            categoryContainer.insertAdjacentHTML('beforeend', filterHtml);
        });
    }

    // ===== GET CATEGORY ICON =====
    getCategoryIcon(category) {
        const icons = {
            'Bebidas': 'fas fa-wine-bottle',
            'Lácteos': 'fas fa-cheese',
            'Panadería': 'fas fa-bread-slice',
            'Snacks': 'fas fa-cookie-bite',
            'Dulces': 'fas fa-candy-cane',
            'Limpieza': 'fas fa-pump-soap',
            'Carnes': 'fas fa-drumstick-bite',
            'Frutas y Verduras': 'fas fa-apple-alt',
            'Aseo personal': 'fas fa-pump-soap',
            'Otros': 'fas fa-box'
        };
        return icons[category] || 'fas fa-box';
    }

    // ===== BIND EVENTS =====
    bindEvents() {
        console.log('🔗 Binding catalog events...');

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Sort selector
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Price sliders
        const priceMinSlider = document.getElementById('priceMin');
        const priceMaxSlider = document.getElementById('priceMax');

        if (priceMinSlider && priceMaxSlider) {
            priceMinSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value <= this.filters.priceMax) {
                    this.filters.priceMin = value;
                    document.getElementById('priceMinValue').textContent = value;
                    this.applyFilters();
                }
            });

            priceMaxSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value >= this.filters.priceMin) {
                    this.filters.priceMax = value;
                    document.getElementById('priceMaxValue').textContent = value;
                    this.applyFilters();
                }
            });
        }

        // Category filters (delegated event)
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('category-filter')) {
                const category = e.target.value;
                if (e.target.checked) {
                    this.filters.categories.push(category);
                } else {
                    this.filters.categories = this.filters.categories.filter(c => c !== category);
                }
                this.applyFilters();
            }
        });

        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

    }

    // ===== APPLY FILTERS =====
    applyFilters() {
        console.log('🎯 Applying filters:', this.filters);

        let filtered = [...this.products];

        // Filter by search
        if (this.filters.search) {
            filtered = filtered.filter(product =>
                product.nombre.toLowerCase().includes(this.filters.search) ||
                (product.descripcion && product.descripcion.toLowerCase().includes(this.filters.search)) ||
                product.categoria.toLowerCase().includes(this.filters.search)
            );
        }

        // Filter by categories
        if (this.filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                this.filters.categories.includes(product.categoria)
            );
        }

        // Filter by price
        filtered = filtered.filter(product => {
            const price = parseFloat(product.precio) || 0;
            return price >= this.filters.priceMin && price <= this.filters.priceMax;
        });

        // Sort products
        filtered = this.sortProducts(filtered);

        this.filteredProducts = filtered;
        this.currentPage = 1; // Reset to first page
        this.updateProductsDisplay();
        this.updateActiveFilters();
    }

    // ===== SORT PRODUCTS =====
    sortProducts(products) {
        switch (this.filters.sort) {
            case 'name-asc':
                return products.sort((a, b) => a.nombre.localeCompare(b.nombre));
            case 'name-desc':
                return products.sort((a, b) => b.nombre.localeCompare(a.nombre));
            case 'price-asc':
                return products.sort((a, b) => (parseFloat(a.precio) || 0) - (parseFloat(b.precio) || 0));
            case 'price-desc':
                return products.sort((a, b) => (parseFloat(b.precio) || 0) - (parseFloat(a.precio) || 0));
            default:
                return products;
        }
    }

    // ===== UPDATE PRODUCTS DISPLAY =====
    updateProductsDisplay() {
        const productsGrid = document.getElementById('productsGrid');
        const resultsCount = document.getElementById('resultsCount');
        const emptyState = document.getElementById('emptyState');

        if (!productsGrid) return;

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }

        // Show empty state if no products
        if (this.filteredProducts.length === 0) {
            productsGrid.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        // Hide empty state
        if (emptyState) emptyState.style.display = 'none';
        productsGrid.style.display = 'block';

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Render products
        this.renderProducts(productsToShow);

        // Update pagination
        this.updatePagination();
    }

    // ===== RENDER PRODUCTS =====
    renderProducts(products) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const productCards = products.map(product => this.createProductCard(product)).join('');
        productsGrid.innerHTML = `<div class="row">${productCards}</div>`;
    }

    // ===== CREATE PRODUCT CARD =====
    createProductCard(product) {
        const imageUrl = this.getProductImage(product);
        const price = parseFloat(product.precio || 0).toFixed(2);
        const stock = product.stock || 0;

        return `
            <div class="col-lg-4 col-md-6 col-sm-6 mb-4">
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="${imageUrl}" 
                             alt="${this.escapeHtml(product.nombre)}" 
                             class="product-image"
                             onerror="this.src='../../assets/images/placeholder.jpg'">
                        ${stock > 0 ? '' : '<div class="out-of-stock-overlay">Sin Stock</div>'}
                        <div class="product-actions">
                            <button class="btn-quick-view" onclick="CATALOG.showQuickView(${product.id})" title="Vista rápida">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${this.escapeHtml(product.categoria)}</div>
                        <h5 class="product-name">${this.escapeHtml(product.nombre)}</h5>
                        <p class="product-description">${this.escapeHtml(product.descripcion?.substring(0, 60) || 'Producto de calidad')}${(product.descripcion?.length || 0) > 60 ? '...' : ''}</p>
                        <div class="product-footer">
                            <div class="product-price">
                                <span class="price">S/. ${price}</span>
                                <span class="stock-info ${stock > 0 ? 'in-stock' : 'out-stock'}">
                                    Stock: ${stock}
                                </span>
                            </div>
                            <button class="btn-add-to-cart ${stock === 0 ? 'disabled' : ''}" 
                                    onclick="CATALOG.addToCart(${product.id})"
                                    ${stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i>
                                ${stock === 0 ? 'Sin Stock' : 'Agregar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== GET PRODUCT IMAGE =====
    getProductImage(product) {
        const imagen = product.imagen || product.imagenUrl;

        if (!imagen) {
            return '../../assets/images/placeholder.jpg';
        }

        if (imagen.startsWith('http')) {
            return imagen;
        }

        if (imagen.startsWith('/')) {
            return imagen;
        }

        if (imagen.startsWith('frontend/')) {
            return '/' + imagen;
        }

        return '/frontend/assets/images/productos/' + imagen;
    }

    // ===== UPDATE ACTIVE FILTERS =====
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;

        const filterTags = [];

        // Search filter
        if (this.filters.search) {
            filterTags.push(`
                <span class="filter-tag">
                    Búsqueda: "${this.filters.search}"
                    <button class="btn-remove-filter" onclick="CATALOG.removeSearchFilter()">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `);
        }

        // Category filters
        this.filters.categories.forEach(category => {
            filterTags.push(`
                <span class="filter-tag">
                    ${category}
                    <button class="btn-remove-filter" onclick="CATALOG.removeCategoryFilter('${category}')">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `);
        });

        // Price filter
        const minPrice = this.filters.priceMin;
        const maxPrice = this.filters.priceMax;
        const allPrices = this.products.map(p => parseFloat(p.precio) || 0);
        const actualMin = Math.min(...allPrices);
        const actualMax = Math.max(...allPrices);

        if (minPrice > actualMin || maxPrice < actualMax) {
            filterTags.push(`
                <span class="filter-tag">
                    Precio: S/.${minPrice} - S/.${maxPrice}
                    <button class="btn-remove-filter" onclick="CATALOG.removePriceFilter()">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `);
        }

        activeFiltersContainer.innerHTML = filterTags.join('');
    }

    // ===== UPDATE PAGINATION =====
    updatePagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHtml = '';

        // Previous button
        paginationHtml += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="CATALOG.goToPage(${this.currentPage - 1}); return false;">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHtml += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="CATALOG.goToPage(${i}); return false;">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="CATALOG.goToPage(${this.currentPage + 1}); return false;">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        paginationContainer.innerHTML = paginationHtml;
    }

    // ===== UTILITY METHODS =====
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            loadingState.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        console.error('❌ Catalog Error:', message);
        // You could implement a toast notification here
    }

    // ===== PUBLIC METHODS =====
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateProductsDisplay();

            // Scroll to top of products
            document.getElementById('productsGrid')?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    clearAllFilters() {
        console.log('🧹 Clearing all filters...');

        // Reset filters
        this.filters = {
            categories: [],
            priceMin: Math.min(...this.products.map(p => parseFloat(p.precio) || 0)),
            priceMax: Math.max(...this.products.map(p => parseFloat(p.precio) || 0)),
            search: '',
            sort: 'default'
        };

        // Reset UI elements
        document.getElementById('searchInput').value = '';
        document.getElementById('sortSelect').value = 'default';

        // Reset category checkboxes
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset price sliders
        const priceMinSlider = document.getElementById('priceMin');
        const priceMaxSlider = document.getElementById('priceMax');
        if (priceMinSlider && priceMaxSlider) {
            priceMinSlider.value = this.filters.priceMin;
            priceMaxSlider.value = this.filters.priceMax;
            document.getElementById('priceMinValue').textContent = this.filters.priceMin;
            document.getElementById('priceMaxValue').textContent = this.filters.priceMax;
        }

        // Apply filters (will show all products)
        this.applyFilters();
    }

    removeSearchFilter() {
        this.filters.search = '';
        document.getElementById('searchInput').value = '';
        this.applyFilters();
    }

    removeCategoryFilter(category) {
        this.filters.categories = this.filters.categories.filter(c => c !== category);
        const checkbox = document.querySelector(`input[value="${category}"]`);
        if (checkbox) checkbox.checked = false;
        this.applyFilters();
    }

    removePriceFilter() {
        const allPrices = this.products.map(p => parseFloat(p.precio) || 0);
        this.filters.priceMin = Math.min(...allPrices);
        this.filters.priceMax = Math.max(...allPrices);

        const priceMinSlider = document.getElementById('priceMin');
        const priceMaxSlider = document.getElementById('priceMax');
        if (priceMinSlider && priceMaxSlider) {
            priceMinSlider.value = this.filters.priceMin;
            priceMaxSlider.value = this.filters.priceMax;
            document.getElementById('priceMinValue').textContent = this.filters.priceMin;
            document.getElementById('priceMaxValue').textContent = this.filters.priceMax;
        }

        this.applyFilters();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Delegate to cart manager
        if (window.CART) {
            CART.addToCart(productId, product);
        } else {
            console.error('Cart Manager not available');
        }
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found for quick view:', productId);
            return;
        }

        console.log('🔍 Opening quick view for product:', product.nombre);

        // Update modal content
        this.renderQuickViewContent(product);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
        modal.show();

    }
    renderQuickViewContent(product) {
        const quickViewContent = document.getElementById('quickViewContent');
        if (!quickViewContent) return;

        const imageUrl = this.getProductImage(product);
        const price = parseFloat(product.precio || 0).toFixed(2);
        const stock = product.stock || 0;
        const description = product.descripcion || 'Sin descripción disponible';

        quickViewContent.innerHTML = `
        <div class="row">
            <!-- Product Image -->
            <div class="col-lg-6 mb-4">
                <div class="quick-view-image-container">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.nombre)}" 
                         class="quick-view-image img-fluid"
                         id="quickViewMainImage"
                         onerror="this.src='../../assets/images/placeholder.jpg'">
                    ${stock === 0 ? '<div class="out-of-stock-badge">Sin Stock</div>' : ''}
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="col-lg-6">
                <div class="quick-view-info">
                    <!-- Category Badge -->
                    <div class="product-category-badge mb-3">
                        <span class="badge bg-secondary">
                            <i class="${this.getCategoryIcon(product.categoria)} me-1"></i>
                            ${this.escapeHtml(product.categoria)}
                        </span>
                    </div>
                    
                    <!-- Product Name -->
                    <h3 class="product-title mb-3">${this.escapeHtml(product.nombre)}</h3>
                    
                    <!-- Price -->
                    <div class="price-section mb-4">
                        <div class="current-price">
                            <span class="price-label">Precio:</span>
                            <span class="price-value">S/. ${price}</span>
                        </div>
                    </div>
                    
                    <!-- Stock Status -->
                    <div class="stock-section mb-4">
                        <div class="stock-info ${stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            <i class="fas ${stock > 0 ? 'fa-check-circle' : 'fa-times-circle'} me-2"></i>
                            <span class="stock-label">Estado:</span>
                            <span class="stock-value">
                                ${stock > 0 ? `En Stock (${stock} unidades)` : 'Sin Stock'}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <div class="description-section mb-4">
                        <h5 class="section-title">
                            <i class="fas fa-info-circle me-2"></i>Descripción
                        </h5>
                        <p class="product-description">${this.escapeHtml(description)}</p>
                    </div>
                    
                    <!-- Product Details -->
                    <div class="details-section mb-4">
                        <h5 class="section-title">
                            <i class="fas fa-list me-2"></i>Detalles del Producto
                        </h5>
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">ID:</span>
                                <span class="detail-value">#${product.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Categoría:</span>
                                <span class="detail-value">${this.escapeHtml(product.categoria)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Stock:</span>
                                <span class="detail-value">${stock} unidades</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Estado:</span>
                                <span class="detail-value">
                                    <span class="badge ${product.activo ? 'bg-success' : 'bg-secondary'}">
                                        ${product.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quantity Selector & Add to Cart -->
                    <div class="action-section">
                        <div class="quantity-section mb-3">
                            <label class="quantity-label" for="quickViewQuantity">Cantidad:</label>
                            <div class="quantity-controls">
                                <button type="button" class="btn btn-outline-secondary btn-sm" 
                                        onclick="CATALOG.changeQuickViewQuantity(-1)" 
                                        ${stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" id="quickViewQuantity" class="form-control quantity-input" 
                                       value="1" min="1" max="${stock}" ${stock === 0 ? 'disabled' : ''}>
                                <button type="button" class="btn btn-outline-secondary btn-sm" 
                                        onclick="CATALOG.changeQuickViewQuantity(1)" 
                                        ${stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Additional Info -->
                    <div class="additional-info mt-4">
                        <div class="info-badges">
                            <span class="badge bg-info">
                                <i class="fas fa-truck me-1"></i>Entrega disponible
                            </span>
                            <span class="badge bg-warning text-dark">
                                <i class="fas fa-clock me-1"></i>Producto fresco
                            </span>
                            ${product.destacado ? '<span class="badge bg-primary"><i class="fas fa-star me-1"></i>Destacado</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
    renderQuickViewContent(product) {
        const quickViewContent = document.getElementById('quickViewContent');
        if (!quickViewContent) return;

        const imageUrl = this.getProductImage(product);
        const price = parseFloat(product.precio || 0).toFixed(2);
        const stock = product.stock || 0;
        const description = product.descripcion || 'Sin descripción disponible';

        quickViewContent.innerHTML = `
        <div class="row">
            <!-- Product Image -->
            <div class="col-lg-6 mb-4">
                <div class="quick-view-image-container">
                    <img src="${imageUrl}" 
                         alt="${this.escapeHtml(product.nombre)}" 
                         class="quick-view-image img-fluid"
                         id="quickViewMainImage"
                         onerror="this.src='../../assets/images/placeholder.jpg'">
                    ${stock === 0 ? '<div class="out-of-stock-badge">Sin Stock</div>' : ''}
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="col-lg-6">
                <div class="quick-view-info">
                    <!-- Category Badge -->
                    <div class="product-category-badge mb-3">
                        <span class="badge bg-secondary">
                            <i class="${this.getCategoryIcon(product.categoria)} me-1"></i>
                            ${this.escapeHtml(product.categoria)}
                        </span>
                    </div>
                    
                    <!-- Product Name -->
                    <h3 class="product-title mb-3">${this.escapeHtml(product.nombre)}</h3>
                    
                    <!-- Price -->
                    <div class="price-section mb-4">
                        <div class="current-price">
                            <span class="price-label">Precio:</span>
                            <span class="price-value">S/. ${price}</span>
                        </div>
                    </div>
                    
                    <!-- Stock Status -->
                    <div class="stock-section mb-4">
                        <div class="stock-info ${stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            <i class="fas ${stock > 0 ? 'fa-check-circle' : 'fa-times-circle'} me-2"></i>
                            <span class="stock-label">Estado:</span>
                            <span class="stock-value">
                                ${stock > 0 ? `En Stock (${stock} unidades)` : 'Sin Stock'}
                            </span>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <div class="description-section mb-4">
                        <h5 class="section-title">
                            <i class="fas fa-info-circle me-2"></i>Descripción
                        </h5>
                        <p class="product-description">${this.escapeHtml(description)}</p>
                    </div>
                    
                    <!-- Product Details -->
                    <div class="details-section mb-4">
                        <h5 class="section-title">
                            <i class="fas fa-list me-2"></i>Detalles del Producto
                        </h5>
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">ID:</span>
                                <span class="detail-value">#${product.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Categoría:</span>
                                <span class="detail-value">${this.escapeHtml(product.categoria)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Stock:</span>
                                <span class="detail-value">${stock} unidades</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Estado:</span>
                                <span class="detail-value">
                                    <span class="badge ${product.activo ? 'bg-success' : 'bg-secondary'}">
                                        ${product.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quantity Selector & Add to Cart -->
                    <div class="action-section">
                        <div class="quantity-section mb-3">
                            <label class="quantity-label" for="quickViewQuantity">Cantidad:</label>
                            <div class="quantity-controls">
                                <button type="button" class="btn btn-outline-secondary btn-sm" 
                                        onclick="CATALOG.changeQuickViewQuantity(-1)" 
                                        ${stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" id="quickViewQuantity" class="form-control quantity-input" 
                                       value="1" min="1" max="${stock}" ${stock === 0 ? 'disabled' : ''}>
                                <button type="button" class="btn btn-outline-secondary btn-sm" 
                                        onclick="CATALOG.changeQuickViewQuantity(1)" 
                                        ${stock === 0 ? 'disabled' : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- Additional Info -->
                    <div class="additional-info mt-4">
                        <div class="info-badges">
                            <span class="badge bg-info">
                                <i class="fas fa-truck me-1"></i>Entrega disponible
                            </span>
                            <span class="badge bg-warning text-dark">
                                <i class="fas fa-clock me-1"></i>Producto fresco
                            </span>
                            ${product.destacado ? '<span class="badge bg-primary"><i class="fas fa-star me-1"></i>Destacado</span>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}

// ===== GLOBAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM loaded, initializing Catalog...');

    // Initialize catalog
    window.CATALOG = new CatalogModule();

    console.log('🛍️ Catalog loaded and ready');
});


console.log('📝 Catalog script loaded');
