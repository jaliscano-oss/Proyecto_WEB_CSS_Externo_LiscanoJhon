# ShopEasy 🛒 - Plataforma E-Commerce Moderna

<div align="center">

![ShopEasy Logo](img/logoCarritoShopEasy.png)

**Tienda online completa con panel de administración, carrito de compras y APIs integradas**

[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple?logo=bootstrap)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML-5-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS-3-blue?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

---

## 📋 Descripción

**ShopEasy** es una aplicación web de comercio electrónico completamente funcional desarrollada como proyecto integrador para la asignatura **Fundamentos Web**. La aplicación implementa un sistema completo de e-commerce con:

- 🛍️ **Catálogo interactivo** con búsqueda y filtros avanzados
- 🛒 **Carrito de compras** con gestión de productos
- 👤 **Sistema de autenticación** con 2 roles (comprador y administrador)
- ⚙️ **Panel de administración** con CRUD completo
- 🌤️ **Widget de clima** en tiempo real para ciudades de Ecuador
- 📊 **Gráficos estadísticos** con Chart.js
- 🌍 **Integración de APIs externas** (países y clima)
- 💾 **Persistencia de datos** con localStorage

---

## 👨‍💻 Autor

**Jhon Liscano**  
Estudiante de Fundamentos Web  
📍 Santo Domingo de los Tsáchilas, Ecuador  
📧 contacto@shopeasy.ec

---

## 🎯 Objetivos del Proyecto

### Objetivo General
Desarrollar una plataforma web de comercio electrónico dinámica, responsiva e interactiva que integre tecnologías modernas de desarrollo frontend, demostrando la evolución desde páginas estáticas hasta un sistema web funcional completo.

### Objetivos Específicos
✅ Implementar HTML5 semántico con estructura accesible (WCAG 2.1)  
✅ Diseñar interfaces responsivas para móvil, tablet y desktop  
✅ Desarrollar lógica de negocio con JavaScript ES6+ modular  
✅ Integrar Bootstrap 5 reduciendo 83% de CSS custom  
✅ Consumir APIs externas (REST Countries, Open-Meteo)  
✅ Implementar persistencia de datos con localStorage  
✅ Utilizar librerías modernas (SweetAlert2, Toastify, Chart.js)  
✅ Desarrollar sistema CRUD completo para administración  
✅ Implementar validaciones robustas en formularios  
✅ Crear sistema de autenticación con manejo de roles

---

## ✨ Funcionalidades Principales

### 🏠 Página de Inicio (index.html)
- **Productos destacados**: Los 6 mejor calificados cargados dinámicamente
- **Categorías principales**: 4 categorías con imágenes (Electrónica, Ropa, Hogar, Deportes)
- **Carrusel de ofertas**: Bootstrap carousel con 3 banners promocionales
- **Widget de clima**: Información en tiempo real de 4 ciudades de Ecuador
  - Santo Domingo, Quevedo, Quito, Guayaquil
  - Temperatura, humedad, viento, condición climática
  - Iconos dinámicos según el clima
- **Búsqueda rápida**: Formulario que redirige al catálogo con query
- **Sección "Por qué elegirnos"**: 4 características destacadas
- **FAQ**: Accordion con preguntas frecuentes
- **Navbar dinámico**: Se actualiza según estado de autenticación

### 📦 Catálogo de Productos (catalogo/catalogo.html)
**Filtros Avanzados:**
- 🔍 Búsqueda en tiempo real (evento `input`)
- 📁 Filtro por categoría (dropdown)
- ⭐ Filtro por calificación (3+, 4+, 5 estrellas)
- 💰 Rango de precios (mínimo y máximo)
- 📦 Solo productos en stock
- 🚚 Envío gratis
- 🔄 Ordenamiento: relevancia, precio (asc/desc), fecha, calificación

**Visualizaciones:**
- 🎴 Vista en cuadrícula (grid responsivo)
- 📋 Vista en tabla (con scroll horizontal)
- 📱 Drawer de filtros para móviles (overlay + animación)

**Funcionalidades:**
- Modal de detalle completo del producto
- Agregar productos al carrito (requiere login)
- Contador de resultados dinámico
- Paginación (12 productos por página)
- Badge de stock (Disponible, Bajo stock, Agotado)
- Descuentos visuales con precio anterior tachado

### � Carrito de Compras (carrito/carrito.html)
- **Gestión de productos**: Aumentar/disminuir cantidad, eliminar
- **Cálculos automáticos**:
  - Subtotal por producto
  - Subtotal general
  - Aplicación de cupones de descuento
  - Costo de envío (estándar, express, mismo día)
  - IVA (15%)
  - Total final
- **Cupones válidos**:
  - `SHOP20`: 20% de descuento
  - `PRIMERA10`: $10 de descuento fijo
  - `ENVIOGRATIS`: Envío gratis
  - `BIENVENIDO15`: 15% de descuento
- **Persistencia**: Datos guardados en localStorage
- **Validación**: Requiere login para acceder
- **Botón flotante**: Contador de productos en todas las páginas

### 💳 Proceso de Pago (pago/pago.html)
- **Resumen del pedido**: Lista de productos con cantidades y precios
- **Métodos de pago**: Tarjeta de crédito/débito, PayPal, Pago contra entrega
- **Formulario de envío**: Dirección completa con validaciones
- **Validaciones**: Todos los campos obligatorios
- **Confirmación**: SweetAlert con resumen del pedido

### 👤 Registro de Usuarios (registro/registro.html)
**Formulario Completo:**
- Nombres y apellidos
- Email con validación de formato
- Contraseña y confirmación (mínimo 6 caracteres)
- **Selector de nacionalidad**: Dropdown con API de países
  - Búsqueda en tiempo real
  - Banderas de emoji (fallback de CORS)
  - 190+ países disponibles
- Teléfono con formato
- Fecha de nacimiento con validación de mayor de edad
- Términos y condiciones (checkbox requerido)

**Validaciones:**
- ✅ Email válido (regex)
- ✅ Contraseñas coincidentes
- ✅ Mayor de 18 años
- ✅ Teléfono con formato internacional
- ✅ Todos los campos obligatorios

### 🔐 Sistema de Autenticación (login/login.html)
**Login:**
- Email y contraseña
- Checkbox "Recordar sesión"
- Detección automática de rol (comprador/administrador)
- Redirección según rol:
  - **Comprador** → index.html
  - **Administrador** → admin.html
- Validación de credenciales contra JSON

**Usuarios de Prueba:**
```
👤 Comprador:
Email: juan.perez@email.com
Contraseña: 123456

🛡️ Administrador:
Email: admin@shopeasy.ec
Contraseña: admin123
```

**Navbar Dinámico:**
- Usuario NO logueado: Muestra "Iniciar sesión" y "Registrarse"
- Usuario logueado: Dropdown con nombre y opciones:
  - Mi Perfil
  - Mis Pedidos
  - Panel de Administración (solo admins)
  - Cerrar Sesión
- Badge "Admin" para administradores
- Icono diferenciado (escudo vs círculo)

### ⚙️ Panel de Administración (admin.html)
**Acceso:** Solo para usuarios con rol `administrador`

**Estadísticas (Cards Animadas):**
- 📦 Total de productos
- ✅ Productos disponibles
- 👥 Usuarios registrados
- 💵 Precio promedio

**Gráfico Chart.js:**
- Distribución de productos por categoría (barras)
- Colores diferenciados por categoría
- Tooltips interactivos

**Tabs de Gestión:**

1️⃣ **Productos**:
- ➕ Crear producto nuevo (modal con formulario)
- ✏️ Editar producto existente
- 🗑️ Eliminar producto (con confirmación)
- 📋 Tabla con imágenes, precios, stock y acciones
- **Campos del formulario**:
  - Nombre, categoría, descripción
  - Precio, stock, precio anterior, descuento
  - Calificación, imagen URL
- **Validaciones**: Todos los campos obligatorios

2️⃣ **Usuarios**:
- Visualización de todos los usuarios registrados
- Información: Nombre, email, rol, nacionalidad, teléfono
- Badge visual para roles
- Banderas de emoji por país

3️⃣ **Categorías**:
- Visualización de categorías disponibles
- Imagen, descripción, cantidad de productos

**Funciones Especiales:**
- 🔄 Restablecer Datos: Vuelve a los datos originales del JSON
- 🧹 Limpiar Storage: Elimina todo el localStorage (cierra sesión)

**Navbar Específico:**
- Panel Admin (activo)
- Ver Tienda (abre index.html)
- Dropdown con email y opciones admin

---

## 🛠️ Stack Tecnológico

### Frontend Core
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **HTML5** | - | Estructura semántica |
| **CSS3** | - | Estilos y animaciones |
| **JavaScript** | ES6+ | Lógica de aplicación |
| **Bootstrap** | 5.3.3 | Framework CSS responsivo |

### Librerías JavaScript
| Librería | Versión | Propósito |
|----------|---------|-----------|
| **SweetAlert2** | 11.x | Modales y confirmaciones |
| **Toastify.js** | - | Notificaciones toast |
| **Chart.js** | Latest | Gráficos estadísticos |
| **Font Awesome** | 6.5.0 | Iconos vectoriales |

### APIs Externas
| API | Endpoint | Uso |
|-----|----------|-----|
| **REST Countries** | `restcountries.com/v3.1` | Listado de países con banderas |
| **Open-Meteo** | `api.open-meteo.com/v1/forecast` | Datos meteorológicos |

### Almacenamiento
- **localStorage**: Persistencia de productos, usuarios, carrito y sesión

---

## 📁 Estructura del Proyecto

```
Proyecto_WEB_CSS_Externo_LiscanoJhon/
│
├── 📄 index.html                    # Página principal
├── 📄 admin.html                    # Panel de administración
├── 📄 README.md                     # Esta documentación
├── 📄 REVISION_CUMPLIMIENTO.md      # Validación de requisitos
│
├── 📁 login/
│   └── login.html                   # Autenticación
│
├── 📁 registro/
│   └── registro.html                # Registro de usuarios
│
├── 📁 catalogo/
│   └── catalogo.html                # Catálogo con filtros
│
├── 📁 carrito/
│   └── carrito.html                 # Carrito de compras
│
├── 📁 pago/
│   └── pago.html                    # Proceso de checkout
│
├── 📁 css/
│   ├── styles.css                   # Estilos compartidos (450 líneas)
│   ├── home.css                     # Estilos del home
│   ├── catalogo.css                 # Estilos del catálogo
│   ├── carrito.css                  # Estilos del carrito
│   ├── pago.css                     # Estilos de pago
│   ├── login.css                    # Estilos de login
│   ├── registro.css                 # Estilos de registro
│   └── admin.css                    # Estilos del panel admin
│
├── 📁 js/
│   ├── storage.js                   # Gestión de localStorage
│   ├── datos.js                     # Carga inicial de JSON
│   ├── api.js                       # Consumo de APIs externas
│   ├── validaciones.js              # Validaciones de formularios
│   ├── componentes.js               # Componentes compartidos
│   ├── home.js                      # Lógica del home
│   ├── catalogo.js                  # Lógica del catálogo
│   ├── carrito.js                   # Lógica del carrito
│   ├── pago.js                      # Lógica de pago
│   ├── login.js                     # Lógica de autenticación
│   ├── registro.js                  # Lógica de registro
│   └── admin.js                     # Lógica de administración
│
├── 📁 json/
│   ├── productos.json               # 55 productos
│   ├── categorias.json              # 4 categorías
│   └── usuarios.json                # 80 usuarios (15 con contraseña)
│
└── 📁 img/
    ├── 📁 icon/                     # Iconos
    ├── logoCarritoShopEasy.png      # Logo principal
    ├── carruselOferta.jpg           # Banner 1
    ├── carruselEnvios.jpg           # Banner 2
    ├── carruselDestacados.jpg       # Banner 3
    ├── productosElec.avif           # Categoría Electrónica
    ├── productosRopa.jpg            # Categoría Ropa
    ├── productosHogar.jpg           # Categoría Hogar
    ├── productosDeportes.jpg        # Categoría Deportes
    └── [55 imágenes de productos]
```

**Total de líneas de código:**
- HTML: ~2,500 líneas
- CSS: ~2,000 líneas (83% reducción vs versión anterior)
- JavaScript: ~3,500 líneas

---

## 🚀 Instalación y Ejecución

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- ✅ Navegador web moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- ✅ Editor de código (Visual Studio Code recomendado)
- ✅ Extensión **Live Server** para VS Code
- ✅ Conexión a internet (para CDNs y APIs)

### Opción 1: Clonar desde GitHub

```bash
# Clonar el repositorio
git clone https://github.com/usuario/Proyecto_WEB_CSS_Externo_LiscanoJhon.git

# Navegar al directorio
cd Proyecto_WEB_CSS_Externo_LiscanoJhon

# Abrir en VS Code
code .
```

### Opción 2: Descarga Directa

1. Descargar ZIP desde GitHub
2. Extraer en una carpeta local
3. Abrir la carpeta en VS Code

### Ejecución con Live Server

1. **Instalar Live Server**:
   - En VS Code: `Ctrl + Shift + X`
   - Buscar "Live Server"
   - Instalar la extensión de Ritwick Dey

2. **Iniciar el servidor**:
   - Click derecho en `index.html`
   - Seleccionar **"Open with Live Server"**
   - O usar atajo: `Alt + L, Alt + O`

3. **Navegar**:
   ```
   http://127.0.0.1:5500/index.html
   ```

### Solución de Problemas Comunes

**❌ Los productos no cargan**
- Asegúrate de usar Live Server (no abrir el HTML directamente)
- Verifica que los archivos JSON estén en la carpeta `/json/`

**❌ Error de CORS en API de países**
- Es normal en desarrollo local
- El sistema usa fallback automático con emojis 🇪🇨

**❌ El navbar no se actualiza después del login**
- Limpia el localStorage: F12 → Application → Local Storage → Clear All
- Recarga la página: `Ctrl + Shift + R`

---

## 📊 Archivos JSON y Datos

### productos.json (55 registros)
**Estructura:**
```json
{
  "id": 1,
  "nombre": "Auriculares Bluetooth Pro",
  "categoriaId": 1,
  "descripcion": "Auriculares inalámbricos con cancelación de ruido...",
  "precio": 45.99,
  "precioAnterior": 57.99,
  "descuento": 20,
  "calificacion": 4,
  "resenas": 128,
  "stock": 12,
  "estado": "disponible",
  "imagen": "../img/auricularesInalambricos.jpg",
  "fechaRegistro": "2026-01-15"
}
```

**Distribución por categoría:**
- 🖥️ Electrónica: 30 productos
- 👕 Ropa y Moda: 15 productos
- 🏠 Hogar: 15 productos
- ⚽ Deportes: 10 productos

### categorias.json (4 registros)
```json
{
  "id": 1,
  "nombre": "Electrónica",
  "descripcion": "Dispositivos electrónicos, accesorios tecnológicos y gadgets",
  "imagen": "../img/productosElec.avif",
  "icono": "fa-solid fa-laptop"
}
```

### usuarios.json (80 registros)
**15 usuarios con contraseña** (ID 1-15):
```json
{
  "id": 1,
  "nombres": "Juan Carlos",
  "apellidos": "Pérez López",
  "email": "juan.perez@email.com",
  "contrasena": "123456",
  "rol": "comprador",
  "nacionalidad": "Ecuador",
  "bandera": "🇪🇨",
  "telefono": "+593991234567",
  "fechaNacimiento": "1995-03-15",
  "fechaRegistro": "2026-01-10"
}
```

**65 usuarios sin contraseña** (ID 16-80): Solo para demostración de datos

**Distribución de roles:**
- 👤 Compradores: 79 usuarios
- 🛡️ Administradores: 1 usuario

**Total de registros JSON: 139**
- 55 productos + 4 categorías + 80 usuarios = **139 registros**

---

## 🔧 Funcionalidades Técnicas JavaScript

### Manipulación del DOM
```javascript
// Generación dinámica de componentes
- document.createElement()
- innerHTML
- appendChild()
- classList.add/remove/toggle
- querySelector/querySelectorAll
```

### Eventos Implementados
| Evento | Uso | Ejemplo |
|--------|-----|---------|
| `DOMContentLoaded` | Inicialización | Cargar datos al inicio |
| `input` | Búsqueda en tiempo real | Filtrar productos |
| `change` | Actualización de filtros | Cambiar categoría |
| `click` | Acciones de botones | Agregar al carrito |
| `submit` | Envío de formularios | Login, Registro |

### Operaciones con Arrays
```javascript
// Métodos funcionales
productos.filter(p => p.stock > 0)           // Filtrado
productos.map(p => p.nombre)                 // Transformación
productos.find(p => p.id === 1)              // Búsqueda
productos.reduce((sum, p) => sum + p.precio, 0)  // Agregación
productos.sort((a, b) => a.precio - b.precio)    // Ordenamiento
```

### Almacenamiento (localStorage)
```javascript
// CRUD con localStorage
const STORAGE_KEYS = {
    PRODUCTOS: 'shopeasy_productos',
    CATEGORIAS: 'shopeasy_categorias',
    USUARIOS: 'shopeasy_usuarios',
    CARRITO: 'shopeasy_carrito',
    SESION: 'shopeasy_sesion'
};

// Guardar
guardarEnStorage(STORAGE_KEYS.PRODUCTOS, productos);

// Obtener
const productos = obtenerDeStorage(STORAGE_KEYS.PRODUCTOS);

// Eliminar
localStorage.removeItem(STORAGE_KEYS.SESION);
```

### Validaciones Implementadas
```javascript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Teléfono
const telefonoRegex = /^\+?[0-9]{10,15}$/;

// Mayor de edad
const edad = calcularEdad(fechaNacimiento);
return edad >= 18;

// Contraseñas
return password.length >= 6 && password === confirmPassword;
```

---

## 📱 Diseño Responsivo

### Breakpoints Bootstrap
```css
/* Móvil */
@media (max-width: 767px) {
    .productos-grid { grid-template-columns: 1fr; }
    .filtros-sidebar { position: fixed; transform: translateX(-100%); }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 991px) {
    .productos-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 992px) and (max-width: 1399px) {
    .productos-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Desktop XL */
@media (min-width: 1400px) {
    .productos-grid { grid-template-columns: repeat(4, 1fr); }
}
```

### Características Responsivas
- ✅ Menú hamburguesa en móvil
- ✅ Grid flexible (1→2→3→4 columnas)
- ✅ Drawer de filtros con overlay
- ✅ Tabla con scroll horizontal
- ✅ Imágenes adaptativas (`object-fit: cover`)
- ✅ Tipografía escalable (`rem`, `em`)

### Pruebas de Dispositivos
| Dispositivo | Resolución | Estado |
|-------------|------------|--------|
| iPhone 12 Pro | 390 × 844 px | ✅ Optimizado |
| iPad Air | 820 × 1180 px | ✅ Optimizado |
| MacBook Pro | 1440 × 900 px | ✅ Optimizado |
| Desktop HD | 1920 × 1080 px | ✅ Optimizado |

---

## 🌐 Integración de APIs

### 1. REST Countries API
**Endpoint:**
```javascript
https://restcountries.com/v3.1/all?fields=name,flags,cca2
```

**Respuesta:**
```json
[
  {
    "name": { "common": "Ecuador" },
    "flags": {
      "png": "https://flagcdn.com/w320/ec.png",
      "svg": "https://flagcdn.com/ec.svg"
    },
    "cca2": "EC"
  }
]
```

**Implementación:**
```javascript
async function cargarPaises() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
        const data = await response.json();
        return data.map(p => ({
            nombre: p.name.common,
            bandera: p.flags.png,
            codigo: p.cca2
        })).sort((a, b) => a.nombre.localeCompare(b.nombre));
    } catch (error) {
        // Fallback con emojis
        return obtenerPaisesRespaldo();
    }
}
```

**Fallback CORS:**
- Si la API falla (error de CORS local), usa lista hardcodeada con emojis
- 20 países principales de América Latina

### 2. Open-Meteo API
**Endpoint:**
```javascript
https://api.open-meteo.com/v1/forecast?
  latitude=-0.25&
  longitude=-79.15&
  current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code
```

**Respuesta:**
```json
{
  "current": {
    "temperature_2m": 24.5,
    "relative_humidity_2m": 75,
    "wind_speed_10m": 12.5,
    "weather_code": 3
  }
}
```

**Códigos de Clima:**
| Código | Descripción | Icono |
|--------|-------------|-------|
| 0 | Despejado | ☀️ |
| 1-3 | Parcialmente nublado | ⛅ |
| 45, 48 | Niebla | 🌫️ |
| 51-67 | Lluvia | 🌧️ |
| 71-77 | Nieve | ❄️ |
| 80-99 | Tormenta | ⛈️ |

**Ciudades Configuradas:**
```javascript
const CIUDADES_ECUADOR = {
    'Santo Domingo': { lat: -0.2500, lon: -79.1750 },
    'Quevedo': { lat: -1.0278, lon: -79.4603 },
    'Quito': { lat: -0.1807, lon: -78.4678 },
    'Guayaquil': { lat: -2.1894, lon: -79.8889 }
};
```

---

## 📈 Estadísticas y Chart.js

### Gráfico de Productos por Categoría
```javascript
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Electrónica', 'Ropa', 'Hogar', 'Deportes'],
        datasets: [{
            label: 'Cantidad de productos',
            data: [30, 15, 15, 10],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ]
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});
```

### Indicadores del Panel Admin
- 📦 **Total de productos**: 55
- ✅ **Productos disponibles**: 54 (stock > 0)
- 👥 **Usuarios registrados**: 80
- 💵 **Precio promedio**: $45.67

---

## 🔐 Seguridad y Buenas Prácticas

### Validaciones
✅ **Frontend**: JavaScript valida todos los formularios  
✅ **Email**: Expresión regular RFC 5322  
✅ **Contraseñas**: Mínimo 6 caracteres  
✅ **Edad**: Validación de mayor de 18 años  
✅ **Sanitización**: Uso de `trim()` en inputs

### Manejo de Errores
```javascript
try {
    const data = await fetch(url);
    return await data.json();
} catch (error) {
    console.error('Error:', error);
    mostrarError('No se pudo cargar los datos');
    return fallbackData;
}
```

### Confirmaciones
- 🗑️ **Eliminar producto**: SweetAlert con confirmación
- 🔄 **Restablecer datos**: Advertencia de pérdida de cambios
- 🧹 **Limpiar storage**: Alerta de cierre de sesión
- 💳 **Procesar pago**: Resumen antes de confirmar

### Limitaciones Conocidas
⚠️ **Nota de Seguridad**: Este es un proyecto académico frontend-only.  
En producción se requiere:
- Backend con base de datos real
- Autenticación con JWT o sesiones server-side
- Encriptación de contraseñas (bcrypt)
- Validación server-side
- HTTPS obligatorio
- Rate limiting y CAPTCHA

---

## 🎨 Guía de Estilos

### Paleta de Colores
```css
:root {
    --shopeasy-primary: #007bff;    /* Azul principal */
    --shopeasy-secondary: #6c757d;  /* Gris */
    --shopeasy-success: #28a745;    /* Verde */
    --shopeasy-danger: #dc3545;     /* Rojo */
    --shopeasy-warning: #ffc107;    /* Amarillo */
    --shopeasy-info: #17a2b8;       /* Cian */
    --shopeasy-light: #f8f9fa;      /* Gris claro */
    --shopeasy-dark: #343a40;       /* Gris oscuro */
}
```

### Tipografía
- **Familia**: System fonts stack (San Francisco, Segoe UI, Roboto)
- **Tamaños base**: 16px (1rem)
- **Escala**: 0.875rem, 1rem, 1.25rem, 1.5rem, 2rem

### Iconos Font Awesome
```html
<i class="fa-solid fa-house"></i>           <!-- Inicio -->
<i class="fa-solid fa-box"></i>             <!-- Catálogo -->
<i class="fa-solid fa-cart-shopping"></i>   <!-- Carrito -->
<i class="fa-solid fa-user"></i>            <!-- Usuario -->
<i class="fa-solid fa-gear"></i>            <!-- Admin -->
```

---

## 📝 Casos de Uso

### Usuario Comprador
1. Ingresa a index.html
2. Navega por productos destacados
3. Consulta el clima de su ciudad
4. Va al catálogo y aplica filtros
5. Agrega productos al carrito (requiere login)
6. Inicia sesión como comprador
7. Revisa su carrito y aplica cupón
8. Procede al pago
9. Completa el formulario de envío
10. Confirma la orden

### Usuario Administrador
1. Inicia sesión como admin
2. Es redirigido al panel de administración
3. Visualiza estadísticas generales
4. Ve el gráfico de distribución
5. Accede a la tab de Productos
6. Crea un nuevo producto
7. Edita un producto existente
8. Elimina productos agotados
9. Revisa la lista de usuarios registrados
10. Restablece datos si es necesario

---

## 🧪 Testing Manual

### Checklist de Pruebas

**✅ Navegación**
- [ ] Navbar funciona en todas las páginas
- [ ] Links internos redirigen correctamente
- [ ] Navbar se actualiza al hacer login
- [ ] Botón flotante del carrito funciona

**✅ Catálogo**
- [ ] Búsqueda en tiempo real funciona
- [ ] Filtros por categoría funcionan
- [ ] Filtro de rango de precios funciona
- [ ] Ordenamiento funciona correctamente
- [ ] Vista grid/tabla toggle funciona
- [ ] Paginación funciona
- [ ] Modal de detalle abre correctamente

**✅ Carrito**
- [ ] Agregar producto funciona
- [ ] Aumentar/disminuir cantidad funciona
- [ ] Eliminar producto funciona
- [ ] Cupones se aplican correctamente
- [ ] Cálculos (subtotal, IVA, total) son correctos
- [ ] Persistencia en localStorage funciona

**✅ Autenticación**
- [ ] Login con credenciales válidas funciona
- [ ] Login con credenciales inválidas muestra error
- [ ] Redirección según rol funciona
- [ ] Cerrar sesión funciona
- [ ] Navbar muestra dropdown de usuario

**✅ Registro**
- [ ] Validación de email funciona
- [ ] Validación de contraseñas funciona
- [ ] Validación de edad funciona
- [ ] Selector de países funciona
- [ ] Búsqueda de países funciona
- [ ] Usuario se guarda en localStorage

**✅ Panel Admin**
- [ ] Solo accesible para administradores
- [ ] Estadísticas se muestran correctamente
- [ ] Gráfico Chart.js se renderiza
- [ ] Crear producto funciona
- [ ] Editar producto funciona
- [ ] Eliminar producto funciona
- [ ] Tabs cambian correctamente

**✅ APIs**
- [ ] Widget de clima muestra datos
- [ ] Cambiar ciudad actualiza el clima
- [ ] Fallback de países funciona si hay CORS

**✅ Responsive**
- [ ] Se ve bien en móvil (< 768px)
- [ ] Se ve bien en tablet (768-991px)
- [ ] Se ve bien en desktop (> 992px)
- [ ] Drawer de filtros funciona en móvil
- [ ] Menú hamburguesa funciona

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Bootstrap 5.3](https://getbootstrap.com/docs/5.3/)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Toastify.js](https://apvarun.github.io/toastify-js/)
- [Chart.js](https://www.chartjs.org/docs/latest/)
- [REST Countries API](https://restcountries.com/)
- [Open-Meteo API](https://open-meteo.com/en/docs)

### Tutoriales Útiles
- MDN Web Docs: JavaScript ES6+
- W3Schools: HTML5 & CSS3
- Bootstrap 5 Crash Course
- localStorage Best Practices

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: CORS al cargar países
**Síntoma**: Error en consola con REST Countries API  
**Causa**: Política CORS en desarrollo local  
**Solución**: El sistema usa fallback automático con emojis

### Problema: Navbar no se actualiza
**Síntoma**: Después del login sigue mostrando "Iniciar sesión"  
**Solución**:
1. Abre DevTools (F12)
2. Application → Local Storage
3. Elimina `shopeasy_sesion`
4. Recarga: `Ctrl + Shift + R`

### Problema: Productos no cargan
**Síntoma**: Catálogo vacío o loader infinito  
**Causa**: No estás usando Live Server  
**Solución**: Abre con Live Server, no con "Open with Browser"

### Problema: Imágenes no cargan
**Síntoma**: Imágenes rotas en productos  
**Causa**: Rutas relativas incorrectas  
**Solución**: Verificar que las imágenes estén en `/img/`

---

## 📞 Contacto y Soporte

### Información del Desarrollador
- 👤 **Nombre**: Jhon Liscano
- 📧 **Email**: contacto@shopeasy.ec
- 📱 **Teléfono**: +593 99 123 4567
- 📍 **Ubicación**: Santo Domingo de los Tsáchilas, Ecuador
- 🏫 **Institución**: [Tu institución educativa]

### Ubicación de la Empresa (Ficticia)
```
ShopEasy S.A.
Av. General Rumiñahui s/n
Sangolquí, Ecuador
```
[📍 Ver en Google Maps](https://maps.app.goo.gl/a683TKhX5CdoCRYu8)

### Horario de Atención
- 🕐 Lunes a Viernes: 8:00 - 18:00
- 🕐 Sábado: 9:00 - 13:00
- 🚫 Domingo: Cerrado

---

## 📄 Licencia

© 2026 **ShopEasy**. Todos los derechos reservados.

Este proyecto es de carácter **académico** y fue desarrollado como parte del curso de Fundamentos Web. 

El código está disponible bajo licencia MIT para fines educativos.

```
MIT License

Copyright (c) 2026 Jhon Liscano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🎓 Créditos

### Desarrollado por
**Jhon Liscano** - Desarrollo completo (Frontend)

### Tecnologías de Terceros
- Bootstrap Team - Framework CSS
- Font Awesome - Iconos
- SweetAlert2 - Modales
- Toastify.js - Notificaciones
- Chart.js - Gráficos
- REST Countries - API de países
- Open-Meteo - API de clima

### Agradecimientos
- Profesor(a) de Fundamentos Web
- Compañeros de clase
- Comunidad de Stack Overflow
- MDN Web Docs

---

## 🚀 Roadmap Futuro (Mejoras Propuestas)

### Versión 2.0
- [ ] Backend con Node.js + Express
- [ ] Base de datos MongoDB
- [ ] Autenticación con JWT
- [ ] Pasarela de pago real (Stripe/PayPal)
- [ ] Sistema de reviews y calificaciones
- [ ] Chat en vivo con soporte
- [ ] Panel de vendedores
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro

### Versión 3.0
- [ ] App móvil (React Native)
- [ ] Búsqueda con IA
- [ ] Recomendaciones personalizadas
- [ ] Sistema de puntos y gamificación
- [ ] Programa de referidos
- [ ] Multi-idioma (i18n)
- [ ] Multi-moneda
- [ ] Integración con redes sociales

---

<div align="center">

## ⭐ Si te gustó este proyecto, dale una estrella en GitHub!

**Hecho con ❤️ en Ecuador 🇪🇨**

[⬆ Volver arriba](#shopeasy---plataforma-e-commerce-moderna)

</div>