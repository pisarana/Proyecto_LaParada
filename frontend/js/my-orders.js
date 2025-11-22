// ===== MY ORDERS =====
document.addEventListener('DOMContentLoaded', () => {
    if (!API.isLoggedIn()) {
        alert("Debes iniciar sesión para ver tus pedidos");
        window.location.href = "../auth/login.html";
        return;
    }

    const ordersContainer = document.getElementById("ordersContainer");

    // Obtener historial de pedidos del usuario (guardado en localStorage)
    const userId = API.getUser()?.id;
    let allOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");

    // Filtrar pedidos solo del usuario actual
    const userOrders = allOrders.filter(order => Number(order.usuario?.id) === Number(userId));

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `<p class="text-muted">No tienes pedidos todavía.</p>`;
        return;
    }

    // Render de cada pedido
    ordersContainer.innerHTML = userOrders.map(order => {
        const itemsHTML = (order.items || []).map(item => {
            const nombre = item.producto?.nombre ?? "Producto";
            const precio = Number(item.precio ?? 0);
            const cantidad = Number(item.cantidad ?? 0);
            return `
                <tr>
                    <td>${nombre}</td>
                    <td>${cantidad}</td>
                    <td>S/. ${precio.toFixed(2)}</td>
                    <td>S/. ${(precio * cantidad).toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span><strong>ID Pedido:</strong> ${order.id}</span>
                    <span><strong>Total:</strong> S/. ${Number(order.total).toFixed(2)}</span>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table mb-0">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHTML}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }).join('');
});