# 🛍️ Minimarket La Parada - Frontend

> Sistema de E-commerce para el Minimarket La Parada desarrollado con HTML5, CSS3 y JavaScript.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white(https://developer.mozilla
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo(https://developer.mozilla
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logo(https://developer.mozilla.org/en-US/docs/Web/JavaScripthttps://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor(https://getbootstrap.com de Contenidos
- [🌟 Características](#-características)
- [🏗️ Estructura del Proyecto](#️-estructura-del-proyecto)
- [🚀 Instalación y Uso](#-instalación-y-uso)
- [📱 Páginas Implementadas](#-páginas-implementadas)
- [🎨 Tecnologías](#-tecnologías)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [📱 Responsive Design](#-responsive-design)
- [🔧 Configuración](#-configuración)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [📄 Licencia](#-licencia)

## 🌟 Características
- E-commerce con carrito de compras funcional.
- Diseño responsive optimizado para móviles y desktop.
- Autenticación en frontend con roles (usuario/administrador) usando almacenamiento local.
- Gestión de productos por categorías, búsqueda y filtrado.
- Checkout con validación de formularios.
- Panel administrativo con accesos y estadísticas simuladas.
- Código modular, escalable y con datos mock de productos/usuarios.

## 🏗️ Estructura del Proyecto
```
frontend/
├── pages/
│   ├── products/
│   │   ├── catalog.html
│   │   ├── categories.html
│   │   └── detail.html
│   ├── cart/
│   │   └── cart.html
│   ├── checkout/
│   │   └── checkout.html
│   ├── auth/
│   │   └── login.html
│   ├── admin/
│   │   └── dashboard.html
│   ├── about.html
│   └── contact.html
├── css/
│   ├── style.css
│   ├── catalog.css
│   ├── cart.css
│   ├── checkout.css
│   └── admin-dashboard.css
├── js/
│   ├── modules/
│   │   ├── products.js
│   │   ├── catalog.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── auth.js
│   │   └── admin-dashboard.js
│   ├── app.js
│   └── mock-data.js
├── assets/
│   └── images/
│       ├── LaParadaLogo.jpg
│       └── favicon.ico
└── index.html
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador moderno (Chrome, Firefox, Edge, Safari).
- Editor de código (VS Code recomendado).
- Opción de servidor local (Live Server, http-server, o Python).

### Pasos
```bash
# 1) Clonar o descargar
git clone https://github.com/usuario/minimarket-la-parada.git
cd minimarket-la-parada

# 2) Servir en local (elige una opción):

# Opción A: Live Server (VS Code)
# - Abrir el proyecto en VS Code
# - Click derecho en index.html > Open with Live Server

# Opción B: Python
python -m http.server 3000

# Opción C: Node http-server
npx http-server -p 3000

# 3) Abrir en el navegador
http://localhost:3000/frontend/
```

### Credenciales de prueba (mock)
```
Usuario:
email: user@laparada.com
password: user123

Administrador:
email: admin@laparada.com
password: admin123
```

## 📱 Páginas Implementadas
| Página | Archivo | Descripción |
|---|---|---|
| Inicio | `index.html` | Landing con destacados y accesos rápidos. |
| Catálogo | `pages/products/catalog.html` | Grid de productos, filtros y búsqueda. |
| Categorías | `pages/products/categories.html` | Navegación por categorías. |
| Detalle | `pages/products/detail.html` | Página de detalle con galería, precio y stock. |
| Carrito | `pages/cart/cart.html` | Tabla de compras con cantidades, eliminar y total. |
| Checkout | `pages/checkout/checkout.html` | Formulario de facturación y envío, validación. |
| Login | `pages/auth/login.html` | Autenticación mock con roles. |
| Admin | `pages/admin/dashboard.html` | Panel con accesos a módulos (simulados). |
| Nosotros | `pages/about.html` | Información institucional. |
| Contacto | `pages/contact.html` | Formulario de contacto básico. |

## 🎨 Tecnologías
- HTML5, CSS3, JavaScript ES6+.
- Bootstrap 5.3, Font Awesome 6.4, Google Fonts (Poppins).
- LocalStorage para persistencia de carrito y sesión.
- Arquitectura modular de JS orientada a componentes.

## ⚙️ Funcionalidades

### E-commerce
- Catálogo con filtros, orden y búsqueda.
- Vista rápida y detalle de producto.
- Carrito con +/- cantidad, eliminar, vaciar y total dinámico.
- Cálculo de envío y cupones (simulados).
- Recomendaciones basadas en categorías del carrito.

### Usuarios y Acceso
- Login mock con roles (usuario/admin).
- Redirección según permisos.
- Persistencia de sesión en localStorage.

### Checkout
- Formulario de facturación y envío con validación en tiempo real.
- Métodos de pago simulados (UI/UX lista para integrar).
- Resumen de pedido y totales dinámicos.

### Panel Admin
- Acceso restringido.
- Accesos a agregar producto, ver stock, eliminar y gestión de pagos (en demo UI).
- Estadísticas simuladas (productos, pedidos, usuarios, ingresos).

## 📱 Responsive Design
- Mobile-first, grillas fluidas y componentes adaptativos.
- Breakpoints optimizados para 320px, 768px y 1024px+.
- Botones táctiles y navegación accesible en móvil.

## 🔧 Configuración

### Variables CSS (tema)
```css
:root{
  --primary-green:#8BC34A; --primary-green-light:#9CCC65; --primary-green-dark:#689F38;
  --warning-yellow:#FFC107; --text-dark:#212529; --text-light:#6c757d;
  --gray-100:#f8f9fa; --gray-200:#e9ecef;
  --shadow-sm:0 0.125rem 0.25rem rgba(0,0,0,.075);
  --shadow-md:0 0.5rem 1rem rgba(0,0,0,.15);
  --radius-md:.5rem; --radius-lg:1rem;
  --transition-fast:.15s ease-in-out; --transition-normal:.3s ease-in-out;
}
```

### Datos Mock
```js
// js/mock-data.js
const ApiConfig = {
  mode: 'mock',
  endpoints: { products:'/productos', categories:'/categorias', cart:'/carrito', auth:'/auth' }
};
```

## 👥 Equipo de Desarrollo
- Jheremy James Panizo De Tomas — Líder y arquitectura
- Liberato Robin Illia Menacho Perez — UI/UX y estilos
- Jose Antonio Beraun Ramos — Lógica JS y catálogo
- Misael Fernando Challco — Componentes y módulos
- Luis Huayllacayan Zuta — Integración y testing

Universidad Tecnológica del Perú (UTP) · Ingeniería de Sistemas e Informática · 2025

## 📄 Licencia
<<<<<<< HEAD

Este proyecto está desarrollado como **proyecto académico** para la Universidad Tecnológica del Perú (UTP). 

**Uso Educativo:** Permitido para fines académicos y de aprendizaje.  
**Uso Comercial:** Requiere autorización del equipo de desarrollo.

***
=======
Proyecto académico para fines educativos.  
Uso educativo permitido; uso comercial requiere autorización del equipo.
>>>>>>> f5c1c897942cb4fcc137b323bc912f695defdf3a
