// ===== MÓDULO DEL PANEL ADMINISTRATIVO =====
const AdminModule = {
    // Estado
    state: {
        isAdmin: false,
        adminUser: null,
        stats: {
            totalProducts: 0,
            totalOrders: 0,
            totalUsers: 0,
            totalRevenue: 0
        }
    },

    // Inicializar
    init() {
        this.checkAdminAccess();
        this.loadAdminData();
        this.loadStatistics();
        this.bindEvents();
        console.log('🛡️ Admin Dashboard Module initialized');
    },

    // Verificar acceso de administrador
    checkAdminAccess() {
        try {
            const userData = localStorage.getItem('laparada_user');
            if (!userData) {
                this.redirectToLogin();
                return;
            }

            const user = JSON.parse(userData);
            
            // Verificar si el usuario tiene rol de administrador
            if (!user.isAdmin && user.role !== 'admin') {
                alert('Acceso denegado. No tienes permisos de administrador.');
                window.location.href = '../../index.html';
                return;
            }

            this.state.isAdmin = true;
            this.state.adminUser = user;
            this.updateAdminUI();
            
        } catch (error) {
            console.error('Error checking admin access:', error);
            this.redirectToLogin();
        }
    },

    // Cargar datos del administrador
    loadAdminData() {
        if (this.state.adminUser) {
            const adminGreeting = document.getElementById('adminGreeting');
            if (adminGreeting) {
                const adminName = this.state.adminUser.nombre || 'Admin';
                adminGreeting.textContent = `Hola, ${adminName}`;
            }
        }
    },

    // Cargar estadísticas
    async loadStatistics() {
        try {
            if (ApiConfig.mode === 'real') {
                // Llamadas reales al backend
                const [products, orders, users, revenue] = await Promise.all([
                    fetch(`${ApiConfig.baseURL}/admin/stats/products`, { headers: ApiConfig.headers }),
                    fetch(`${ApiConfig.baseURL}/admin/stats/orders`, { headers: ApiConfig.headers }),
                    fetch(`${ApiConfig.baseURL}/admin/stats/users`, { headers: ApiConfig.headers }),
                    fetch(`${ApiConfig.baseURL}/admin/stats/revenue`, { headers: ApiConfig.headers })
                ]);

                this.state.stats = {
                    totalProducts: await products.json(),
                    totalOrders: await orders.json(),
                    totalUsers: await users.json(),
                    totalRevenue: await revenue.json()
                };
            } else {
                // Estadísticas mock
                this.state.stats = {
                    totalProducts: MockData.products?.length || 0,
                    totalOrders: this.getMockOrders(),
                    totalUsers: this.getMockUsers(),
                    totalRevenue: this.getMockRevenue()
                };
            }

            this.updateStatisticsUI();
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    },

    // Datos mock para estadísticas
    getMockOrders() {
        return Math.floor(Math.random() * 150) + 50; // 50-200 pedidos
    },

    getMockUsers() {
        return Math.floor(Math.random() * 500) + 100; // 100-600 usuarios
    },

    getMockRevenue() {
        return (Math.random() * 50000 + 10000).toFixed(2); // S/. 10,000 - 60,000
    },

    // Actualizar UI de estadísticas
    updateStatisticsUI() {
        const totalProducts = document.getElementById('totalProducts');
        const totalOrders = document.getElementById('totalOrders');
        const totalUsers = document.getElementById('totalUsers');
        const totalRevenue = document.getElementById('totalRevenue');

        if (totalProducts) totalProducts.textContent = this.state.stats.totalProducts;
        if (totalOrders) totalOrders.textContent = this.state.stats.totalOrders;
        if (totalUsers) totalUsers.textContent = this.state.stats.totalUsers;
        if (totalRevenue) totalRevenue.textContent = `S/. ${this.state.stats.totalRevenue}`;
    },

    // Actualizar UI del administrador
    updateAdminUI() {
        // Agregar clase admin al body
        document.body.classList.add('admin-mode');
    },

    // Vincular eventos
    bindEvents() {
        // Prevenir acceso no autorizado
        window.addEventListener('beforeunload', () => {
            if (!this.state.isAdmin) {
                this.redirectToLogin();
            }
        });
    },

    // Navegar a módulos específicos
    goToModule(module) {
        switch (module) {
            case 'add-product':
                this.goToAddProduct();
                break;
            case 'stock-management':
                this.goToStockManagement();
                break;
            case 'delete-product':
                this.goToDeleteProduct();
                break;
            case 'payment-management':
                this.goToPaymentManagement();
                break;
            default:
                console.warn('Módulo no reconocido:', module);
        }
    },

    // Ir a Agregar Producto
    goToAddProduct() {
        LaParadaApp.showNotification('Redirigiendo a Agregar Producto...', 'info');
        setTimeout(() => {
            // En implementación real:
            // window.location.href = 'add-product.html';
            
            // Para demo:
            this.showModuleDemo('Agregar Producto', 'Aquí podrás agregar nuevos productos al inventario.');
        }, 1000);
    },

    // Ir a Gestión de Stock
    goToStockManagement() {
        LaParadaApp.showNotification('Redirigiendo a Gestión de Stock...', 'info');
        setTimeout(() => {
            // En implementación real:
            // window.location.href = 'stock-management.html';
            
            // Para demo:
            this.showModuleDemo('Gestión de Stock', 'Aquí podrás ver y actualizar el stock de productos.');
        }, 1000);
    },

    // Ir a Eliminar Producto
    goToDeleteProduct() {
        LaParadaApp.showNotification('Redirigiendo a Eliminar Producto...', 'info');
        setTimeout(() => {
            // En implementación real:
            // window.location.href = 'delete-product.html';
            
            // Para demo:
            this.showModuleDemo('Eliminar Producto', 'Aquí podrás eliminar productos del inventario.');
        }, 1000);
    },

    // Ir a Gestión de Pagos
    goToPaymentManagement() {
        LaParradaApp.showNotification('Redirigiendo a Gestión de Pagos...', 'info');
        setTimeout(() => {
            // En implementación real:
            // window.location.href = 'payment-management.html';
            
            // Para demo:
            this.showModuleDemo('Gestión de Pagos', 'Aquí podrás ver y gestionar los pagos del sistema.');
        }, 1000);
    },

    // Demo de módulos (temporal)
    showModuleDemo(title, description) {
        const modalHTML = `
            <div class="modal fade" id="moduleModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-cog me-2"></i>
                                ${title}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="fas fa-tools fa-3x text-primary mb-3"></i>
                            <h6>Módulo en Desarrollo</h6>
                            <p class="text-muted">${description}</p>
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                Este módulo será implementado según las necesidades específicas del proyecto.
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="AdminModule.implementModule('${title.toLowerCase().replace(' ', '-')}')">
                                Solicitar Implementación
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('moduleModal'));
        modal.show();
        
        // Remover modal cuando se cierre
        document.getElementById('moduleModal').addEventListener('hidden.bs.modal', (e) => {
            e.target.remove();
        });
    },

    // Implementar módulo
    implementModule(module) {
        alert(`Solicitud de implementación enviada para: ${module}\n\nEl equipo de desarrollo será notificado.`);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('moduleModal'));
        modal.hide();
    },

    // Cerrar sesión de administrador
    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Limpiar datos de sesión
            localStorage.removeItem('laparada_user');
            localStorage.removeItem('admin_session');
            
            LaParadaApp.showNotification('Sesión de administrador cerrada', 'info');
            
            // Redirigir al login
            setTimeout(() => {
                window.location.href = '/frontend/pages/auth/login.html';
            }, 1500);
        }
    },

    // Redirigir al login
    redirectToLogin() {
        alert('Debes iniciar sesión como administrador para acceder a este panel.');
        window.location.href = '/frontend/pages/auth/login.html';
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AdminModule.init();
});

// Exponer globalmente
window.AdminModule = AdminModule;
