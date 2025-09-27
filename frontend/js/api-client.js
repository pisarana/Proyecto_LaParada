// ===== API CLIENT - MINIMARKET LA PARADA =====
class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('lp_auth_token');
    }

    // Headers con autenticación
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }
    // Request genérico
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(options.auth !== false),
            ...options
        };

        console.log(`📡 API Request: ${config.method || 'GET'} ${url}`);
        if (config.body) {
            console.log('📄 Request body:', JSON.parse(config.body));
        }

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                // Leer el error del backend
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                try {
                    const errorData = await response.json();
                    console.error('❌ Backend error details:', errorData);

                    if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    } else if (errorData.errors && errorData.errors.length > 0) {
                        errorMessage = errorData.errors.join(', ');
                    }
                } catch (e) {
                    console.error('❌ Could not parse error response');
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('✅ API Success:', data);
            return data;

        } catch (error) {
            console.error('❌ API Error:', error);
            throw error;
        }
    }


    // ===== AUTH ENDPOINTS =====
    async login(email, password) {
        console.log('🔐 Attempting login for:', email);

        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            auth: false
        });

        // Guardar token y usuario
        this.token = response.token;
        localStorage.setItem('lp_auth_token', response.token);
        localStorage.setItem('lp_user', JSON.stringify(response.user));

        console.log('✅ Login successful for:', response.user.nombre);
        return response;
    }

    async register(userData) {
        console.log('📝 Registering user:', userData.email);

        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            auth: false
        });

        console.log('✅ Registration successful');
        return response;
    }

    // ===== USER MANAGEMENT =====
    getUser() {
        const userStr = localStorage.getItem('lp_user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn() {
        return !!this.token && !!this.getUser();
    }

    logout() {
        console.log('🚪 Logging out user');
        this.token = null;
        localStorage.removeItem('lp_auth_token');
        localStorage.removeItem('lp_user');
    }

    // ===== PRODUCTS ENDPOINTS =====
    async getProducts() {
        console.log('🛍️ Fetching all products...');
        return await this.request('/products/all', { auth: false });
    }

    async getFeaturedProducts() {
        console.log('⭐ Fetching featured products...');
        return await this.request('/products/featured', { auth: false });
    }

    async getProductById(id) {
        console.log(`🔍 Fetching product ${id}...`);
        return await this.request(`/products/${id}`, { auth: false });
    }

    async getProductsByCategory(category) {
        console.log(`📂 Fetching products by category: ${category}...`);
        return await this.request(`/products/category/${category}`, { auth: false });
    }
    // ===== ORDERS ENDPOINTS =====
    async createOrder(orderData) {
        console.log('🛒 Creating order:', orderData);
        return await this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
            auth: true
        });
    }

    async getUserOrders() {
        console.log('📦 Getting user orders...');
        return await this.request('/orders/user', { auth: true });
    }

    async getOrderById(id) {
        console.log(`📋 Getting order ${id}...`);
        return await this.request(`/orders/${id}`, { auth: true });
    }


}

// Global instance
window.API = new ApiClient();
console.log('🔌 API Client initialized');
