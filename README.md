# ShopEasy

## Descripción

ShopEasy es un sitio web de comercio electrónico desarrollado como proyecto personal para la asignatura de Fundamentos de Sistemas Web. Permite a un usuario explorar un catálogo de productos, aplicar filtros de búsqueda, visualizar el detalle de cada producto, gestionar un carrito de compras, iniciar sesión, registrarse y simular un proceso de pago. En esta etapa, los datos del proyecto se encuentran simulados directamente en el HTML.

## Objetivo

Integrar estilos CSS externos, componentes de Bootstrap, diseño mobile-first y representaciones de datos en formatos JSON y XML dentro de un proyecto web de comercio electrónico, manteniendo una identidad visual coherente en todas sus páginas.

## Tecnologías utilizadas

- HTML5
- CSS3 (archivos externos, diseño mobile-first, Flexbox y CSS Grid)
- Bootstrap 5.3
- Font Awesome 6.5
- JSON y XML (representación de datos)
- Git y GitHub

## Estructura de carpetas

```
ProyectoWEB/
├── home.html
├── catalogo/
│   └── catalogo.html
├── carrito/
│   └── carrito.html
├── login/
│   └── login.html
├── registro/
│   └── registro.html
├── pago/
│   └── pago.html
├── css/
│   ├── general.css
│   ├── home.css
│   ├── catalogo.css
│   ├── carrito.css
│   ├── login.css
│   └── registro.css
├── img/
│   ├── logoCarritoShopEasy.png
│   └── icon/
├── data/
│   ├── datos.json
│   └── datos.xml
└── README.md
```

## Páginas disponibles

| Página | Archivo | Descripción |
|---|---|---|
| Inicio | `home.html` | Página principal con banner, carrusel de promociones y categorías destacadas |
| Catálogo | `catalogo/catalogo.html` | Listado de productos con filtros, tabla, vista en tarjetas y modal de detalle |
| Carrito | `carrito/carrito.html` | Productos agregados, resumen de compra y totales |
| Iniciar sesión | `login/login.html` | Formulario de inicio de sesión |
| Registro | `registro/registro.html` | Formulario de registro de usuario |
| Pago | `pago/pago.html` | Simulación del proceso de pago |

## Componentes Bootstrap utilizados

- Navbar
- Carousel
- Modal
- Accordion
- Badge
- Alert
- Breadcrumb

Todos los componentes fueron personalizados (colores, bordes, sombras y efectos hover) para ajustarse a la identidad visual del proyecto, en lugar de mantener la apariencia predeterminada de Bootstrap.

## Archivos JSON y XML

Dentro de la carpeta `data/` se incluyen dos archivos que representan la estructura de los productos mostrados en el catálogo:

- **`datos.json`**: representa el listado de productos en formato JSON, con los campos `id`, `nombre`, `categoria`, `descripcion`, `precio`, `precioAnterior`, `descuento`, `calificacion`, `resenas`, `stock` e `imagen`.
- **`datos.xml`**: representa la misma información mediante una estructura jerárquica de etiquetas XML (`<productos>` / `<producto>`).

En esta entrega los datos siguen colocados de forma simulada en el HTML; estos archivos muestran cómo se estructuraría la información si en una etapa posterior se obtuviera dinámicamente desde un servidor o una API.

## Instrucciones para ejecutar el proyecto

1. Clonar o descargar el repositorio.
2. Abrir el archivo `home.html` directamente en el navegador, o servir la carpeta del proyecto con una extensión tipo Live Server.
3. Navegar entre las páginas usando el menú de navegación superior.

No se requiere instalación de dependencias ni conexión a un servidor o base de datos.

## Autor

Liscano Carbo Jhon Anderson
Ingeniería en Tecnologías de la Información — Universidad de las Fuerzas Armadas ESPE, Sede Santo Domingo