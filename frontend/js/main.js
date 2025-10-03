// ===== MAIN APPLICATION INITIALIZER =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 La Parada System Starting...');
    console.log('📍 Current page:', window.location.pathname);

    // Check existing session
    const user = API.getUser();
    if (user) {
        console.log('👤 Existing session found for:', user.nombre);
    } else {
        console.log('🚪 No active session');
    }

    // Initialize authentication system
    AUTH.init();

    // Check admin access
    const currentPath = window.location.pathname;
    if (currentPath.includes('admin') && (!user || user.rol !== 'ADMINISTRADOR')) {
        console.log('❌ Unauthorized access to admin area');
        alert('Acceso denegado. Debes ser administrador.');
        window.location.href = '/frontend/pages/auth/login.html';
        return;
    }

    console.log('✅ Session management initialized');

    // ✅ FORZAR INICIALIZACIÓN DE PRODUCTOS
    console.log('🛍️ Initializing Products Manager...');
    if (window.PRODUCTS) {
        PRODUCTS.init();
    } else {
        console.error('❌ PRODUCTS not found!');
    }
    // En main.js, después de PRODUCTS.init(), agregar:
    console.log('🛒 Initializing Cart Manager...');
    if (window.CART) {
        CART.init();
    } else {
        console.error('❌ CART not found!');
    }
    console.log('🎯 Ready for next phase');
    // En main.js, después de CART.init(), agregar:
    console.log('💳 Initializing Checkout Manager...');
    if (window.CHECKOUT) {
        CHECKOUT.init();
    } else {
        console.error('❌ CHECKOUT not found!');
    }

});
