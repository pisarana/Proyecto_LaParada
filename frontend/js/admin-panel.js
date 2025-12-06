// ===== ADMIN PANEL MANAGER - MINIMARKET LA PARADA =====
/**
 * Gestor completo del panel administrativo
 * Maneja productos, pedidos, usuarios y reportes
 */
class AdminPanelManager {
    constructor() {
        this.currentProduct = null;
        this.products = [];
        this.ordersCache = [];
        this.usersCache = [];
        this.isLoading = false;
        this.init();
    }

    // ===== INITIALIZATION =====
    init() {
        console.log('🔧 Inicializando Panel Administrativo...');
        this.checkAdminAuth();
        AUTH.init();
        this.loadProducts();
        this.bindEvents();
        this.setupErrorHandling();
        
        // Cargar estadísticas con delay para asegurar que el DOM está listo
        setTimeout(() => {
            console.log('⏱️ Cargando estadísticas del dashboard...');
            this.loadDashboardStats();
        }, 300);
        
        console.log('✅ Panel Administrativo listo');
    }

    /**
     * Manejo global de errores
     */
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('❌ Error global:', e.message);
            this.showNotification('Error: ' + e.message, 'danger');
        });
    }

    // ===== AUTHENTICATION =====
    checkAdminAuth() {
        const user = API.getUser();
        if (!user || user.rol !== 'ADMINISTRADOR') {
            console.warn('⚠️ Acceso denegado: No es administrador');
            this.showNotification('Acceso denegado. Solo administradores pueden acceder.', 'danger');
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1000);
            return false;
        }

        // Actualizar saludo del administrador
        const greeting = document.getElementById('adminGreeting');
        if (greeting) {
            greeting.textContent = `${user.nombre}`;
        }

        console.log('✅ Administrador autenticado:', user.nombre);
        return true;
    }

    logout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            API.logout();
            this.showNotification('Sesión cerrada correctamente', 'success');
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 500);
        }
    }

    /**
     * Mostrar notificación al usuario
     */
    showNotification(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            <strong>${type === 'danger' ? '❌ Error' : type === 'success' ? '✅ Éxito' : 'ℹ️ Información'}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '400px';
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
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

        // Orders tab
        const ordersTab = document.getElementById('nav-orders-tab');
        if (ordersTab) {
            ordersTab.addEventListener('shown.bs.tab', () => {
                console.log('📦 Orders tab shown, loading orders...');
                this.loadOrders();
            });
        }

        // Users tab
        const usersTab = document.getElementById('nav-users-tab');
        if (usersTab) {
            usersTab.addEventListener('shown.bs.tab', () => {
                console.log('👥 Users tab shown, loading users...');
                this.loadUsers();
            });
        }

        // Refresh buttons
        const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');
        if (refreshOrdersBtn) {
            refreshOrdersBtn.addEventListener('click', () => this.loadOrders());
        }

        const refreshUsersBtn = document.getElementById('refreshUsersBtn');
        if (refreshUsersBtn) {
            refreshUsersBtn.addEventListener('click', () => this.loadUsers());
        }

        // Filter orders by status
        const filterOrderStatus = document.getElementById('filterOrderStatus');
        if (filterOrderStatus) {
            filterOrderStatus.addEventListener('change', () => this.applyOrderStatusFilter());
        }

        // Order status and cancel buttons
        const saveOrderStatusBtn = document.getElementById('saveOrderStatusBtn');
        if (saveOrderStatusBtn) {
            saveOrderStatusBtn.addEventListener('click', () => this.updateOrderStatus());
        }

        const cancelOrderBtn = document.getElementById('cancelOrderBtn');
        if (cancelOrderBtn) {
            cancelOrderBtn.addEventListener('click', () => {
                const modal = document.getElementById('orderModal');
                const orderId = modal.dataset.orderId;
                if (orderId) this.cancelOrder(orderId);
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

    // ===== ORDERS MANAGEMENT =====
    async loadOrders() {
        console.log('📦 Loading orders...');
        const tableBody = document.getElementById('ordersTableBody');
        const loadingDiv = document.getElementById('ordersLoading');
        const emptyDiv = document.getElementById('ordersEmpty');

        // Show loading
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (emptyDiv) emptyDiv.style.display = 'none';
        if (tableBody) tableBody.innerHTML = '';

        try {
            const page = 0;
            const size = 50;
            const response = await API.request(`/orders?page=${page}&size=${size}`);
            
            // Handle paginated response
            const orders = response.content || response || [];
            console.log(`✅ Loaded ${orders.length} orders`);
            
            this.renderOrdersTable(orders);
        } catch (error) {
            console.error('❌ Error loading orders:', error);
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger py-4">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Error al cargar pedidos: ${error.message}
                        </td>
                    </tr>
                `;
            }
        } finally {
            if (loadingDiv) loadingDiv.style.display = 'none';
        }
    }

    renderOrdersTable(orders) {
        const tableBody = document.getElementById('ordersTableBody');
        if (!tableBody) return;

        if (!orders || orders.length === 0) {
            const emptyDiv = document.getElementById('ordersEmpty');
            if (emptyDiv) emptyDiv.style.display = 'block';
            tableBody.innerHTML = '';
            return;
        }

        const emptyDiv = document.getElementById('ordersEmpty');
        if (emptyDiv) emptyDiv.style.display = 'none';

        tableBody.innerHTML = orders.map(order => {
            const total = parseFloat(order.total || 0).toFixed(2);
            const fecha = new Date(order.fechaCreacion || order.fecha).toLocaleDateString('es-PE');
            const estado = order.estado || 'PENDIENTE';
            const usuario = order.usuario?.nombre || order.usuarioNombre || 'Usuario #' + order.usuarioId;

            return `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td>${this.escapeHtml(usuario)}</td>
                    <td><strong>S/. ${total}</strong></td>
                    <td>${fecha}</td>
                    <td>
                        <span class="badge ${this.getOrderStatusBadgeClass(estado)}">
                            ${estado}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-primary" 
                                    onclick="AdminPanel.viewOrderDetails(${order.id})" 
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-warning" 
                                    onclick="AdminPanel.editOrderStatus(${order.id})" 
                                    title="Cambiar estado">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getOrderStatusBadgeClass(status) {
        switch (status) {
            case 'PENDIENTE':
            case 'CONFIRMADO':
                return 'bg-warning';
            case 'EN_PREPARACION':
            case 'EN_CAMINO':
                return 'bg-info';
            case 'ENTREGADO':
                return 'bg-success';
            case 'CANCELADO':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    async viewOrderDetails(orderId) {
        console.log(`👁️ Viewing order ${orderId}`);
        try {
            const order = await API.request(`/orders/${orderId}`);
            
            // Update modal with order details
            document.getElementById('orderIdView').textContent = order.id;
            document.getElementById('orderUserView').textContent = order.usuario?.nombre || 'Usuario #' + order.usuarioId;
            document.getElementById('orderTotalView').textContent = parseFloat(order.total || 0).toFixed(2);
            
            // Items list
            const itemsList = document.getElementById('orderItemsList');
            if (order.items && order.items.length > 0) {
                itemsList.innerHTML = order.items.map(item => `
                    <li>
                        <strong>${this.escapeHtml(item.productoNombre || 'Producto')}</strong> x${item.cantidad} = S/. ${parseFloat(item.precio || 0).toFixed(2)}
                    </li>
                `).join('');
            } else {
                itemsList.innerHTML = '<li>No hay ítems</li>';
            }
            
            // Set current status in select
            document.getElementById('orderStatusSelect').value = order.estado || 'PENDIENTE';
            
            // Store order ID for updates
            document.getElementById('orderModal').dataset.orderId = orderId;
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('orderModal'));
            modal.show();
            
        } catch (error) {
            console.error('❌ Error loading order:', error);
            alert('Error al cargar el pedido: ' + error.message);
        }
    }

    async editOrderStatus(orderId) {
        this.viewOrderDetails(orderId);
    }

    async updateOrderStatus() {
        const modal = document.getElementById('orderModal');
        const orderId = modal.dataset.orderId;
        const newStatus = document.getElementById('orderStatusSelect').value;

        console.log(`🔄 Updating order ${orderId} status to ${newStatus}`);

        try {
            await API.request(`/orders/${orderId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });

            console.log('✅ Order status updated');
            this.showSuccess(`Pedido #${orderId} actualizado a ${newStatus}`);
            
            // Close modal and reload
            bootstrap.Modal.getInstance(modal).hide();
            await this.loadOrders();

        } catch (error) {
            console.error('❌ Error updating order status:', error);
            this.showError('Error al actualizar estado: ' + error.message);
        }
    }

    async cancelOrder(orderId) {
        if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;

        console.log(`❌ Cancelling order ${orderId}`);

        try {
            await API.request(`/orders/${orderId}`, {
                method: 'DELETE'
            });

            console.log('✅ Order cancelled');
            this.showSuccess(`Pedido #${orderId} cancelado`);
            
            // Close modal and reload
            const modal = document.getElementById('orderModal');
            bootstrap.Modal.getInstance(modal).hide();
            await this.loadOrders();

        } catch (error) {
            console.error('❌ Error cancelling order:', error);
            this.showError('Error al cancelar pedido: ' + error.message);
        }
    }

    applyOrderStatusFilter() {
        const filterStatus = document.getElementById('filterOrderStatus')?.value;
        if (!filterStatus) {
            this.loadOrders();
            return;
        }
        
        console.log(`🔍 Filtering orders by status: ${filterStatus}`);
        // TODO: Implement filter if API supports it, for now reload all
        this.loadOrders();
    }

    // ===== USERS MANAGEMENT =====
    async loadUsers() {
        console.log('👥 Loading users...');
        const tableBody = document.getElementById('usersTableBody');
        const loadingDiv = document.getElementById('usersLoading');
        const emptyDiv = document.getElementById('usersEmpty');

        // Show loading
        if (loadingDiv) loadingDiv.style.display = 'block';
        if (emptyDiv) emptyDiv.style.display = 'none';
        if (tableBody) tableBody.innerHTML = '';

        try {
            const users = await API.request('/users');
            console.log(`✅ Loaded ${users.length} users`);
            
            this.renderUsersTable(users);
        } catch (error) {
            console.error('❌ Error loading users:', error);
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-danger py-4">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Error al cargar usuarios: ${error.message}
                        </td>
                    </tr>
                `;
            }
        } finally {
            if (loadingDiv) loadingDiv.style.display = 'none';
        }
    }

    renderUsersTable(users) {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        if (!users || users.length === 0) {
            const emptyDiv = document.getElementById('usersEmpty');
            if (emptyDiv) emptyDiv.style.display = 'block';
            tableBody.innerHTML = '';
            return;
        }

        const emptyDiv = document.getElementById('usersEmpty');
        if (emptyDiv) emptyDiv.style.display = 'none';

        tableBody.innerHTML = users.map(user => {
            const isActive = user.activo !== false;
            return `
                <tr>
                    <td><strong>#${user.id}</strong></td>
                    <td>${this.escapeHtml(user.nombre)}</td>
                    <td>${this.escapeHtml(user.email)}</td>
                    <td>${this.escapeHtml(user.telefono || '-')}</td>
                    <td>
                        <span class="badge ${isActive ? 'bg-success' : 'bg-danger'}">
                            ${isActive ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group">
                            <button class="btn btn-outline-primary" 
                                    onclick="AdminPanel.viewUserDetails(${user.id})" 
                                    title="Ver detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async viewUserDetails(userId) {
        console.log(`👁️ Viewing user ${userId}`);
        try {
            const user = await API.request(`/users/${userId}`);
            
            // Update modal with user details
            document.getElementById('userIdView').textContent = user.id;
            document.getElementById('userNameView').textContent = this.escapeHtml(user.nombre);
            document.getElementById('userEmailView').textContent = this.escapeHtml(user.email);
            document.getElementById('userPhoneView').textContent = this.escapeHtml(user.telefono || '-');
            document.getElementById('userAddressView').textContent = this.escapeHtml(user.direccion || '-');
            document.getElementById('userActiveView').textContent = user.activo !== false ? 'Sí' : 'No';
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('userModal'));
            modal.show();
            
        } catch (error) {
            console.error('❌ Error loading user:', error);
            alert('Error al cargar el usuario: ' + error.message);
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
        console.log('📊 Updating Dashboard UI with:', { dashboard, sales, users });
        
        // Handle errors
        if (dashboard.error || sales.error || users.error) {
            console.warn('Some stats failed to load:', { dashboard: dashboard.error, sales: sales.error, users: users.error });
        }

        // General stats - Handle both snake_case and camelCase from backend
        if (!dashboard.error && dashboard !== null && dashboard !== undefined) {
            // Total Products
            const totalProducts = dashboard.totalProducts || dashboard.total_products || 0;
            this.updateElement('totalProducts', totalProducts);
            
            // Total Orders
            const totalOrders = dashboard.totalOrders || dashboard.total_orders || 0;
            this.updateElement('totalOrders', totalOrders);
            
            // Total Users
            const totalUsers = dashboard.totalUsers || dashboard.total_users || 0;
            this.updateElement('totalUsers', totalUsers);
            
            // Total Revenue
            const totalRevenue = dashboard.totalRevenue || dashboard.total_revenue || 0;
            this.updateElement('totalRevenue', `S/. ${parseFloat(totalRevenue || 0).toFixed(2)}`);
            
            // Order breakdown - Handle multiple field name variations
            const pendingOrders = dashboard.pendingOrders || dashboard.pending_orders || dashboard.pendientes || 0;
            this.updateElement('pendingOrders', pendingOrders);
            
            const processingOrders = dashboard.processingOrders || dashboard.processing_orders || dashboard.enCamino || dashboard.en_camino || 0;
            this.updateElement('processingOrders', processingOrders);
            
            const completedOrders = dashboard.completedOrders || dashboard.completed_orders || dashboard.entregados || 0;
            this.updateElement('completedOrders', completedOrders);
            
            console.log('✅ Dashboard main stats updated:', { totalProducts, totalOrders, totalUsers, totalRevenue });
        }

        // Sales stats
        if (!sales.error && sales !== null && sales !== undefined) {
            const totalSales = sales.totalSales || sales.total_sales || 0;
            this.updateElement('totalSales', `S/. ${parseFloat(totalSales || 0).toFixed(2)}`);
            
            const ordersCount = sales.totalOrders || sales.total_orders || sales.ordersCount || 0;
            this.updateElement('ordersCount', ordersCount);
            
            // Calculate average order value
            let averageOrder = 0;
            if (ordersCount > 0) {
                averageOrder = parseFloat(totalSales) / parseFloat(ordersCount);
            }
            this.updateElement('averageOrder', `S/. ${averageOrder.toFixed(2)}`);
            
            console.log('✅ Sales stats updated:', { totalSales, ordersCount, averageOrder });
        }

        // User stats
        if (!users.error && users !== null && users !== undefined) {
            const adminUsers = users.adminUsers || users.admin_users || users.admins || 0;
            this.updateElement('adminUsers', adminUsers);
            
            const clientUsers = users.clientUsers || users.client_users || users.clients || 0;
            this.updateElement('clientUsers', clientUsers);
            
            // Total users in analytics section
            const totalAnalyticsUsers = (adminUsers || 0) + (clientUsers || 0);
            this.updateElement('totalUsersAnalytics', totalAnalyticsUsers);
            
            console.log('✅ User stats updated:', { adminUsers, clientUsers, totalUsersAnalytics: totalAnalyticsUsers });
        }

        console.log('✅ Dashboard UI fully updated');
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log(`✏️ Updated #${id} with value: ${value}`);
        } else {
            console.warn(`⚠️ Element with ID "${id}" not found in DOM`);
            // Try to find it with different approaches
            const allElements = document.querySelectorAll(`[id*="${id}"]`);
            if (allElements.length > 0) {
                console.log(`Found ${allElements.length} elements with similar ID:`, allElements);
            }
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

    exportReport() {
        console.log('📥 Exporting report...');
        alert('La funcionalidad de exportar reportes estará disponible pronto. Por ahora puedes descargar desde el navegador (Ctrl+S o Cmd+S).');
    }

    // ===== PUBLIC API METHODS =====
    refreshAll() {
        console.log('🔄 Refreshing all data...');
        return Promise.all([
            this.loadProducts(),
            this.loadOrders(),
            this.loadUsers(),
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
