// ===== MÓDULO DE CATÁLOGO CORREGIDO =====
const CatalogModule = {
    // Estado
    state: {
        allProducts: [],
        filteredProducts: [],
        currentPage: 1,
        productsPerPage: 6,
        filters: {
            categories: [],
            priceMin: 0,
            priceMax: 100,
            searchTerm: ''
        },
        sortBy: 'default'
    },

    // Inicializar
    init() {
        this.loadProducts();
        this.bindEvents();
        this.initPriceRange();
        console.log('🛍️ Catalog Module initialized');
    },

    // Cargar productos (preparado para backend)
    async loadProducts() {
        try {
            if (ApiConfig.mode === 'real') {
                const response = await fetch(`${ApiConfig.baseURL}${ApiConfig.endpoints.products}`, {
                    headers: ApiConfig.headers
                });
                this.state.allProducts = await response.json();
            } else {
                // Modo mock
                this.state.allProducts = MockData.products || [];
            }
            
            this.state.filteredProducts = [...this.state.allProducts];
            this.updatePriceRange();
            this.renderProducts();
            this.updateResultsCount();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showErrorMessage('Error al cargar productos');
        }
    },
    // Actualizar la función quickView para dar opción de ir a página completa
    quickView(productId) {
        const product = this.state.allProducts.find(p => p.id === productId);
        if (!product) return;

        // OPCIÓN 1: Redirigir directamente a página de detalle
        window.location.href = `detail.html?id=${productId}&category=${product.category}`;

        // OPCIÓN 2: Mostrar modal con botón "Ver detalles completos"
        // (Si quieres mantener el modal, comenta la línea de arriba y descomenta el bloque siguiente)
        /*
        const modal = document.getElementById('quickViewModal');
        const modalContent = document.getElementById('quickViewContent');
        
        modalContent.innerHTML = `
            <div class="quick-view-container">
                <div class="row">
                    <!-- Imagen del Producto -->
                    <div class="col-lg-6 mb-4">
                        <div class="product-image-main">
                            <img src="${product.image}" 
                                 alt="${product.name}" 
                                 class="img-fluid rounded product-main-img"
                                 onerror="this.src='https://via.placeholder.com/400x300/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                            ${product.originalPrice ? `
                                <div class="product-badge-modal">
                                    <span class="badge bg-danger">
                                        -${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Información del Producto -->
                    <div class="col-lg-6">
                        <div class="product-details">
                            <!-- Categoría y Rating -->
                            <div class="product-meta mb-3">
                                <span class="product-category-badge">
                                    <i class="${this.getCategoryIcon(product.category)} me-1"></i>
                                    ${this.getCategoryName(product.category)}
                                </span>
                                <div class="product-rating">
                                    ${this.renderStars(product.rating)}
                                    <span class="rating-text">(${product.reviews} reseñas)</span>
                                </div>
                            </div>
                            
                            <!-- Nombre -->
                            <h3 class="product-title mb-3">${product.name}</h3>
                            
                            <!-- Precio -->
                            <div class="product-price-section mb-4">
                                <div class="price-current">S/. ${product.price.toFixed(2)}</div>
                                ${product.originalPrice ? `
                                    <div class="price-original">S/. ${product.originalPrice.toFixed(2)}</div>
                                ` : ''}
                            </div>
                            
                            <!-- Descripción -->
                            <div class="product-description mb-4">
                                ${product.description || ''}
                            </div>
                            
                            <!-- Botón para ver detalles completos -->
                            <button class="btn btn-primary" onclick="window.location.href='detail.html?id=${productId}&category=${product.category}'">
                                Ver detalles completos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if (modal) {
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
            modalInstance.show();
        }
        */
    },

    // Actualizar renderizado de productos para incluir enlaces
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const { filteredProducts, currentPage, productsPerPage } = this.state;
        const startIdx = (currentPage - 1) * productsPerPage;
        const endIdx = startIdx + productsPerPage;
        const productsToShow = filteredProducts.slice(startIdx, endIdx);

        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image"
                         onclick="CatalogModule.goToDetail(${product.id})"
                         style="cursor: pointer;"
                         onerror="this.src='https://via.placeholder.com/280x200/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                    ${product.originalPrice ? `<div class="product-badge">OFERTA</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h5 class="product-name" onclick="CatalogModule.goToDetail(${product.id})" 
                       style="cursor: pointer;">${product.name}</h5>
                    <div class="product-rating-small">
                        ${this.renderStars(product.rating)}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="product-current-price">S/. ${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="product-original-price">S/. ${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-add-to-cart" 
                                onclick="CatalogModule.addToCart(${product.id})"
                                ${product.stock <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-1"></i> 
                            ${product.stock <= 0 ? 'Sin Stock' : 'Agregar'}
                        </button>
                        <button class="btn btn-quick-view" onclick="CatalogModule.goToDetail(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.renderPagination();
    },

    // Nueva función para ir a página de detalle
    goToDetail(productId) {
        const product = this.state.allProducts.find(p => p.id === productId);
        if (product) {
            window.location.href = `detail.html?id=${productId}&category=${product.category}`;
        }
    },

    // Cambiar cantidad en modal
    changeQuantity(change) {
        const quantityInput = document.getElementById('quickViewQuantity');
        if (!quantityInput) return;
        
        let newQuantity = parseInt(quantityInput.value) + change;
        const maxQuantity = parseInt(quantityInput.getAttribute('max'));
        
        if (newQuantity < 1) newQuantity = 1;
        if (newQuantity > maxQuantity) newQuantity = maxQuantity;
        
        quantityInput.value = newQuantity;
    },

    // Agregar al carrito desde modal
    addToCartFromModal(productId) {
        const product = this.state.allProducts.find(p => p.id === productId);
        const quantity = parseInt(document.getElementById('quickViewQuantity').value) || 1;
        
        if (product && product.stock >= quantity) {
            // Agregar múltiples unidades
            for (let i = 0; i < quantity; i++) {
                LaParadaApp.addToCart(product);
            }
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickViewModal'));
            modal.hide();
            
            // Mostrar confirmación
            this.showSuccessMessage(`${quantity} ${product.name} agregado(s) al carrito`);
        }
    },

    // Agregar a favoritos
    addToWishlist(productId) {
        const product = this.state.allProducts.find(p => p.id === productId);
        if (product) {
            this.showSuccessMessage(`${product.name} agregado a favoritos`);
            // Aquí puedes implementar la lógica de favoritos
        }
    },

    // Compartir producto
    shareProduct(productId) {
        const product = this.state.allProducts.find(p => p.id === productId);
        if (product && navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            });
        } else {
            // Fallback: copiar URL al clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showSuccessMessage('Enlace copiado al portapapeles');
        }
    },

    // Comparar producto
    compareProduct(productId) {
        this.showSuccessMessage('Funcionalidad de comparación en desarrollo');
    },

    // Renderizar estrellas
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-warning"></i>';
        }
        
        return stars;
    },

    // Obtener icono de categoría
    getCategoryIcon(categoryId) {
        const category = MockData.categories.find(cat => cat.id === categoryId);
        return category ? category.icon : 'fas fa-tag';
    },

    // Obtener nombre de categoría
    getCategoryName(categoryId) {
        const category = MockData.categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    },

    // Mostrar mensaje de éxito
    showSuccessMessage(message) {
        LaParadaApp.showNotification(message, 'success');
    },

    // Mostrar mensaje de error
    showErrorMessage(message) {
        LaParadaApp.showNotification(message, 'error');
    },

    // ... (resto de funciones existentes)
    
    // Vincular eventos
    bindEvents() {
        // Filtros de categoría
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', this.handleCategoryFilter.bind(this));
        });

        // Búsqueda
        document.getElementById('searchInput').addEventListener('input', 
            this.debounce(this.handleSearch.bind(this), 500));
        document.getElementById('searchBtn').addEventListener('click', this.handleSearch.bind(this));

        // Ordenamiento
        document.getElementById('sortSelect').addEventListener('change', this.handleSort.bind(this));

        // Limpiar filtros
        document.getElementById('clearFilters').addEventListener('click', this.clearAllFilters.bind(this));

        // Filtro de precio
        document.getElementById('priceMin').addEventListener('input', this.handlePriceFilter.bind(this));
        document.getElementById('priceMax').addEventListener('input', this.handlePriceFilter.bind(this));
    },

    // Manejar filtro de categorías
    handleCategoryFilter() {
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(cb => cb.value);
        
        this.state.filters.categories = selectedCategories;
        this.applyFilters();
        this.updateActiveFilters();
    },

    // Manejar búsqueda (preparada para backend)
    async handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        this.state.filters.searchTerm = searchTerm;
        
        if (ApiConfig.mode === 'real' && searchTerm) {
            try {
                const response = await fetch(
                    `${ApiConfig.baseURL}${ApiConfig.endpoints.search}?q=${encodeURIComponent(searchTerm)}`,
                    { headers: ApiConfig.headers }
                );
                const searchResults = await response.json();
                this.state.filteredProducts = searchResults;
                this.renderProducts();
            } catch (error) {
                console.error('Search error:', error);
                this.applyFilters(); // Fallback a filtro local
            }
        } else {
            this.applyFilters();
        }
        
        this.updateActiveFilters();
    },

    // Aplicar todos los filtros
    applyFilters() {
        let filtered = [...this.state.allProducts];

        // Filtro por categorías
        if (this.state.filters.categories.length > 0) {
            filtered = filtered.filter(product => 
                this.state.filters.categories.includes(product.category));
        }

        // Filtro por precio
        filtered = filtered.filter(product => 
            product.price >= this.state.filters.priceMin && 
            product.price <= this.state.filters.priceMax);

        // Filtro por búsqueda (modo local)
        if (this.state.filters.searchTerm && ApiConfig.mode === 'mock') {
            const searchTerm = this.state.filters.searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm));
        }

        this.state.filteredProducts = filtered;
        this.applySorting();
        this.state.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
        this.renderPagination();
    },

    // Resto de funciones existentes...
    applySorting() {
        const sortBy = this.state.sortBy;
        
        this.state.filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating-desc':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id;
                default:
                    return 0;
            }
        });
    },

    handleSort() {
        this.state.sortBy = document.getElementById('sortSelect').value;
        this.applySorting();
        this.renderProducts();
    },

    handlePriceFilter() {
        const priceMin = parseInt(document.getElementById('priceMin').value);
        const priceMax = parseInt(document.getElementById('priceMax').value);
        
        this.state.filters.priceMin = priceMin;
        this.state.filters.priceMax = priceMax;
        
        document.getElementById('priceMinValue').textContent = priceMin;
        document.getElementById('priceMaxValue').textContent = priceMax;
        
        this.applyFilters();
    },

    // Renderizar productos
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const startIndex = (this.state.currentPage - 1) * this.state.productsPerPage;
        const endIndex = startIndex + this.state.productsPerPage;
        const productsToShow = this.state.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
            productsGrid.innerHTML = '';
            return;
        }

        document.getElementById('emptyState').style.display = 'none';
        
        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-image"
                         onerror="this.src='https://via.placeholder.com/280x200/f8f9fa/6c757d?text=${encodeURIComponent(product.name)}'">
                    ${product.originalPrice ? `<div class="product-badge">OFERTA</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h5 class="product-name">${product.name}</h5>
                    <div class="product-rating-small">
                        ${this.renderStars(product.rating)}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="product-current-price">S/. ${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="product-original-price">S/. ${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-add-to-cart" 
                                onclick="CatalogModule.addToCart(${product.id})"
                                ${product.stock <= 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus me-1"></i> 
                            ${product.stock <= 0 ? 'Sin Stock' : 'Agregar'}
                        </button>
                        <button class="btn btn-quick-view" onclick="CatalogModule.quickView(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.renderPagination();
    },

    // Agregar al carrito (preparado para backend)
    async addToCart(productId) {
        const product = this.state.allProducts.find(p => p.id === productId);
        if (!product || product.stock <= 0) return;

        if (ApiConfig.mode === 'real') {
            try {
                const response = await fetch(
                    `${ApiConfig.baseURL}${ApiConfig.endpoints.addToCart}`,
                    {
                        method: 'POST',
                        headers: ApiConfig.headers,
                        body: JSON.stringify({
                            productId: productId,
                            quantity: 1
                        })
                    }
                );
                
                if (response.ok) {
                    LaParadaApp.showNotification(`${product.name} agregado al carrito`, 'success');
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                LaParadaApp.showNotification('Error al agregar al carrito', 'error');
            }
        } else {
            // Modo mock
            LaParadaApp.addToCart(product);
        }
    },

    // Resto de funciones existentes...
    renderPagination() {
        const totalPages = Math.ceil(this.state.filteredProducts.length / this.state.productsPerPage);
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Botón anterior
        paginationHTML += `
            <li class="page-item ${this.state.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="CatalogModule.goToPage(${this.state.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.state.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="CatalogModule.goToPage(${i})">${i}</a>
                </li>
            `;
        }

        // Botón siguiente
        paginationHTML += `
            <li class="page-item ${this.state.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="CatalogModule.goToPage(${this.state.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        pagination.innerHTML = paginationHTML;
    },

    goToPage(page) {
        const totalPages = Math.ceil(this.state.filteredProducts.length / this.state.productsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.state.currentPage = page;
            this.renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        const activeFilters = [];

        // Filtros de categorías
        this.state.filters.categories.forEach(categoryId => {
            const categoryName = this.getCategoryName(categoryId);
            activeFilters.push({
                type: 'category',
                value: categoryId,
                label: categoryName
            });
        });

        // Filtro de búsqueda
        if (this.state.filters.searchTerm) {
            activeFilters.push({
                type: 'search',
                value: this.state.filters.searchTerm,
                label: `"${this.state.filters.searchTerm}"`
            });
        }

        // Renderizar filtros activos
        activeFiltersContainer.innerHTML = activeFilters.map(filter => `
            <div class="filter-tag">
                ${filter.label}
                <button class="remove-filter" onclick="CatalogModule.removeFilter('${filter.type}', '${filter.value}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    },

    removeFilter(type, value) {
        if (type === 'category') {
            const checkbox = document.getElementById(`cat-${value}`);
            if (checkbox) checkbox.checked = false;
            this.handleCategoryFilter();
        } else if (type === 'search') {
            document.getElementById('searchInput').value = '';
            this.handleSearch();
        }
    },

    clearAllFilters() {
        // Limpiar checkboxes
        document.querySelectorAll('.category-filter').forEach(cb => cb.checked = false);
        
        // Limpiar búsqueda
        document.getElementById('searchInput').value = '';
        
        // Resetear precio
        document.getElementById('priceMin').value = 0;
        document.getElementById('priceMax').value = 100;
        
        // Resetear ordenamiento
        document.getElementById('sortSelect').value = 'default';
        
        // Resetear estado
        this.state.filters = {
            categories: [],
            priceMin: 0,
            priceMax: 100,
            searchTerm: ''
        };
        this.state.sortBy = 'default';
        
        this.applyFilters();
        this.updateActiveFilters();
        this.initPriceRange();
    },

    initPriceRange() {
        document.getElementById('priceMinValue').textContent = this.state.filters.priceMin;
        document.getElementById('priceMaxValue').textContent = this.state.filters.priceMax;
    },

    updatePriceRange() {
        if (this.state.allProducts.length > 0) {
            const prices = this.state.allProducts.map(p => p.price);
            const maxPrice = Math.ceil(Math.max(...prices));
            
            document.getElementById('priceMax').max = maxPrice;
            document.getElementById('priceMax').value = maxPrice;
            this.state.filters.priceMax = maxPrice;
            document.getElementById('priceMaxValue').textContent = maxPrice;
        }
    },

    updateResultsCount() {
        document.getElementById('resultsCount').textContent = this.state.filteredProducts.length;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    CatalogModule.init();
});

// Exponer globalmente
window.CatalogModule = CatalogModule;
