# 🛒 Minimarket La Parada - Sistema Web

> **Desarrollo e implementación de una página web para el minimarket La Parada**

Sistema de comercio electrónico completo que moderniza los procesos de venta del minimarket La Parada, permitiendo a los clientes realizar compras online de manera rápida, segura y eficiente.

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Características Principales](#-características-principales)
3. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Instalación y Configuración](#-instalación-y-configuración)
6. [Uso](#-uso)
7. [Equipo de Desarrollo](#-equipo-de-desarrollo)
8. [Cronograma](#-cronograma)
9. [Contribución](#-contribución)
10. [Licencia](#-licencia)

---

## 🎯 Descripción del Proyecto

El minimarket La Parada enfrenta desafíos competitivos por la ausencia de presencia digital. Este proyecto desarrolla una **plataforma web dinámica** que:

- Mejora la experiencia de compra de los clientes
- Optimiza los procesos de venta
- Incrementa la competitividad en el mercado digital
- Moderniza la gestión de inventario

### Estado del Proyecto
🚧 **En Desarrollo** - Fase de implementación activa

---

## ✨ Características Principales

### Para Clientes
- ✅ **Registro e inicio de sesión** seguro
- ✅ **Catálogo digital** organizado por categorías  
- ✅ **Sistema de búsqueda** con filtros avanzados
- ✅ **Carrito de compras** funcional
- ✅ **Procesamiento de pedidos** online
- ✅ **Notificaciones** de compra automáticas
- ✅ **Formulario de contacto** integrado

### Para Administradores
- ✅ **Panel de administración** completo
- ✅ **Gestión de productos** (CRUD)
- ✅ **Control de inventario**
- ✅ **Gestión de pedidos**

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsivo
- **JavaScript ES6+** - Funcionalidad interactiva
- **Bootstrap 5** - Framework de diseño

### Backend  
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.x** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos

### Base de Datos
- **MySQL 8.0** - Sistema de gestión de base de datos

### Herramientas de Desarrollo
- **Maven** - Gestión de dependencias
- **Docker** - Contenedorización
- **Git** - Control de versiones

---

## 📁 Estructura del Proyecto

```
minimarket-la-parada/
├── 📁 backend/           # API REST con Spring Boot
├── 📁 frontend/          # Interfaz web del usuario
├── 📁 database/          # Scripts SQL y migraciones
├── 📁 docs/              # Documentación del proyecto
├── 📁 deployment/        # Configuración de despliegue
├── 📁 testing/           # Datos de prueba y testing
├── 📄 README.md          # Este archivo
├── 📄 .gitignore         # Archivos ignorados por Git
└── 📄 docker-compose.yml # Configuración de contenedores
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Java 17 o superior
- Node.js 16 o superior
- MySQL 8.0
- Git
- Docker (opcional)

### Configuración Local

1. **Clonar el repositorio**
```
git clone https://github.com/tu-usuario/minimarket-la-parada.git
cd minimarket-la-parada
```

2. **Configurar Base de Datos**
```
# Ejecutar scripts de la base de datos
mysql -u root -p < database/scripts/01_create_database.sql
mysql -u root -p < database/scripts/02_create_tables.sql
```

3. **Configurar Backend**
```
cd backend
# Configurar application.properties con tus credenciales de BD
mvn clean install
mvn spring-boot:run
```

4. **Configurar Frontend**
```
cd frontend
# Abrir index.html en tu navegador
# O usar un servidor local como Live Server
```

### Usando Docker (Recomendado)
```
docker-compose up -d
```

---

## 💻 Uso

### Acceso al Sistema
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Base de Datos**: localhost:3306

### Credenciales de Prueba
- **Admin**: admin@laparada.com / admin123
- **Usuario**: cliente@test.com / cliente123

### Endpoints Principales
```
GET  /api/products        # Listar productos
POST /api/auth/login      # Iniciar sesión
POST /api/cart/add        # Agregar al carrito
POST /api/orders          # Crear pedido
```

---

## 👥 Equipo de Desarrollo

| Rol | Nombre | Responsabilidad |
|-----|--------|----------------|
| **Jefe de Proyecto** | Jheremy James Panizo De Tomas | Coordinación y base de datos |
| **Desarrollador Backend** | Jose Antonio Beraun Ramos | API y lógica de negocio |
| **Desarrollador Backend** | Misael Fernando Challco | Autenticación y seguridad |
| **Desarrollador Frontend** | Liberato Robin Illia Menacho Perez | Interfaz de usuario |
| **Analista/QA** | Luis Huayllacayan Zuta | Análisis y testing |

---

## 📅 Cronograma

| Fase | Responsable | Fecha Programada | Estado |
|------|-------------|------------------|--------|
| Diseño de interfaz web | Illia | 04/09/2025 | ✅ Completado |
| Módulo de autenticación | Misael | 06/09/2025 | 🚧 En progreso |
| Carrito de compras | Luis | 17/09/2025 | ⏳ Pendiente |
| Catálogo de productos | Jose | 25/09/2025 | ⏳ Pendiente |
| Base de datos | James | 29/09/2025 | ⏳ Pendiente |

**Fecha de entrega**: 29 de Noviembre, 2025

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Estándares de Código
- Seguir convenciones de Java para backend
- Usar nomenclatura clara en JavaScript
- Documentar funciones importantes
- Mantener código limpio y comentado

---

## 📊 Requerimientos del Sistema

### Funcionales
- [x] RF1: Sistema de registro e inicio de sesión
- [x] RF2: Catálogo de productos por categorías
- [x] RF3: Sistema de búsqueda con filtros
- [x] RF4: Carrito de compras funcional
- [x] RF5: Procesamiento de pedidos online
- [x] RF6: Sistema de notificaciones
- [x] RF7: Panel de administración
- [x] RF8: Formulario de contacto

### No Funcionales
- **Performance**: Tiempo de carga < 3 segundos
- **Compatibilidad**: Navegadores modernos y dispositivos móviles
- **Disponibilidad**: 24/7 según infraestructura de hosting
- **Usabilidad**: Interfaz intuitiva y responsiva

---

## 📞 Contacto

**Minimarket La Parada**
- Email: contacto@laparada.com
- Teléfono: +51 XXX XXX XXX

**Equipo de Desarrollo**
- Email: equipo.laparada@gmail.com

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---


