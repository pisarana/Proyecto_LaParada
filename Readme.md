# 🛍️ Minimarket La Parada - Sistema E-commerce Completo

> Sistema de E-commerce completo (Frontend + Backend) para el Minimarket La Parada desarrollado con tecnologías modernas.


## 📋 Tabla de Contenidos
- [🌟 Características](#-características)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [📱 Frontend](#-frontend)
- [🔧 Backend APIs](#-backend-apis)
- [🎨 Tecnologías](#-tecnologías)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [🔐 Autenticación y Seguridad](#-autenticación-y-seguridad)
- [📊 Base de Datos](#-base-de-datos)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [📄 Licencia](#-licencia)

## 🌟 Características

### Frontend
- E-commerce responsive con carrito de compras funcional
- Diseño mobile-first optimizado para todos los dispositivos
- Interfaz de usuario moderna con Bootstrap 5
- Gestión de productos por categorías, búsqueda y filtrado
- Checkout completo con validación de formularios
- Panel administrativo con estadísticas y gestión

### Backend
- API REST completa con 14 endpoints funcionales
- Autenticación JWT con encriptación BCrypt
- Control de acceso basado en roles (CLIENTE/ADMINISTRADOR)
- Base de datos H2 con datos de prueba
- Arquitectura modular con Spring Boot
- Documentación completa de APIs

## 🏗️ Arquitectura del Sistema

```
minimarket-la-parada/
├── frontend/
│   ├── pages/           # Páginas HTML
│   ├── css/             # Estilos CSS
│   ├── js/              # Lógica JavaScript
│   └── assets/          # Recursos estáticos
├── backend/
│   ├── src/main/java/com/laparada/
│   │   ├── controller/  # Controladores REST
│   │   ├── service/     # Lógica de negocio
│   │   ├── repository/  # Acceso a datos
│   │   ├── entity/      # Entidades JPA
│   │   ├── dto/         # Data Transfer Objects
│   │   ├── security/    # Seguridad y JWT
│   │   └── config/      # Configuraciones
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql     # Datos de prueba
```

## 🚀 Instalación y Configuración

### Requisitos
- Java 17+
- Maven 3.6+
- Node.js 14+ (para servidor de desarrollo del frontend)
- Navegador moderno

### Backend
```bash
# 1. Clonar repositorio
git clone https://github.com/usuario/minimarket-la-parada.git
cd minimarket-la-parada/backend

# 2. Ejecutar backend
./mvnw spring-boot:run

# Backend corriendo en: http://localhost:8080
```

### Frontend
```bash
# 1. Navegar al frontend
cd ../frontend

# 2. Servir archivos estáticos (elige una opción):
# Opción A: Live Server (VS Code)
# Opción B: Python
python -m http.server 3000

# Opción C: Node.js
npx http-server -p 3000

# Frontend accesible en: http://localhost:3000
```

### Credenciales de Prueba
```
Administrador:
email: admin@laparada.com
password: admin123

Cliente:
email: misaelchallco0@gmail.com
password: password123
```

## 📱 Frontend

### Páginas Implementadas
| Página | Archivo | Descripción |
|---|---|---|
| Inicio | `index.html` | Landing con destacados y accesos rápidos |
| Catálogo | `pages/products/catalog.html` | Grid de productos con filtros |
| Carrito | `pages/cart/cart.html` | Gestión de compras con totales |
| Checkout | `pages/checkout/checkout.html` | Formulario de facturación |
| Login | `pages/auth/login.html` | Autenticación con JWT |
| Admin Panel | `pages/admin/dashboard.html` | Panel administrativo |
| Nosotros | `pages/about.html` | Información corporativa |
| Contacto | `pages/contact.html` | Formulario de contacto |

## 🔧 Backend APIs

### APIs Funcionales (14 endpoints)

| **CATEGORÍA** | **ENDPOINT** | **MÉTODO** | **FUNCIÓN** | **STATUS** |
|---------------|--------------|------------|-------------|------------|
| AUTHENTICATION | /api/auth/login | POST | Login con JWT | ACTIVO |
| AUTHENTICATION | /api/auth/register | POST | Registro de usuarios | ACTIVO |
| AUTHENTICATION | /api/auth/validate | GET | Validar token JWT | ACTIVO |
| PRODUCTS | /api/products | GET | Listar productos (paginado) | ACTIVO |
| PRODUCTS | /api/products/all | GET | Todos los productos | ACTIVO |
| PRODUCTS | /api/products/featured | GET | Productos destacados | ACTIVO |
| PRODUCTS | /api/products/{id} | GET | Producto por ID | ACTIVO |
| PRODUCTS | /api/products/category/{cat} | GET | Productos por categoría | ACTIVO |
| PRODUCTS | /api/products | POST | Crear producto | ACTIVO |
| USERS | /api/users | GET | Listar usuarios | REQUIERE JWT |
| USERS | /api/users/{id} | GET | Usuario por ID | REQUIERE JWT |
| USERS | /api/users/email/{email} | GET | Usuario por email | REQUIERE JWT |
| USERS | /api/users | POST | Crear usuario | REQUIERE JWT |
| DATABASE | /h2-console | GET | Consola H2 | ACTIVO |

## 🎨 Tecnologías

### Frontend
- **HTML5, CSS3, JavaScript ES6+**
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.4** - Iconografía
- **Google Fonts (Poppins)** - Tipografía
- **LocalStorage** - Persistencia del cliente

### Backend
- **Java 17** - Lenguaje principal
- **Spring Boot 3.5.6** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - ORM y acceso a datos
- **H2 Database** - Base de datos en memoria
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **BCrypt** - Encriptación de contraseñas
- **Maven** - Gestión de dependencias

## ⚙️ Funcionalidades

### E-commerce Completo
- **Catálogo de Productos**: Filtros, búsqueda, paginación
- **Carrito de Compras**: Agregar, modificar, eliminar productos
- **Checkout**: Formulario de facturación y métodos de pago
- **Gestión de Stock**: Control automático de inventario
- **Recomendaciones**: Productos sugeridos por categoría

### Sistema de Usuarios
- **Autenticación JWT**: Login/registro seguro
- **Roles de Usuario**: Cliente y Administrador
- **Persistencia de Sesión**: Tokens con expiración
- **Validación**: Formularios con validación en tiempo real

### Panel Administrativo
- **Gestión de Productos**: CRUD completo
- **Control de Inventario**: Monitoreo de stock
- **Estadísticas**: Resumen de ventas y usuarios
- **Reportes**: (En desarrollo)

## 🔐 Autenticación y Seguridad

### Implementación JWT
- Tokens firmados con HMAC SHA-256
- Expiración automática (24 horas)
- Refresh token automático
- Headers de autorización: `Bearer {token}`

### Roles y Permisos
- **CLIENTE**: Acceso a catálogo, carrito y perfil
- **ADMINISTRADOR**: Acceso completo al sistema
- **Endpoints Públicos**: Productos y autenticación
- **Endpoints Protegidos**: Usuarios y administración

## 📊 Base de Datos

### Configuración H2
- **URL**: `jdbc:h2:mem:laparadadb`
- **Usuario**: `sa`
- **Contraseña**: `password`
- **Consola**: `http://localhost:8080/h2-console`

### Entidades Principales
- **User**: Usuarios del sistema con roles
- **Product**: Catálogo de productos
- **Order**: Pedidos de clientes
- **OrderItem**: Items individuales de pedidos
- **Contact**: Formulario de contacto

### Datos de Prueba
- **6 productos** en diferentes categorías
- **2 usuarios** (admin y cliente)
- **Categorías**: bebidas, lácteos, panadería, carnes, abarrotes

## 📱 Responsive Design
- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: 320px, 768px, 1024px+
- **Grillas fluidas**: Layout adaptativo
- **Componentes táctiles**: UX optimizada para touch

## 👥 Equipo de Desarrollo

**Universidad Tecnológica del Perú (UTP)**  
**Ingeniería de Sistemas e Informática · 2025**

- **Jheremy James Panizo De Tomas** — Líder de proyecto y arquitectura
- **Liberato Robin Illia Menacho Perez** — UI/UX y diseño frontend  
- **Jose Antonio Beraun Ramos** — Lógica JavaScript y catálogo
- **Misael Fernando Challco** — Backend Spring Boot y APIs
- **Luis Huayllacayan Zuta** — Integración y testing

## 📄 Licencia

Este proyecto está desarrollado como **proyecto académico** para la Universidad Tecnológica del Perú (UTP).

**Uso Educativo:** Permitido para fines académicos y de aprendizaje  
**Uso Comercial:** Requiere autorización del equipo de desarrollo

***

**🚀 Sistema E-commerce Completo - Minimarket La Parada**  
*Frontend + Backend + JWT Authentication + 14 APIs Funcionales*
