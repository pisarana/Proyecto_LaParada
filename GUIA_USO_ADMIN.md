# 📘 Guía de Uso - Panel Administrativo Mejorado

## 🚀 Inicio Rápido

### Acceder al Panel
```
URL: http://127.0.0.1:3000/frontend/pages/admin/dashboard.html
```

**Credenciales de Prueba:**
- Email: `admin@laparada.com`
- Contraseña: `password123`

---

## 📍 Navegación Principal

### 1️⃣ **Gestión de Productos** 📦
```
Pestaña: [Gestión de Productos] (Primera pestaña)
```

**Funciones:**
- 🔍 **Buscar**: Por nombre de producto (en tiempo real)
- 🏷️ **Filtrar por categoría**: Bebidas, Snacks, Dulces, Lácteos
- 📊 **Filtrar por stock**: Todo, Bajo (<10), Sin stock
- ➕ **Agregar producto**: Botón verde "Agregar Producto"
- ✏️ **Editar**: Ícono de lápiz en cada fila
- 🗑️ **Eliminar**: Ícono de basura en cada fila

**Información que se muestra:**
- ID del producto
- Imagen thumbnail
- Nombre y descripción
- Categoría (badge)
- Precio en S/.
- Stock disponible (color verde/amarillo/rojo)
- Estado (Activo/Inactivo)

---

### 2️⃣ **Gestión de Pedidos** 🛒
```
Pestaña: [Pedidos] (Segunda pestaña)
```

**Funciones:**
- 📋 **Listar pedidos**: Todos los pedidos del sistema
- 🔄 **Cambiar estado**: Varias opciones de estado
- 👁️ **Ver detalles**: Ícono de ojo para más información
- ❌ **Cancelar orden**: Opción en modal de detalles

**Información que se muestra:**
- ID del pedido
- Nombre del usuario
- Total en S/.
- Fecha de creación
- Estado actual (colores: Pendiente/Confirmado/Entregado, etc.)
- Acciones disponibles

**Estados disponibles:**
- 🟡 PENDIENTE
- 🔵 CONFIRMADO
- 🟠 EN_PREPARACION
- 🟣 EN_CAMINO
- 🟢 ENTREGADO
- ⚫ CANCELADO

---

### 3️⃣ **Gestión de Usuarios** 👥
```
Pestaña: [Usuarios] (Tercera pestaña)
```

**Funciones:**
- 📜 **Listar clientes**: Todos los usuarios registrados
- 👁️ **Ver detalles**: Ícono de ojo para información completa

**Información que se muestra:**
- ID del usuario
- Nombre completo
- Email
- Teléfono
- Estado (Activo/Inactivo)
- Datos de contacto

---

### 4️⃣ **Reportes y Analítica** 📊
```
Pestaña: [Reportes] (Cuarta pestaña)
```

**Secciones del Dashboard:**

#### **Estado de Pedidos** 
```
┌─────────────────────────┐
│ 🟡 En Espera (Pendientes)│
│ 🔵 En Progreso           │
│ 🟢 Completados (Entregados)
└─────────────────────────┘
```

#### **Gestión de Usuarios**
```
┌─────────────────────────┐
│ 👑 Administradores      │
│ 👤 Clientes             │
│ 📊 Total de Usuarios    │
└─────────────────────────┘
```

#### **Rendimiento de Ventas**
```
┌─────────────────────────┐
│ 💰 Total de Ventas      │
│ 📦 Número de Órdenes    │
│ 📈 Promedio por Orden   │
└─────────────────────────┘
```

**Botones de Acción:**
- 🔄 **Actualizar**: Recargar datos del dashboard
- 🖨️ **Imprimir**: Generar reporte para imprimir

---

## 🎨 Características Visuales Mejoradas

### Colores y Significados
```
🟢 Verde (#2ecc71)      → Activo, Exitoso, Entregado
🔵 Azul (#3498db)       → Información, Confirmado
🟠 Naranja (#f39c12)    → Advertencia, Stock bajo
🔴 Rojo (#e74c3c)       → Error, Inactivo, Sin stock
⚫ Gris (#95a5a6)        → Neutral, Categorías
```

### Iconos Principales
```
📦 Productos
🛒 Pedidos
👥 Usuarios
📊 Reportes
🔍 Búsqueda
🔄 Actualizar
🖨️ Imprimir
✏️ Editar
🗑️ Eliminar
👁️ Ver
```

---

## ⌨️ Atajos de Teclado

### Navegación
- `TAB` - Moverse entre elementos
- `ENTER` - Activar botones/inputs
- `ESC` - Cerrar modales

### Dentro de Tablas
- `CLICK` en fila - Ver detalles (donde aplique)
- `HOVER` en icono - Ver tooltip de acción

### Búsqueda
- `CTRL + F` - Buscar en página
- Escribir en campo de búsqueda - Filtra en tiempo real

---

## 📱 Responsividad

### Desktop (1024px+)
- ✅ Vista completa con todos los datos
- ✅ Tabla con 8 columnas
- ✅ Filtros en una sola fila

### Tablet (768px - 1023px)
- ✅ Tabla con columnas reducidas
- ✅ Filtros distribuidos en 2 filas
- ✅ Botones compactos

### Móvil (576px - 767px)
- ✅ Tabla adaptada al ancho
- ✅ Filtros en una sola columna
- ✅ Solo iconos en botones
- ✅ Scroll horizontal en tablas

### Móvil Pequeño (<576px)
- ✅ Vista optimizada para dedos
- ✅ Botones grandes (48x48px)
- ✅ Texto redimensionable

---

## 🔔 Notificaciones

### Tipos de Notificaciones
```
✅ ÉXITO       - Operación completada
ℹ️ INFORMACIÓN - Aviso general
❌ ERROR       - Algo salió mal
⚠️ ADVERTENCIA - Acción requiere confirmación
```

### Ubicación
- Esquina superior derecha de la pantalla
- Auto-desaparece después de 4 segundos
- Botón ✕ para cerrar manualmente

---

## 🔐 Seguridad

### Protecciones Implementadas
- ✅ Solo administradores pueden acceder
- ✅ Sesión requiere autenticación válida
- ✅ Redirige a inicio si no es admin
- ✅ Confirmación en operaciones críticas

### Cerrar Sesión
```
1. Busca tu nombre en navbar superior derecho
2. Click en botón "Cerrar sesión"
3. Confirma en el diálogo
```

---

## 🆘 Troubleshooting

### El dashboard no carga
```
1. Verifica que backend esté corriendo (puerto 8080)
2. Verifica autenticación
3. Abre consola F12 para ver errores
4. Recarga la página (F5)
```

### Los datos no aparecen
```
1. Click en "Actualizar" en la esquina
2. Espera a que cargue la información
3. Verifica conexión de red
4. Revisa consola (F12) para errores
```

### Los filtros no funcionan
```
1. Borra la búsqueda
2. Restablece filtros
3. Recarga la página
```

### Modal se abre pero no muestra datos
```
1. Cierra el modal (botón X)
2. Intenta nuevamente
3. Si persiste, recarga la página
```

---

## 📊 Acciones Comunes

### Agregar un Nuevo Producto
```
1. Click en "Agregar Producto" (botón verde)
2. Completa el formulario:
   - Nombre *
   - Categoría * (obligatorio)
   - Precio * (en S/.)
   - Stock *
   - Descripción (opcional)
   - URL de imagen (opcional)
3. Click en "Guardar Producto"
4. Espera confirmación ✅
```

### Cambiar Estado de Pedido
```
1. En pestaña "Pedidos"
2. Click en el ícono de ojo 👁️ de la orden
3. Se abre modal con detalles
4. Selecciona nuevo estado en dropdown
5. Click en "Guardar estado"
6. Se actualizará automáticamente
```

### Ver Detalles de Usuario
```
1. En pestaña "Usuarios"
2. Click en ícono 👁️ en la fila del usuario
3. Modal muestra:
   - ID
   - Nombre
   - Email
   - Teléfono
   - Dirección
   - Estado (Activo/Inactivo)
```

### Imprimir Reportes
```
1. Ve a pestaña "Reportes"
2. Verifica los datos mostrados
3. Click en botón "Imprimir" 🖨️
4. Se abrirá diálogo de impresión
5. Selecciona impresora y configuración
6. Click en "Imprimir"
```

---

## 🎯 Tips y Trucos

### Búsqueda Rápida
- Empieza a escribir en el campo de búsqueda
- Se filtrará en tiempo real sin necesidad de presionar Enter
- Borra todo el texto para ver todos los productos

### Filtros Combinados
- Puedes combinar búsqueda + categoría + stock simultáneamente
- El resultado mostrará solo productos que cumplan TODAS las condiciones

### Datos en Tiempo Real
- Los datos se actualizan automáticamente cuando cambias de pestaña
- Click en "Actualizar" para forzar recarga
- Las estadísticas se actualizan cada vez que revisas la pestaña Reportes

### Exportar Reportes
- Usa el botón "Imprimir" para generar PDF
- Los reportes se formatean automáticamente para impresión
- Sin barras de navegación en la impresión

---

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Abre consola de desarrollador (F12)
2. Copia los errores mostrados
3. Contacta al administrador del sistema

---

## 🔄 Actualizaciones Recientes

### Versión 2.0 Professional Edition (22 Nov 2025)
- ✅ Diseño completamente rediseñado
- ✅ Soporte para Dark Mode
- ✅ Accesibilidad WCAG 2.1
- ✅ Animaciones profesionales
- ✅ Mejor responsive design
- ✅ Manejo de errores mejorado
- ✅ Documentación completa

---

**¡Disfruta del panel administrativo mejorado! 🎉**

*Para más información, consulta MEJORAS_IMPLEMENTADAS.md*
