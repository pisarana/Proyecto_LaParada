// ===== ADMIN PANEL MANAGER - MINIMARKET LA PARADA =====
class AdminPanelManager {
    constructor() {
        this.currentProduct = null;
        this.products = [];
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🔧 Initializing Admin Panel...');
        this.checkAdminAuth();
        this.loadProducts();
        this.bindEvents();
        this.loadDashboardStats();
        console.log('✅ Admin Panel ready');
    }

    // ===== AUTHENTICATION =====
    checkAdminAuth() {
        const user = API.getUser();
        if (!user || user.rol !== 'ADMINISTRADOR') {
            console.warn('⚠️ Access denied: Not admin');
            alert('Acceso denegado. Solo administradores pueden acceder a este panel.');
            window.location.href = '../../index.html';
            return false;
        }

        // Update admin greeting
        const greeting = document.getElementById('adminGreeting');
        if (greeting) {
            greeting.textContent = `Hola, ${user.nombre}`;
        }

        console.log('✅ Admin authenticated:', user.nombre);
        return true;
    }

    logout() {
        if (confirm('¿Estás seguro de cerrar sesión?')) {
            API.logout();
            window.location.href = '../../index.html';
        }
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        console.log('🔗 Binding events...');

        // Search products
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('filterCategory');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Stock filter
        const stockFilter = document.getElementById('filterStock');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        // Tab change events
        const reportTab = document.getElementById('nav-reports-tab');
        if (reportTab) {
            reportTab.addEventListener('shown.bs.tab', () => {
                console.log('📊 Reports tab shown, loading stats...');
                this.loadDashboardStats();
            });
        }
    }

    // ===== PRODUCTS MANAGEMENT =====
    async loadProducts() {
        console.log('📦 Loading products...');

        const tableBody = document.getElementById('productsTableBody');
        const loadingDiv = document.getElementById('productsLoading');

        // Show loading
        if (loadingDiv) {
            loadingDiv.style.display = 'block';
            loadingDiv.classList.add('show');
        }
        if (tableBody) tableBody.innerHTML = '';

        try {
            const response = await API.request('/products/all');
            this.products = response || [];
            console.log(`✅ Loaded ${this.products.length} products`);
            this.renderProductsTable(this.products);

        } catch (error) {
            console.error('❌ Error loading products:', error);
            this.showError('Error al cargar productos: ' + error.message);

            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center text-danger py-4">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Error al cargar productos: ${error.message}
                            <br><button class="btn btn-sm btn-outline-primary mt-2" onclick="AdminPanel.loadProducts()">
                                <i class="fas fa-retry me-1"></i>Reintentar
                            </button>
                        </td>
                    </tr>
                `;
            }
        } finally {
            // Hide loading
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
                loadingDiv.classList.remove('show');
            }
        }
    }

    renderProductsTable(products) {
        const tableBody = document.getElementById('productsTableBody');
        if (!tableBody) return;

        if (!products || products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-5">
                        <i class="fas fa-box-open fa-3x mb-3"></i>
                        <h5>No hay productos disponibles</h5>
                        <p class="text-muted">Agrega tu primer producto usando el botón "Agregar Producto"</p>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = products.map(product => `
            <tr data-product-id="${product.id}">
                <td><strong>#${product.id}</strong></td>
                <td>
                    <img src="${product.imagen || '../../assets/images/placeholder.jpg'}" 
                         alt="${product.nombre}" 
                         class="product-thumbnail"
                         onerror="this.src='../../assets/images/placeholder.jpg'">
                </td>
                <td>
                    <strong>${this.escapeHtml(product.nombre)}</strong>
                    ${product.descripcion ? `<br><small class="text-muted">${this.escapeHtml(product.descripcion.substring(0, 50))}${product.descripcion.length > 50 ? '...' : ''}</small>` : ''}
                </td>
                <td>
                    <span class="badge bg-secondary">${this.escapeHtml(product.categoria)}</span>
                </td>
                <td><strong>S/. ${parseFloat(product.precio || 0).toFixed(2)}</strong></td>
                <td>
                    <span class="badge ${this.getStockBadgeClass(product.stock)}">
                        ${product.stock || 0} unidades
                    </span>
                </td>
                <td>
                    <span class="badge ${product.activo ? 'bg-success' : 'bg-danger'}">
                        ${product.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="AdminPanel.editProduct(${product.id})" 
                                title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="AdminPanel.deleteProduct(${product.id})" 
                                title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getStockBadgeClass(stock) {
        const stockNum = parseInt(stock) || 0;
        if (stockNum === 0) return 'bg-danger';
        if (stockNum < 10) return 'bg-warning';
        return 'bg-success';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== FILTERS =====
    filterProducts(searchTerm) {
        if (!searchTerm.trim()) {
            this.renderProductsTable(this.products);
            return;
        }

        const filtered = this.products.filter(product =>
            product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        this.renderProductsTable(filtered);
        console.log(`🔍 Filtered to ${filtered.length} products for "${searchTerm}"`);
    }

    applyFilters() {
        const categoryFilter = document.getElementById('filterCategory')?.value;
        const stockFilter = document.getElementById('filterStock')?.value;
        const searchTerm = document.getElementById('searchProducts')?.value;

        let filtered = [...this.products];

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(product => product.categoria === categoryFilter);
        }

        // Apply stock filter
        if (stockFilter) {
            if (stockFilter === 'low') {
                filtered = filtered.filter(product => (product.stock || 0) > 0 && (product.stock || 0) < 10);
            } else if (stockFilter === 'out') {
                filtered = filtered.filter(product => (product.stock || 0) === 0);
            }
        }

        // Apply search term
        if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(product =>
                product.nombre.toLowerCase().includes(term) ||
                product.categoria.toLowerCase().includes(term) ||
                (product.descripcion && product.descripcion.toLowerCase().includes(term))
            );
        }

        this.renderProductsTable(filtered);
        console.log(`🎯 Applied filters, showing ${filtered.length} products`);
    }

    // ===== PRODUCT MODAL MANAGEMENT =====
    showAddProductModal() {
        console.log('➕ Opening add product modal');
        this.currentProduct = null;

        // Reset modal
        document.getElementById('productModalTitle').textContent = 'Agregar Producto';
        document.getElementById('saveButtonText').textContent = 'Guardar Producto';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }
    async editProduct(productId) {
        console.log(`✏️ Editing product ${productId}`);

        try {
            // Find product in current list first
            let product = this.products.find(p => p.id === productId);

            // If not found, fetch from API
            if (!product) {
                product = await API.request(`/products/${productId}`);
            }

            this.currentProduct = product;
            console.log('📝 Editing product:', product); // ✅ DEBUG

            // Fill form with product data
            document.getElementById('productModalTitle').textContent = 'Editar Producto';
            document.getElementById('saveButtonText').textContent = 'Actualizar Producto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.nombre || '';
            document.getElementById('productCategory').value = product.categoria || '';
            document.getElementById('productPrice').value = product.precio || '';
            document.getElementById('productStock').value = product.stock || '';
            document.getElementById('productDescription').value = product.descripcion || '';

            // ✅ MANEJO ESPECIAL DE IMAGEN
            const imageField = document.getElementById('productImage');
            if (product.imagen && product.imagen !== null) {
                imageField.value = product.imagen;
                console.log('📸 Loaded image:', product.imagen);
            } else {
                imageField.value = '';
                imageField.placeholder = 'Dejar vacío para mantener imagen actual';
                console.log('📸 No image found, field empty');
            }

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('productModal'));
            modal.show();

        } catch (error) {
            console.error('❌ Error loading product:', error);
            alert('Error al cargar el producto: ' + error.message);
        }
    }
    async saveProduct() {
        console.log('💾 Saving product...');

        const form = document.getElementById('productForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // ✅ LOGS DETALLADOS DE DEBUGGING
        const imageFieldElement = document.getElementById('productImage');
        console.log('🖼️ Image field element:', imageFieldElement);
        console.log('🖼️ Image field value RAW:', imageFieldElement.value);
        console.log('🖼️ Image field value TRIMMED:', imageFieldElement.value.trim());
        console.log('🖼️ Current product:', this.currentProduct);

        const imageValue = imageFieldElement.value.trim();
        let finalImageValue;

        if (this.currentProduct) {
            console.log('📝 EDITING MODE');
            console.log('🖼️ Current product image:', this.currentProduct.imagen);
            console.log('🖼️ New image value:', imageValue);

            if (imageValue === '') {
                finalImageValue = this.currentProduct.imagen;
                console.log('📸 Keeping existing image:', finalImageValue);
            } else {
                finalImageValue = imageValue;
                console.log('📸 Using new image:', finalImageValue);
            }
        } else {
            console.log('➕ CREATION MODE');
            finalImageValue = imageValue || null;
            console.log('📸 New product image:', finalImageValue);
        }

        // Get form data
        const productData = {
            nombre: document.getElementById('productName').value.trim(),
            categoria: document.getElementById('productCategory').value,
            precio: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            descripcion: document.getElementById('productDescription').value.trim() || null,
            imagen: finalImageValue,
            activo: true
        };

        // ✅ LOGS CRÍTICOS
        console.log('📦 FINAL Product data to save:', productData);
        console.log('🖼️ FINAL Image value in payload:', productData.imagen);
        console.log('🖼️ Image value type:', typeof productData.imagen);
        console.log('🖼️ Image value length:', productData.imagen ? productData.imagen.length : 'null/undefined');

        // Validate data
        if (!productData.nombre || !productData.categoria) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        if (productData.precio < 0 || productData.stock < 0) {
            alert('El precio y stock no pueden ser negativos.');
            return;
        }

        // UI feedback
        const saveButton = document.querySelector('#productModal .btn-primary');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
        saveButton.disabled = true;

        try {
            let response;
            if (this.currentProduct) {
                console.log(`🔄 Sending PUT to /products/${this.currentProduct.id}`);
                console.log('📤 PUT Payload:', JSON.stringify(productData, null, 2));

                response = await API.request(`/products/${this.currentProduct.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData)
                });
                console.log('✅ PUT Response:', response);
            } else {
                console.log('🔄 Sending POST to /products');
                console.log('📤 POST Payload:', JSON.stringify(productData, null, 2));

                response = await API.request('/products', {
                    method: 'POST',
                    body: JSON.stringify(productData)
                });
                console.log('✅ POST Response:', response);
            }

            // ✅ VERIFICAR RESPUESTA
            console.log('📥 Backend response imagen:', response.imagen);

            // Close modal and reload products
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            await this.loadProducts();
            await this.loadDashboardStats();

        } catch (error) {
            console.error('❌ Error saving product:', error);
            this.showError('Error al guardar producto: ' + error.message);
        } finally {
            // Reset button
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;
        }
    }


    async deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found');
            return;
        }

        const confirmed = confirm(`¿Estás seguro de eliminar "${product.nombre}"?\n\nEsta acción no se puede deshacer.`);
        if (!confirmed) return;

        console.log(`🗑️ Deleting product ${productId}`);

        try {
            await API.request(`/products/${productId}`, {
                method: 'DELETE'
            });

            console.log('✅ Product deleted successfully');
            this.showSuccess('Producto eliminado exitosamente');

            // Remove from local array and re-render
            this.products = this.products.filter(p => p.id !== productId);
            this.renderProductsTable(this.products);

            // Update stats
            await this.loadDashboardStats();

        } catch (error) {
            console.error('❌ Error deleting product:', error);
            this.showError('Error al eliminar producto: ' + error.message);
        }
    }

    // ===== DASHBOARD STATISTICS =====
    async loadDashboardStats() {
        console.log('📊 Loading dashboard statistics...');

        try {
            // Show loading state
            this.setStatsLoading(true);

            // Load all stats in parallel
            const [dashboardStats, salesStats, userStats] = await Promise.all([
                API.request('/reports/dashboard').catch(e => ({ error: e.message })),
                API.request('/reports/sales').catch(e => ({ error: e.message })),
                API.request('/reports/users').catch(e => ({ error: e.message }))
            ]);

            console.log('📈 Dashboard stats loaded:', { dashboardStats, salesStats, userStats });
            this.updateDashboardUI(dashboardStats, salesStats, userStats);

        } catch (error) {
            console.error('❌ Error loading dashboard stats:', error);
            this.showError('Error al cargar estadísticas: ' + error.message);
        } finally {
            this.setStatsLoading(false);
        }
    }

    setStatsLoading(loading) {
        const elements = ['totalProducts', 'totalOrders', 'totalUsers', 'totalRevenue'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = loading ? '...' : '0';
            }
        });
    }

    updateDashboardUI(dashboard, sales, users) {
        // Handle errors
        if (dashboard.error || sales.error || users.error) {
            console.warn('Some stats failed to load:', { dashboard: dashboard.error, sales: sales.error, users: users.error });
        }

        // General stats
        if (!dashboard.error) {
            this.updateElement('totalProducts', dashboard.totalProducts || 0);
            this.updateElement('totalOrders', dashboard.totalOrders || 0);
            this.updateElement('totalUsers', dashboard.totalUsers || 0);
            this.updateElement('totalRevenue', `S/. ${parseFloat(dashboard.totalRevenue || 0).toFixed(2)}`);
            this.updateElement('pendingOrders', dashboard.pendingOrders || 0);
            this.updateElement('completedOrders', dashboard.completedOrders || 0);
        }

        // Sales stats
        if (!sales.error) {
            this.updateElement('totalSales', `S/. ${parseFloat(sales.totalSales || 0).toFixed(2)}`);
            this.updateElement('ordersCount', sales.totalOrders || 0);
            this.updateElement('averageOrder', `S/. ${parseFloat(sales.averageOrder || 0).toFixed(2)}`);
        }

        // User stats
        if (!users.error) {
            this.updateElement('adminUsers', users.adminUsers || 0);
            this.updateElement('clientUsers', users.clientUsers || 0);
        }

        console.log('✅ Dashboard UI updated');
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // ===== UTILITY METHODS =====
    showSuccess(message) {
        console.log('✅ Success:', message);
        // You could implement a toast notification here
        // For now, use browser alert
        // alert(message);
    }

    showError(message) {
        console.error('❌ Error:', message);
        alert('Error: ' + message);
    }

    // ===== PUBLIC API METHODS =====
    refreshAll() {
        console.log('🔄 Refreshing all data...');
        return Promise.all([
            this.loadProducts(),
            this.loadDashboardStats()
        ]);
    }
}

// ===== GLOBAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOM loaded, initializing Admin Panel...');

    // Initialize admin panel
    window.AdminPanel = new AdminPanelManager();

    console.log('🎛️ Admin Panel loaded and ready');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function (event) {
    console.error('Global error in admin panel:', event.error);
});

window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled promise rejection in admin panel:', event.reason);
});

console.log('📝 Admin Panel script loaded');
