# 🛍️ Minimarket La Parada - Frontend

> **Sistema de E-commerce completo para el Minimarket La Parada desarrollado con HTML5, CSS3 y JavaScript puro.**

[![GitHub Pages](https://img.shields.io/badge/GitHub%https://github.com/usuarioimg.shields.io/badge/HTML5-E34F26?style=flat&logo=html5developer.mozilla.org/en-US/docsimg.shields.io/badge/CSS3-1572B6?style=flat&logo=css3developer.mozilla.org/en-https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logohttps://developer.mozilla.org/
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor 📋 Tabla de Contenidos

- [🌟 Características](#-características)
- [🖥️ Demo](#️-demo)
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

- ✅ **E-commerce completo** con carrito de compras funcional
- ✅ **Diseño responsive** optimizado para móviles y desktop
- ✅ **Sistema de autenticación** con roles (usuario/administrador)
- ✅ **Gestión de productos** por categorías
- ✅ **Búsqueda y filtrado** avanzado de productos
- ✅ **Carrito persistente** con localStorage
- ✅ **Checkout completo** con integración para pagos
- ✅ **Panel administrativo** para gestión de productos
- ✅ **Optimizado para GitHub Pages**
- ✅ **Preparado para backend** (Java Spring Boot)

## 🖥️ Demo

🌐 **[Ver Demo en Vivo](https://usuario.github.io/minimarket-la-parada/frontend/)**

### Credenciales de Prueba:

```
👤 Usuario Normal:
Email: user@laparada.com
Password: user123

🛡️ Administrador:
Email: admin@laparada.com
Password: admin123
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── 📁 pages/                    # Páginas HTML
│   ├── 📁 products/            # Catálogo y productos
│   │   ├── catalog.html        # Catálogo principal
│   │   ├── categories.html     # Página de categorías
│   │   └── detail.html         # Detalle de producto
│   ├── 📁 cart/               # Carrito de compras
│   │   └── cart.html          # Página del carrito
│   ├── 📁 checkout/           # Proceso de compra
│   │   └── checkout.html      # Detalles de facturación
│   ├── 📁 auth/               # Autenticación
│   │   └── login.html         # Página de login
│   ├── 📁 admin/              # Panel administrativo
│   │   └── dashboard.html     # Dashboard del admin
│   ├── about.html             # Página "Nosotros"
│   └── contact.html           # Página de contacto
├── 📁 css/                    # Hojas de estilo
│   ├── style.css              # Estilos principales
│   ├── catalog.css            # Estilos del catálogo
│   ├── cart.css               # Estilos del carrito
│   ├── checkout.css           # Estilos del checkout
│   └── admin-dashboard.css    # Estilos del panel admin
├── 📁 js/                     # JavaScript
│   ├── 📁 modules/            # Módulos JavaScript
│   │   ├── products.js        # Gestión de productos
│   │   ├── catalog.js         # Funcionalidad del catálogo
│   │   ├── cart.js            # Carrito de compras
│   │   ├── checkout.js        # Proceso de checkout
│   │   ├── auth.js            # Autenticación
│   │   └── admin-dashboard.js # Panel administrativo
│   ├── app.js                 # Aplicación principal
│   └── mock-data.js           # Datos de prueba
├── 📁 assets/                 # Recursos estáticos
│   └── 📁 images/             # Imágenes
│       ├── LaParadaLogo.jpg   # Logo principal
│       └── favicon.ico        # Icono del sitio
└── index.html                 # Página principal
```

## 🚀 Instalación y Uso

### 1. **Desarrollo Local**

```bash
# Clonar el repositorio
git clone https://github.com/usuario/minimarket-la-parada.git

# Navegar al directorio
cd minimarket-la-parada

# Abrir con Live Server (VS Code) o servidor local
# Ejemplo con Python:
python -m http.server 3000

# Acceder en el navegador:
http://localhost:3000/frontend/
```

### 2. **Despliegue en GitHub Pages**

```bash
# Subir cambios
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# Configurar GitHub Pages en el repositorio:
# Settings > Pages > Source: Deploy from branch > main
```

### 3. **Configuración de Rutas**

Para **GitHub Pages**, todas las rutas ya están configuradas con `/frontend/`:

```html
<!-- Configuración automática para GitHub Pages -->
<base href="/frontend/">
<link href="css/style.css" rel="stylesheet">
<a href="pages/auth/login.html">Login</a>
```

## 📱 Páginas Implementadas

| Página | Ruta | Descripción |
|--------|------|-------------|
| 🏠 **Inicio** | `/index.html` | Página principal con productos destacados |
| 🛍️ **Catálogo** | `/pages/products/catalog.html` | Catálogo completo con filtros |
| 📂 **Categorías** | `/pages/products/categories.html` | Navegación por categorías |
| 📦 **Producto** | `/pages/products/detail.html?id=X` | Detalle individual de producto |
| 🛒 **Carrito** | `/pages/cart/cart.html` | Carrito de compras |
| 💳 **Checkout** | `/pages/checkout/checkout.html` | Proceso de compra |
| 👤 **Login** | `/pages/auth/login.html` | Autenticación |
| ⚙️ **Admin** | `/pages/admin/dashboard.html` | Panel administrativo |
| ℹ️ **Nosotros** | `/pages/about.html` | Información de la empresa |
| 📞 **Contacto** | `/pages/contact.html` | Formulario de contacto |

## 🎨 Tecnologías

### **Frontend Core**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=htmlHTML5** - Estructura semántica
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logo - Estilos y animaciones
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript ES6+** - Funcionalidad dinámica

### **Frameworks y Librerías**
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap 5.3.2** - Framework CSS responsive
- ![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?style=flat&logo=fontawesome&logoColor 6.4.0** - Iconografía
- **Google Fonts (Poppins)** - Tipografía moderna

### **Herramientas de Desarrollo**
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor= versiones
- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor** - Hosting gratuito
- **VS Code** - Editor recomendado

## ⚙️ Funcionalidades

### 🛍️ **Sistema de E-commerce**
- **Catálogo de productos** con imágenes y descripciones
- **Sistema de categorías** (Bebidas, Lácteos, Carnes, etc.)
- **Búsqueda y filtrado** por nombre, categoría y precio
- **Vista rápida** de productos con modal
- **Carrito persistente** con localStorage
- **Cálculo automático** de totales y envío

### 👤 **Gestión de Usuarios**
- **Sistema de login** con roles diferenciados
- **Autenticación mock** para desarrollo
- **Sesiones persistentes** con localStorage
- **Redirección automática** según rol de usuario

### 💳 **Proceso de Compra**
- **Checkout completo** con validación de formularios
- **Múltiples métodos de pago** (Tarjeta, PayPal)
- **Validación de campos** en tiempo real
- **Preparado para APIs** de pago (Stripe, PayPal)
- **Cálculo de impuestos** y costos de envío

### 🛡️ **Panel Administrativo**
- **Dashboard de estadísticas** del negocio
- **Gestión de productos** (Agregar, Ver, Eliminar)
- **Control de inventario** y stock
- **Gestión de pagos** y pedidos
- **Acceso restringido** solo para administradores

### 📱 **Experiencia de Usuario**
- **Diseño responsive** para todos los dispositivos
- **Navegación intuitiva** con breadcrumbs
- **Animaciones suaves** y transiciones
- **Feedback visual** con notificaciones
- **Optimización SEO** con meta tags dinámicos

## 📱 Responsive Design

El proyecto está **completamente optimizado** para diferentes dispositivos:

### 📱 **Mobile First** (320px - 767px)
- Navegación colapsable
- Cards apiladas verticalmente
- Botones táctiles optimizados
- Imágenes responsivas

### 💻 **Tablet** (768px - 1023px)
- Layout de 2 columnas
- Menú horizontal
- Tarjetas en grid flexible

### 🖥️ **Desktop** (1024px+)
- Layout completo de 3-4 columnas
- Sidebar fijo en páginas de catálogo
- Hover effects avanzados
- Navegación completa visible

## 🔧 Configuración

### **Variables CSS Personalizables**

```css
:root {
    --primary-green: #8BC34A;
    --primary-green-light: #9CCC65;
    --primary-green-dark: #689F38;
    --warning-yellow: #FFC107;
    --text-dark: #212529;
    --text-light: #6c757d;
    --gray-100: #f8f9fa;
    --gray-200: #e9ecef;
    --shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    --shadow-md: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    --radius-md: 0.5rem;
    --radius-lg: 1rem;
    --transition-fast: 0.15s ease-in-out;
    --transition-normal: 0.3s ease-in-out;
}
```

### **Configuración de API**

```javascript
// js/mock-data.js
const ApiConfig = {
    mode: 'mock', // Cambiar a 'real' para backend
    baseURL: 'http://localhost:8080/api',
    endpoints: {
        products: '/productos',
        categories: '/categorias',
        cart: '/carrito',
        auth: '/auth'
    }
};
```

### **Datos Mock Incluidos**

- **15 productos** de ejemplo con todas las categorías
- **6 categorías** predefinidas (Bebidas, Lácteos, etc.)
- **Sistema de usuarios** con roles
- **Datos de prueba** para carrito y checkout

## 🌟 Características Avanzadas

### **Optimizaciones**
- ⚡ **Lazy loading** de imágenes
- 🗜️ **Código minificado** y optimizado
- 📦 **Módulos JavaScript** organizados
- 🎨 **CSS custom properties** para temas
- 🔄 **Sincronización** automática del carrito

### **Compatibilidad**
- ✅ **Navegadores modernos** (Chrome, Firefox, Safari, Edge)
- ✅ **Dispositivos móviles** (iOS, Android)
- ✅ **Accesibilidad** básica (ARIA labels, contraste)
- ✅ **PWA ready** (preparado para Service Workers)

### **Preparado para Integración**
- 🔌 **APIs REST** definidas y documentadas
- 🗄️ **Base de datos** esquematizada
- 🔐 **Autenticación JWT** preparada
- 💳 **Pasarelas de pago** configurables

## 👥 Equipo de Desarrollo

### **Desarrolladores Frontend**
- **Jheremy James Panizo De Tomas** - *Líder del Proyecto*
- **Liberato Robin Illia Menacho Perez** - *Desarrollador UI/UX*
- **Jose Antonio Beraun Ramos** - *Desarrollador JavaScript*
- **Misael Fernando Challco** - *Desarrollador de Componentes*
- **Luis Huayllacayan Zuta** - *Desarrollador de Integración*

### **Universidad**
🏫 **Universidad Tecnológica del Perú (UTP)**  
📚 **Carrera:** Ingeniería de Sistemas e Informática  
📅 **Año:** 2025

## 🎯 Próximas Mejoras

- [ ] **Backend Spring Boot** completo
- [ ] **Base de datos MySQL** integrada
- [ ] **Sistema de reviews** de productos
- [ ] **Chat en vivo** con soporte
- [ ] **Notificaciones push**
- [ ] **Modo oscuro** opcional
- [ ] **Multi-idioma** (Español/Inglés)
- [ ] **PWA completa** con offline support

## 📞 Contacto

### **Minimarket La Parada**
📍 **Dirección:** La Victoria - Lima - Lima  
📞 **Teléfono:** (01) 7134160  
📧 **Email:** marketing@corpdevalle.com.pe  
🕒 **Horarios:** Lun-Vie 7:00-22:00, Sáb 7:00-23:00  

### **Soporte Técnico**
💬 **Issues:** [GitHub Issues](https://github.com/usuario/minimarket-la-parada/issues)  
📧 **Email:** equipo.utp@gmail.com  

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

***
