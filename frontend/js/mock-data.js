// ===== DATOS SIMULADOS =====
//MISAEL CHALLCO 17-09
//AGREGAR IMAGENES FALTANTES DE GOOGLE Y SUBIR SUS CAMBIOS
const MockData = {
    products: [
        // BEBIDAS
        {
            id: 1,
            name: "Coca Cola 500ml",
            category: "bebidas",
            price: 3.50,
            originalPrice: 4.00,
            image: "../../assets/images/products/cocacola.jpg",
            description: "Refresco de cola clásico",
            stock: 50,
            rating: 4.5,
            reviews: 128
        },
        {
            id: 2,
            name: "Agua San Luis 625ml",
            category: "bebidas",
            price: 1.50,
            image: "../../assets/images/products/agua-san-luis.jpg",
            description: "Agua mineral natural",
            stock: 100,
            rating: 4.8,
            reviews: 95
        },
        // LÁCTEOS
        {
            id: 3,
            name: "Leche Gloria UHT 1L",
            category: "lacteos",
            price: 4.20,
            image: "../../assets/images/products/leche-gloria.jpg",
            description: "Leche entera ultra pasteurizada",
            stock: 30,
            rating: 4.6,
            reviews: 87
        },
        {
            id: 4,
            name: "Queso Bonlé Fresco",
            category: "lacteos",
            price: 8.50,
            originalPrice: 9.00,
            image: "../../assets/images/products/queso-bonle.jpg",
            description: "Queso fresco premium",
            stock: 15,
            rating: 4.4,
            reviews: 63
        },
        // ASEO PERSONAL
        {
            id: 5,
            name: "Champú Pantene 400ml",
            category: "aseo-personal",
            price: 12.90,
            image: "../../assets/images/products/champu-pantene.jpg",
            description: "Champú reparador dorado",
            stock: 25,
            rating: 4.7,
            reviews: 142
        },
        {
            id: 6,
            name: "Jabón Dove Original",
            category: "aseo-personal",
            price: 3.80,
            image: "../../assets/images/products/jabon-dove.jpg",
            description: "Jabón humectante original",
            stock: 40,
            rating: 4.3,
            reviews: 76
        },
        // CARNES
        {
            id: 7,
            name: "Pollo Entero San Fernando",
            category: "carnes",
            price: 15.50,
            originalPrice: 17.00,
            image: "../../assets/images/products/pollo-san-fernando.jpg",
            description: "Pollo fresco entero",
            stock: 8,
            rating: 4.5,
            reviews: 54
        },
        {
            id: 8,
            name: "Salchichas Otto Kunz",
            category: "carnes",
            price: 6.90,
            image: "../../assets/images/products/salchichas-otto.jpg",
            description: "Salchichas premium",
            stock: 20,
            rating: 4.2,
            reviews: 89
        },
        // FRUTAS Y VERDURAS
        {
            id: 9,
            name: "Manzanas Red Delicious",
            category: "frutas-verduras",
            price: 5.50,
            image: "../../assets/images/products/manzanas-red.jpg",
            description: "Manzanas rojas dulces por kg",
            stock: 35,
            rating: 4.6,
            reviews: 43
        },
        {
            id: 10,
            name: "Tomates Cherry",
            category: "frutas-verduras",
            price: 8.20,
            originalPrice: 9.50,
            image: "../../assets/images/products/tomates-cherry.jpg",
            description: "Tomates cherry frescos por kg",
            stock: 12,
            rating: 4.8,
            reviews: 67
        },
        // PANADERÍA
        {
            id: 11,
            name: "Pan Integral Bimbo",
            category: "panaderia",
            price: 4.80,
            image: "../../assets/images/products/pan-integral-bimbo.jpg",
            description: "Pan integral en rebanadas",
            stock: 22,
            rating: 4.4,
            reviews: 91
        },
        {
            id: 12,
            name: "Donitas Bimbo Pack 6",
            category: "panaderia",
            price: 7.20,
            originalPrice: 8.00,
            image: "../../assets/images/products/donitas-bimbo.jpg",
            description: "Donitas glaseadas pack de 6",
            stock: 18,
            rating: 4.1,
            reviews: 156
        }
    ],

    categories: [
        { id: 'bebidas', name: 'Bebidas', icon: 'fas fa-wine-bottle' },
        { id: 'lacteos', name: 'Lácteos', icon: 'fas fa-cheese' },
        { id: 'aseo-personal', name: 'Aseo Personal', icon: 'fas fa-pump-soap' },
        { id: 'carnes', name: 'Carnes', icon: 'fas fa-drumstick-bite' },
        { id: 'frutas-verduras', name: 'Frutas y Verduras', icon: 'fas fa-apple-alt' },
        { id: 'panaderia', name: 'Panadería', icon: 'fas fa-bread-slice' }
    ]
};

//PARA EL BACKEND
const ApiConfig = {
    mode: 'mock', // Cambiar a 'real' cuando tengas Spring Boot
    baseURL: 'http://localhost:8080/api',
    endpoints: {
        products: '/productos',
        categories: '/categorias',
        search: '/productos/buscar',
        productById: '/productos/',
        addToCart: '/carrito/agregar',
        cart: '/carrito',
        auth: {
            login: '/auth/login',
            register: '/auth/registro',
            logout: '/auth/logout'
        }
    },
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Exponer globalmente
window.MockData = MockData;
window.ApiConfig = ApiConfig;