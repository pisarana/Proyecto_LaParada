// ===== DATOS SIMULADOS =====
const MOCK_DATA = {
    // Categorías
    categories: [
        { id: 1, name: "Bebidas", icon: "fas fa-glass-whiskey", color: "#3498db" },
        { id: 2, name: "Snacks", icon: "fas fa-cookie-bite", color: "#e67e22" },
        { id: 3, name: "Lácteos", icon: "fas fa-cheese", color: "#f39c12" },
        { id: 4, name: "Panadería", icon: "fas fa-bread-slice", color: "#d35400" },
        { id: 5, name: "Abarrotes", icon: "fas fa-box", color: "#27ae60" },
        { id: 6, name: "Carnes", icon: "fas fa-drumstick-bite", color: "#c0392b" },
        { id: 7, name: "Frutas y Verduras", icon: "fas fa-apple-alt", color: "#2ecc71" },
        { id: 8, name: "Limpieza", icon: "fas fa-spray-can", color: "#9b59b6" }
    ],

    // Usuarios de prueba
    users: [
        {
            id: 1,
            name: "Admin",
            email: "admin@laparada.com",
            password: "admin123",
            role: "ADMIN",
            avatar: "assets/images/avatars/admin.jpg",
            phone: "+51987654321",
            address: "La Victoria, Lima"
        },
        {
            id: 2,
            name: "Carlos Mendoza",
            email: "carlos@gmail.com",
            password: "cliente123",
            role: "CLIENTE",
            avatar: "assets/images/avatars/client1.jpg",
            phone: "+51912345678",
            address: "San Luis, Lima"
        }
    ],

    // Productos ampliados
    products: [
        {
            id: 1,
            name: "Coca Cola 500ml",
            category: "Bebidas",
            categoryId: 1,
            price: 2.50,
            originalPrice: 3.00,
            image: "assets/images/products/coca-cola.jpg",
            gallery: [
                "assets/images/products/coca-cola-1.jpg",
                "assets/images/products/coca-cola-2.jpg"
            ],
            description: "Gaseosa Coca Cola 500ml refrescante, perfecta para cualquier momento del día",
            longDescription: "La Coca Cola 500ml es la bebida refrescante más popular del mundo. Con su sabor único e inconfundible, es perfecta para acompañar tus comidas o disfrutar en cualquier momento del día. Elaborada con ingredientes de la más alta calidad.",
            stock: 50,
            rating: 4.5,
            reviews: 128,
            discount: 17,
            isNew: false,
            isFeatured: true,
            brand: "Coca Cola",
            barcode: "7750885005012",
            weight: "500ml",
            nutritionalInfo: {
                calories: 210,
                sugar: "27g",
                sodium: "75mg"
            },
            tags: ["refrescante", "gaseosa", "coca-cola", "500ml"]
        },
        {
            id: 2,
            name: "Galletas Oreo Original",
            category: "Snacks",
            categoryId: 2,
            price: 3.20,
            originalPrice: 3.80,
            image: "assets/images/products/oreo.jpg",
            description: "Galletas Oreo original 154g, el clásico sabor que amas",
            stock: 35,
            rating: 4.8,
            reviews: 89,
            discount: 16,
            isNew: false,
            isFeatured: true,
            brand: "Oreo",
            weight: "154g",
            tags: ["galletas", "oreo", "original", "snack"]
        }
        // ... más productos
    ],

    // Ofertas especiales
    specialOffers: [
        {
            id: 1,
            title: "2x1 en Bebidas",
            description: "Lleva 2 bebidas por el precio de 1",
            image: "assets/images/offers/2x1-bebidas.jpg",
            discount: 50,
            validUntil: "2025-12-31",
            categoryId: 1
        },
        {
            id: 2,
            title: "30% OFF en Snacks",
            description: "Descuento en toda la línea de snacks",
            image: "assets/images/offers/30-off-snacks.jpg",
            discount: 30,
            validUntil: "2025-11-30",
            categoryId: 2
        }
    ],

    // Testimonios
    testimonials: [
        {
            id: 1,
            name: "María González",
            avatar: "assets/images/testimonials/maria.jpg",
            rating: 5,
            comment: "Excelente servicio y productos frescos. La entrega es muy rápida.",
            date: "2025-08-15"
        },
        {
            id: 2,
            name: "José Ramirez",
            avatar: "assets/images/testimonials/jose.jpg",
            rating: 5,
            comment: "La mejor opción para compras rápidas. Precios justos y buena atención.",
            date: "2025-08-10"
        }
    ],

    // Preguntas frecuentes
    faqs: [
        {
            id: 1,
            question: "¿Cuál es el horario de atención?",
            answer: "Estamos abiertos de lunes a viernes de 7:00 AM a 10:00 PM, y sábados de 7:00 AM a 11:00 PM."
        },
        {
            id: 2,
            question: "¿Hacen delivery?",
            answer: "Sí, realizamos delivery en todas nuestras zonas de cobertura. El tiempo de entrega es de 30-45 minutos."
        },
        {
            id: 3,
            question: "¿Cuáles son los métodos de pago?",
            answer: "Aceptamos efectivo, tarjetas de débito/crédito, Yape, Plin y transferencias bancarias."
        }
    ]
};

// Funciones helper para acceder a los datos
const MockDataHelper = {
    // Obtener producto por ID
    getProductById(id) {
        return MOCK_DATA.products.find(product => product.id === parseInt(id));
    },

    // Obtener productos por categoría
    getProductsByCategory(categoryId) {
        return MOCK_DATA.products.filter(product => product.categoryId === parseInt(categoryId));
    },

    // Obtener productos destacados
    getFeaturedProducts() {
        return MOCK_DATA.products.filter(product => product.isFeatured);
    },

    // Obtener productos nuevos
    getNewProducts() {
        return MOCK_DATA.products.filter(product => product.isNew);
    },

    // Obtener productos con descuento
    getDiscountedProducts() {
        return MOCK_DATA.products.filter(product => product.discount > 0);
    },

    // Buscar productos
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return MOCK_DATA.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            (product.tags && product.tags.some(tag => tag.includes(searchTerm)))
        );
    },

    // Obtener categoría por ID
    getCategoryById(id) {
        return MOCK_DATA.categories.find(category => category.id === parseInt(id));
    },

    // Obtener usuario por email y password
    getUserByCredentials(email, password) {
        return MOCK_DATA.users.find(user => 
            user.email === email && user.password === password
        );
    }
};

// Exponer globalmente
window.MOCK_DATA = MOCK_DATA;
window.MockDataHelper = MockDataHelper;
