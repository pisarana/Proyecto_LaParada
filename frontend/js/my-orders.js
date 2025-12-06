// ===== MY ORDERS MANAGER =====
class MyOrdersManager {
    constructor() {
        this.orders = [];
        this.init();
    }

    async init() {
        console.log('📦 Initializing My Orders page...');

        // Check authentication
        if (!API.isLoggedIn()) {
            alert('Debes iniciar sesión para ver tus pedidos');
            window.location.href = '../auth/login.html';
            return;
        }

        // Update navbar
        AUTH.init();

        // Load orders
        await this.loadUserOrders();
    }

    async loadUserOrders() {
        console.log('📥 Loading user orders from API...');
        const ordersContainer = document.getElementById('ordersContainer');
        const user = API.getUser();
        const userId = user?.id;

        // Show loading state
        ordersContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando tus pedidos...</p>
            </div>
        `;

        try {
            // Load orders from API
            const response = await API.request(`/orders/user/${userId}`);
            this.orders = response || [];

            console.log(`✅ Loaded ${this.orders.length} orders for user ${userId}`);
            this.renderOrders(this.orders);

        } catch (error) {
            console.error('❌ Error loading orders:', error);
            ordersContainer.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    No pudimos cargar tus pedidos. Por favor intenta más tarde.
                    <br><small class="text-muted mt-2 d-block">Error: ${error.message}</small>
                </div>
            `;
        }
    }

    renderOrders(orders) {
        const ordersContainer = document.getElementById('ordersContainer');

        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No tienes pedidos todavía</h5>
                    <p class="text-muted">Cuando realices una compra, aparecerá aquí.</p>
                    <a href="../products/catalog.html" class="btn btn-primary mt-3">
                        <i class="fas fa-shopping-bag me-2"></i>Ir a la Tienda
                    </a>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = orders.map(order => this.renderOrderCard(order)).join('');
    }

    renderOrderCard(order) {
        const fecha = new Date(order.fechaCreacion).toLocaleDateString('es-PE');
        const estado = order.estado || 'PENDIENTE';
        const estadoBadgeClass = this.getStatusBadgeClass(estado);
        
        const itemsHTML = (order.items || []).map(item => `
            <tr>
                <td>${item.productoNombre || 'Producto'}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-end">S/. ${parseFloat(item.precio || 0).toFixed(2)}</td>
                <td class="text-end"><strong>S/. ${(parseFloat(item.precio || 0) * item.cantidad).toFixed(2)}</strong></td>
            </tr>
        `).join('');

        return `
            <div class="card mb-4 shadow-sm">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <strong>#${order.id}</strong> 
                        <span class="text-muted ms-3">📅 ${fecha}</span>
                    </div>
                    <span class="badge ${estadoBadgeClass}" style="font-size: 0.9em;">
                        ${estado}
                    </span>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p><small class="text-muted">Dirección de entrega:</small></p>
                            <p><strong>${order.direccionEntrega || 'No especificada'}</strong></p>
                        </div>
                        <div class="col-md-6">
                            <p><small class="text-muted">Método de pago:</small></p>
                            <p><strong>${order.metodoPago || 'No especificado'}</strong></p>
                        </div>
                    </div>
                    
                    <h6 class="mb-2">Detalles del Pedido:</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th>Producto</th>
                                    <th class="text-center">Cantidad</th>
                                    <th class="text-end">Precio</th>
                                    <th class="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHTML}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer bg-light d-flex justify-content-end">
                    <h5>Total: <span class="text-success">S/. ${parseFloat(order.total || 0).toFixed(2)}</span></h5>
                </div>
            </div>
        `;
    }

    getStatusBadgeClass(status) {
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.MyOrders = new MyOrdersManager();
});