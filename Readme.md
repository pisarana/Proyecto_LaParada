# 🛍️ Minimarket La Parada - Frontend

> **Sistema de E-commerce completo para el Minimarket La Parada desarrollado con HTML5, CSS3 y JavaScript puro.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5developer.mozilla.org/en-US/docsimg.shields.io/badge/CSS3-1572B6?style=flat&logo=css3developer.mozilla.org/en-https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logo.mozilla.org/en-US/docs/Web://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap& 📋 Tabla de Contenidos

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

- ✅ **E-commerce completo** con carrito de compras funcional
- ✅ **Diseño responsive** optimizado para móviles y desktop
- ✅ **Sistema de autenticación** con roles (usuario/administrador)
- ✅ **Gestión de productos** por categorías
- ✅ **Búsqueda y filtrado** avanzado de productos
- ✅ **Carrito persistente** con localStorage
- ✅ **Checkout completo** con validación de formularios
- ✅ **Panel administrativo** para gestión de productos
- ✅ **Código modular** y escalable
- ✅ **Datos mock** incluidos para desarrollo

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

### **Desarrollo Local**

```bash
# Clonar o descargar el repositorio
git clone https://github.com/usuario/minimarket-la-parada.git

# Navegar al directorio
cd minimarket-la-parada

# Opción 1: Usar Live Server (VS Code)
# - Instalar extensión "Live Server"
# - Click derecho en index.html > "Open with Live Server"

# Opción 2: Servidor local con Python
python -m http.server 3000

# Opción 3: Servidor local con Node.js
npx http-server -p 3000

# Acceder en el navegador:
http://localhost:3000/frontend/
```

### **Requisitos**

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Extensión Live Server (opcional pero recomendada)

### **Credenciales de Prueba**

```
👤 Usuario Normal:
Email: user@laparada.com
Password: user123

🛡️ Administrador:
Email: admin@laparada.com
Password: admin123
```

## 📱 Páginas Implementadas

| Página | Archivo | Descripción |
|--------|---------|-------------|
| 🏠 **Inicio** | `index.html` | Página principal con productos destacados |
| 🛍️ **Catálogo** | `pages/products/catalog.html` | Catálogo completo con filtros |
| 📂 **Categorías** | `pages/products/categories.html` | Navegación por categorías |
| 📦 **Producto** | `pages/products/detail.html` | Detalle individual de producto |
| 🛒 **Carrito** | `pages/cart/cart.html` | Carrito de compras |
| 💳 **Checkout** | `pages/checkout/checkout.html` | Proceso de compra |
| 👤 **Login** | `pages/auth/login.html` | Autenticación |
| ⚙️ **Admin** | `pages/admin/dashboard.html` | Panel administrativo |
| ℹ️ **Nosotros** | `pages/about.html` | Información de la empresa |
| 📞 **Contacto** | `pages/contact.html` | Formulario de contacto |

## 🎨 Tecnologías

### **Frontend Core**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html - Estructura semántica
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=whitetilos y animaciones
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&6+** - Funcionalidad dinámica

### **Frameworks y Librerías**
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logo 5.3.2** - Framework CSS responsive
- ![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?style=flat&logo=fontawesome&logoColor 6.4.0** - Iconografía
- **Google Fonts (Poppins)** - Tipografía moderna

### **Herramientas de Desarrollo**
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git& - Control de versiones
- **VS Code** - Editor recomendado con extensiones
- **Live Server** - Servidor de desarrollo en tiempo real

## ⚙️ Funcionalidades

### 🛍️ **Sistema de E-commerce**
- **Catálogo de productos** con imágenes y descripciones detalladas
- **Sistema de categorías** (Bebidas, Lácteos, Carnes, Snacks, Limpieza, Cuidado Personal)
- **Búsqueda y filtrado** por nombre, categoría, precio y disponibilidad
- **Vista rápida** de productos con modal interactivo
- **Carrito persistente** con localStorage y sincronización automática
- **Cálculo automático** de totales, impuestos y costos de envío

### 👤 **Gestión de Usuarios**
- **Sistema de autenticación** con validación de formularios
- **Roles diferenciados** (usuario normal y administrador)
- **Sesiones persistentes** con localStorage
- **Redirección automática** según permisos de usuario
- **Validación de campos** en tiempo real

### 💳 **Proceso de Compra**
- **Checkout completo** con formulario de facturación
- **Validación de datos** de cliente y envío
- **Simulación de métodos de pago** (Tarjeta, PayPal)
- **Cálculo dinámico** de totales y descuentos
- **Sistema de cupones** funcional

### 🛡️ **Panel Administrativo**
- **Dashboard con estadísticas** del negocio
- **Gestión de productos** (Agregar, Ver stock, Eliminar)
- **Control de inventario** y disponibilidad
- **Gestión de pedidos** y transacciones
- **Acceso restringido** con autenticación obligatoria

### 📱 **Experiencia de Usuario**
- **Diseño responsive** para todos los dispositivos
- **Navegación intuitiva** con breadcrumbs y menús
- **Animaciones CSS** suaves y modernas
- **Notificaciones** de feedback visual
- **Optimización de carga** de imágenes

## 📱 Responsive Design

### 📱 **Mobile (320px - 767px)**
- Navegación hamburguesa colapsable
- Cards de productos apiladas
- Botones optimizados para touch
- Imágenes adaptables

### 💻 **Tablet (768px - 1023px)**
- Layout de 2 columnas
- Menú horizontal desplegable
- Grid flexible de productos

### 🖥️ **Desktop (1024px+)**
- Layout completo de 3-4 columnas
- Sidebar fijo en catálogo
- Hover effects y transiciones
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

### **Configuración de Datos Mock**

```javascript
// js/mock-data.js
const ApiConfig = {
    mode: 'mock', // Modo de desarrollo con datos simulados
    endpoints: {
        products: '/productos',
        categories: '/categorias',
        cart: '/carrito',
        auth: '/auth'
    }
};
```

### **Datos Incluidos para Desarrollo**

- **15 productos** de ejemplo con todas las categorías
- **6 categorías** predefinidas con iconos
- **Sistema de usuarios** con roles diferenciados
- **Datos de prueba** para carrito y checkout
- **Imágenes placeholder** para productos

## 🌟 Características Técnicas

### **Optimizaciones**
- ⚡ **Carga lazy** de imágenes de productos
- 📦 **Módulos JavaScript** organizados y reutilizables
- 🎨 **CSS custom properties** para personalización
- 🔄 **Sincronización automática** del estado del carrito
- 💾 **Persistencia local** de datos de usuario

### **Compatibilidad**
- ✅ **Navegadores modernos** (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- ✅ **Dispositivos móviles** (iOS 12+, Android 8+)
- ✅ **Accesibilidad básica** (ARIA labels, navegación por teclado)
- ✅ **SEO optimizado** con meta tags dinámicos

### **Estructura Modular**
- 🧩 **Componentes reutilizables** en JavaScript
- 📁 **Separación de responsabilidades** por módulos
- 🔧 **Fácil mantenimiento** y escalabilidad
- 🎯 **Código limpio** y bien documentado

## 👥 Equipo de Desarrollo

### **Desarrolladores Frontend**
- **Jheremy James Panizo De Tomas** - *Líder del Proyecto y Arquitectura*
- **Liberato Robin Illia Menacho Perez** - *Desarrollador UI/UX y Diseño*
- **Jose Antonio Beraun Ramos** - *Desarrollador JavaScript y Funcionalidades*
- **Misael Fernando Challco** - *Desarrollador de Componentes y Módulos*
- **Luis Huayllacayan Zuta** - *Desarrollador de Integración y Testing*

### **Institución Académica**
🏫 **Universidad Tecnológica del Perú (UTP)**  
📚 **Carrera:** Ingeniería de Sistemas e Informática  
📅 **Año Académico:** 2025  
📖 **Curso:** Desarrollo Web Frontend  

## 🎯 Próximas Funcionalidades

- [ ] **Sistema de reviews** y calificaciones de productos
- [ ] **Lista de favoritos** para usuarios registrados
- [ ] **Comparador de productos** lado a lado
- [ ] **Chat en vivo** con soporte al cliente
- [ ] **Notificaciones push** para ofertas especiales
- [ ] **Modo oscuro** como opción de tema
- [ ] **Multi-idioma** (Español/Inglés)
- [ ] **PWA completa** con funcionalidad offline

## 📞 Contacto y Soporte

### **Minimarket La Parada**
📍 **Dirección:** La Victoria - Lima - Lima  
📞 **Teléfono:** (01) 7134160  
📧 **Email:** marketing@corpdevalle.com.pe  
🕒 **Horarios:** Lun-Vie 7:00-22:00, Sáb 7:00-23:00  

### **Equipo de Desarrollo**
📧 **Email:** equipo.utp@gmail.com  
🎓 **Universidad:** Universidad Tecnológica del Perú  

## 📄 Licencia

Este proyecto está desarrollado como **proyecto académico** para la Universidad Tecnológica del Perú (UTP). 

**Uso Educativo:** Permitido para fines académicos y de aprendizaje.  
**Uso Comercial:** Requiere autorización del equipo de desarrollo.

***

### 🌟 **¿Te gusta el proyecto?**

Si este proyecto te ha sido útil para aprender desarrollo frontend:
- ⭐ **Compártelo** con otros estudiantes
- 🐛 **Reporta errores** para mejorarlo
- 💡 **Sugiere mejoras** o nuevas funcionalidades
- 📚 **Úsalo como referencia** en tus propios proyectos

***

**Desarrollado con ❤️ por el Equipo UTP - Ingeniería de Sistemas 2025**

[1](https://github.com/topics/ecommerce-frontend)
[2](https://github.com/Drako01/e-commerce-market)
[3](https://github.com/CodeSystem2022/Ecommerce-GonzaloQuiroga)
[4](https://www.youtube.com/watch?v=8TpHvDR_PXQ)
[5](https://github.com/Gonzadeveloper/Proyecto-E-Commerce)
[6](https://www.youtube.com/watch?v=RiB4mV3VnRY)
[7](https://www.youtube.com/watch?v=nlDDOOLnDZw)
[8](https://github.com/CodeSystem2022/e-commerce-los-borbocoders)
[9](https://www.youtube.com/watch?v=adK1luWFx6o)
[10](https://github.com/pabloencina/e-commerce-react)