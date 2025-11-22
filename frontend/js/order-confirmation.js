// ===== ORDER CONFIRMATION =====
const orderData = JSON.parse(sessionStorage.getItem("lastOrder"));

// 1️⃣ Bloquear acceso si no hay pedido
if (!orderData) {
    window.location.href = "../products/catalog.html";
}

// 2️⃣ Elementos del DOM
const orderIdEl = document.getElementById("orderId");
const orderTotalEl = document.getElementById("orderTotal");
const orderProductsEl = document.getElementById("orderProducts");

// 3️⃣ Mostrar ID y total
orderIdEl.textContent = `#${orderData.id}`;
orderTotalEl.textContent = `S/. ${orderData.total.toFixed(2)}`;

// 4️⃣ Mostrar productos
orderProductsEl.innerHTML = "";
orderData.items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${item.producto?.nombre || 'Producto'}</td>
        <td>${item.cantidad}</td>
        <td>S/. ${item.precio.toFixed(2)}</td>
        <td>S/. ${(item.precio*item.cantidad).toFixed(2)}</td>
    `;
    orderProductsEl.appendChild(tr);
});

// 5️⃣ Vaciar carrito
localStorage.removeItem("lp_cart");