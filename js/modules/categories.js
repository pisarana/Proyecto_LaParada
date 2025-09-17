// ===== MÓDULO DE CATEGORÍAS =====
const CategoriesModule = {
    // Configuración
    config: {
        categories: [
            {
                id: 'bebidas',
                name: 'Bebidas',
                description: 'Refrescos, jugos, aguas y más',
                icon: 'fas fa-wine-bottle',
                color: '#2196F3'
            },
            {
                id: 'lacteos',
                name: 'Lácteos',
                description: 'Leche, quesos, yogures y derivados',
                icon: 'fas fa-cheese',
                color: '#4CAF50'
            },
            {
                id: 'aseo-personal',
                name: 'Aseo Personal',
                description: 'Productos de higiene y cuidado personal',
                icon: 'fas fa-pump-soap',
                color: '#FF9800'
            },
            {
                id: 'carnes',
                name: 'Carnes',
                description: 'Carnes frescas, pollo, pescado y embutidos',
                icon: 'fas fa-drumstick-bite',
                color: '#F44336'
            },
            {
                id: 'frutas-verduras',
                name: 'Frutas y Verduras',
                description: 'Productos frescos y orgánicos',
                icon: 'fas fa-apple-alt',
                color: '#8BC34A'
            },
            {
                id: 'panaderia',
                name: 'Panadería',
                description: 'Pan fresco, pasteles y productos horneados',
                icon: 'fas fa-bread-slice',
                color: '#795548'
            }
        ]
    },

    // Estado
    state: {
        selectedCategory: null,
        isLoading: false
    },

    // Inicializar
    init() {
        this.bindEvents();
        this.updateCartFromStorage();
        this.initAnimations();
        console.log('🛍️ Categories Module initialized');
    },

    // Vincular eventos
    bindEvents() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            // Click event
            card.addEventListener('click', (e) => {
                const categoryId = card.getAttribute('data-category');
                this.selectCategory(categoryId);
            });
            
            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                this.showCategoryPreview(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.hideCategoryPreview(card);
            });
        });
    },

    // Seleccionar categoría
    selectCategory(categoryId) {
        if (this.state.isLoading) return;
        
        this.state.isLoading = true;
        this.state.selectedCategory = categoryId;
        
        const categoryCard = document.querySelector(`[data-category="${categoryId}"]`);
        if (categoryCard) {
            categoryCard.classList.add('loading');
        }
        
        // Mostrar feedback visual
        this.showCategorySelection(categoryId);
        
        // Simular navegación (reemplazar con navegación real)
        setTimeout(() => {
            this.navigateToCategory(categoryId);
        }, 800);
    },

    // Mostrar selección de categoría
    showCategorySelection(categoryId) {
        const category = this.config.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'category-selection-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${category.icon} me-2"></i>
                <span>Cargando ${category.name}...</span>
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </div>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: ${category.color};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remover
        setTimeout(() => {
            notification.remove();
        }, 1500);
    },

    // Navegar a categoría
    navigateToCategory(categoryId) {
        const category = this.config.categories.find(cat => cat.id === categoryId);
        if (!category) {
            console.error('Category not found:', categoryId);
            return;
        }
        
        console.log(`🔗 Navegando a categoría: ${category.name}`);
        
        // Aquí puedes implementar la navegación real
        // Por ejemplo: window.location.href = `category-products.html?category=${categoryId}`;
        
        // Para demo, mostrar alerta
        alert(`Navegando a la categoría: ${category.name}\n\nEn la implementación final, esto redirigirá a la página de productos de la categoría.`);
        
        // Resetear estado
        this.state.isLoading = false;
        this.state.selectedCategory = null;
        
        const categoryCard = document.querySelector(`[data-category="${categoryId}"]`);
        if (categoryCard) {
            categoryCard.classList.remove('loading');
        }
    },

    // Mostrar preview de categoría (hover)
    showCategoryPreview(card) {
        const categoryId = card.getAttribute('data-category');
        const category = this.config.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'category-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">
                <i class="${category.icon} me-2"></i>
                <strong>${category.name}</strong>
            </div>
            <div class="tooltip-description">${category.description}</div>
        `;
        
        // Estilos para tooltip
        tooltip.style.cssText = `
            position: absolute;
            bottom: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: ${category.color};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.9rem;
            white-space: nowrap;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid ${category.color};
        `;
        tooltip.appendChild(arrow);
        
        card.appendChild(tooltip);
        
        // Mostrar tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);
    },

    // Ocultar preview de categoría
    hideCategoryPreview(card) {
        const tooltip = card.querySelector('.category-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },

    // Inicializar animaciones
    initAnimations() {
        // Observer para animaciones al scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar tarjetas de categorías
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => observer.observe(card));
    },

    // Actualizar carrito desde storage
    updateCartFromStorage() {
        try {
            const cartData = localStorage.getItem('laparada_cart');
            const cartCount = document.getElementById('cartCount');
            
            if (cartData && cartCount) {
                const cart = JSON.parse(cartData);
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    },

    // Utilidades
    utils: {
        // Obtener categoría por ID
        getCategoryById(id) {
            return CategoriesModule.config.categories.find(cat => cat.id === id);
        },

        // Generar color aleatorio para nuevas categorías
        generateCategoryColor() {
            const colors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }
};

// Función global para navegación (llamada desde HTML)
function goToCategory(categoryId) {
    CategoriesModule.selectCategory(categoryId);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    CategoriesModule.init();
});

// Exponer globalmente
window.CategoriesModule = CategoriesModule;
window.goToCategory = goToCategory;
