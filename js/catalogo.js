// catalogo.js - Lógica del catálogo de productos

let productosFiltrados = [];
let paginaActual = 1;
const productosPorPagina = 12;
let filtros = {
    busqueda: '',
    categoria: 'todas',
    precioMin: 0,
    precioMax: 10000,
    orden: 'relevancia'
};

// Inicializar catálogo
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatos();
    actualizarNavbarUsuario();
    inicializarEventos();
    renderizarCategoriasFiltro();
    aplicarFiltros();
});

// Inicializar eventos
function inicializarEventos() {
    // Búsqueda en tiempo real
    const inputBusqueda = document.querySelector('input[type="search"]');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            filtros.busqueda = e.target.value;
            aplicarFiltros();
        });
    }

    // Filtro de categoría
    const selectCategoria = document.querySelector('select[name="categoria"]');
    if (selectCategoria) {
        selectCategoria.addEventListener('change', (e) => {
            filtros.categoria = e.target.value;
            aplicarFiltros();
        });
    }

    // Filtro de precio
    const inputMin = document.querySelector('#min, input[name="min"]');
    const inputMax = document.querySelector('#max, input[name="max"]');
    
    if (inputMin) {
        inputMin.addEventListener('input', (e) => {
            filtros.precioMin = parseFloat(e.target.value) || 0;
            aplicarFiltros();
        });
    }
    
    if (inputMax) {
        inputMax.addEventListener('input', (e) => {
            filtros.precioMax = parseFloat(e.target.value) || 10000;
            aplicarFiltros();
        });
    }

    // Ordenamiento
    const selectOrden = document.querySelector('select[name="orden"]');
    if (selectOrden) {
        selectOrden.addEventListener('change', (e) => {
            filtros.orden = e.target.value;
            aplicarFiltros();
        });
    }

    // Botón restablecer datos
    const btnRestablecer = document.getElementById('btnRestablecer');
    if (btnRestablecer) {
        btnRestablecer.addEventListener('click', restablecerDatos);
    }
}

// Renderizar categorías en el filtro
function renderizarCategoriasFiltro() {
    const selectCat = document.querySelector('select[name="categoria"]');
    if (selectCat) {
        selectCat.innerHTML = '<option value="todas">Todas las categorías</option>';
        categorias.forEach(cat => {
            selectCat.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
        });
    }
}

// Aplicar todos los filtros
function aplicarFiltros() {
    paginaActual = 1; // Resetear a primera página
    productosFiltrados = productos.filter(producto => {
        // Filtro de búsqueda
        const coincideBusqueda = producto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                                 producto.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
        
        // Filtro de categoría
        const coincideCategoria = filtros.categoria === 'todas' || 
                                  producto.categoriaId === parseInt(filtros.categoria);
        
        // Filtro de precio
        const coincidePrecio = producto.precio >= filtros.precioMin && 
                               producto.precio <= filtros.precioMax;
        
        return coincideBusqueda && coincideCategoria && coincidePrecio;
    });

    // Aplicar ordenamiento
    ordenarProductos();
    
    // Renderizar productos y actualizar indicadores
    renderizarProductos();
    actualizarIndicadores();
}

// Ordenar productos
function ordenarProductos() {
    switch(filtros.orden) {
        case 'precio-asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre':
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nuevo':
            productosFiltrados.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
            break;
        case 'mejor':
            productosFiltrados.sort((a, b) => b.calificacion - a.calificacion);
            break;
        default:
            // relevancia (sin cambios)
            break;
    }
}

// Renderizar productos
function renderizarProductos() {
    const contenedorGrid = document.querySelector('.productos-grid');
    const contenedorTabla = document.querySelector('.tabla-wrap tbody');
    
    if (productosFiltrados.length === 0) {
        if (contenedorGrid) {
            contenedorGrid.innerHTML = generarMensajeSinResultados();
        }
        if (contenedorTabla) {
            contenedorTabla.innerHTML = `<tr><td colspan="8">${generarMensajeSinResultados()}</td></tr>`;
        }
        renderizarPaginacion(0);
        return;
    }

    // Calcular productos de la página actual
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    // Renderizar vista de tarjetas
    if (contenedorGrid) {
        contenedorGrid.innerHTML = productosPagina.map(p => generarTarjetaProducto(p)).join('');
    }

    // Renderizar vista de tabla
    if (contenedorTabla) {
        contenedorTabla.innerHTML = productosPagina.map(p => generarFilaProducto(p)).join('');
    }

    // Renderizar paginación
    renderizarPaginacion(productosFiltrados.length);
}

// Renderizar controles de paginación
function renderizarPaginacion(totalProductos) {
    const contenedorPaginacion = document.querySelector('.tabla-wrap tfoot td');
    if (!contenedorPaginacion) return;

    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    
    if (totalPaginas <= 1) {
        contenedorPaginacion.innerHTML = `Mostrando ${totalProductos} productos`;
        return;
    }

    let html = 'Página: ';
    
    // Botón anterior
    if (paginaActual > 1) {
        html += `<a href="#" onclick="cambiarPagina(${paginaActual - 1}); return false;">← Anterior</a> `;
    }

    // Páginas
    const rango = 2; // Cuántas páginas mostrar a cada lado de la actual
    let inicio = Math.max(1, paginaActual - rango);
    let fin = Math.min(totalPaginas, paginaActual + rango);

    if (inicio > 1) {
        html += `<a href="#" onclick="cambiarPagina(1); return false;">1</a> `;
        if (inicio > 2) html += '… ';
    }

    for (let i = inicio; i <= fin; i++) {
        if (i === paginaActual) {
            html += `<a href="#" class="enlace-activo" onclick="return false;">${i}</a> `;
        } else {
            html += `<a href="#" onclick="cambiarPagina(${i}); return false;">${i}</a> `;
        }
    }

    if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) html += '… ';
        html += `<a href="#" onclick="cambiarPagina(${totalPaginas}); return false;">${totalPaginas}</a> `;
    }

    // Botón siguiente
    if (paginaActual < totalPaginas) {
        html += `<a href="#" onclick="cambiarPagina(${paginaActual + 1}); return false;">Siguiente →</a>`;
    }

    contenedorPaginacion.innerHTML = html;
}

// Cambiar página
function cambiarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    renderizarProductos();
    
    // Scroll al inicio de los productos
    const catalogo = document.getElementById('catalogo-layout');
    if (catalogo) {
        catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Ver detalle del producto
function verDetalleProducto(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    const categoria = obtenerNombreCategoria(producto.categoriaId);
    const precioHTML = producto.precioAnterior 
        ? `${formatearPrecio(producto.precio)} <s>${formatearPrecio(producto.precioAnterior)}</s> (${producto.descuento}% OFF)`
        : formatearPrecio(producto.precio);

    Swal.fire({
        title: producto.nombre,
        html: `
            <div style="text-align:left;">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%;max-width:300px;margin:0 auto 20px;display:block;border-radius:8px;" onerror="this.src='../img/logoCarritoShopEasy.png'">
                <p><strong>Categoría:</strong> ${categoria}</p>
                <p><strong>Precio:</strong> ${precioHTML}</p>
                <p><strong>Calificación:</strong> ${generarEstrellas(producto.calificacion)} (${producto.resenas} reseñas)</p>
                <p><strong>Stock:</strong> ${producto.stock > 0 ? producto.stock + ' unidades' : 'Agotado'}</p>
                <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                ${generarBadgeStock(producto.stock)}
            </div>
        `,
        width: 600,
        showCancelButton: producto.stock > 0,
        confirmButtonText: producto.stock > 0 ? 'Agregar al carrito' : 'Cerrar',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#007bff',
    }).then((result) => {
        if (result.isConfirmed && producto.stock > 0) {
            agregarAlCarrito(id);
        }
    });
}

// Agregar al carrito
function agregarAlCarrito(id) {
    // Verificar si el usuario está logueado
    const sesion = obtenerUsuarioLogueado();
    
    if (!sesion || !sesion.email) {
        Swal.fire({
            icon: 'warning',
            title: 'Inicia sesión para continuar',
            html: 'Debes iniciar sesión para agregar productos al carrito',
            showCancelButton: true,
            confirmButtonText: 'Ir a Login',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#007bff'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '../login/login.html';
            }
        });
        return;
    }

    const producto = obtenerProductoPorId(id);
    if (!producto || producto.stock === 0) return;

    // Obtener carrito actual
    let carrito = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
    
    // Verificar si ya existe
    const existe = carrito.find(item => item.id === id);
    
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    // Guardar en storage
    guardarEnStorage(STORAGE_KEYS.CARRITO, carrito);

    // Notificación
    Toastify({
        text: `${producto.nombre} agregado al carrito`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    // Actualizar contador del carrito en el nav
    actualizarContadorCarrito();
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const enlaceCarrito = document.querySelector('a[href*="carrito"]');
    if (enlaceCarrito) {
        const textoActual = enlaceCarrito.textContent;
        enlaceCarrito.innerHTML = enlaceCarrito.innerHTML.replace(/\(\d+\)/, `(${total})`);
        if (!textoActual.includes('(')) {
            enlaceCarrito.innerHTML += ` (${total})`;
        }
    }
}

// Actualizar indicadores
function actualizarIndicadores() {
    const resultadoTexto = document.querySelector('.resultado-busqueda');
    if (resultadoTexto) {
        const categoriaTexto = filtros.categoria !== 'todas' 
            ? obtenerNombreCategoria(parseInt(filtros.categoria))
            : 'Todas las categorías';
        
        const inicio = (paginaActual - 1) * productosPorPagina + 1;
        const fin = Math.min(inicio + productosPorPagina - 1, productosFiltrados.length);
        
        if (productosFiltrados.length > 0) {
            resultadoTexto.innerHTML = `Mostrando <strong>${inicio}-${fin}</strong> de <strong>${productosFiltrados.length}</strong> productos en <strong>${categoriaTexto}</strong>`;
        } else {
            resultadoTexto.innerHTML = `No se encontraron productos en <strong>${categoriaTexto}</strong>`;
        }
    }
}


// Aplicar filtros automáticamente (para los nuevos controles)
function aplicarFiltrosAuto() {
    aplicarFiltros();
}

// Limpiar todos los filtros
function limpiarFiltros() {
    // Resetear el formulario
    const form = document.getElementById('form-filtros');
    if (form) {
        form.reset();
    }

    // Resetear variables de filtros
    filtros = {
        busqueda: '',
        categoria: 'todas',
        precioMin: 0,
        precioMax: 10000,
        orden: 'relevancia'
    };

    // Marcar el radio button de 4 estrellas por defecto
    const radio4 = document.querySelector('input[name="stars"][value="4"]');
    if (radio4) {
        radio4.checked = true;
    }

    // Marcar checkbox de stock por defecto
    const checkStock = document.querySelector('input[name="stock"]');
    if (checkStock) {
        checkStock.checked = true;
    }

    // Aplicar filtros
    aplicarFiltros();

    // Mostrar notificación
    Toastify({
        text: "Filtros restablecidos",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}


// Toggle filtros en móviles (drawer)
function toggleFiltrosMobile() {
    const sidebar = document.getElementById('sidebar-filtros');
    const overlay = document.querySelector('.filtros-overlay');
    const body = document.body;

    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevenir scroll del body cuando el drawer está abierto
        if (sidebar.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
}

// Cerrar drawer al aplicar filtros en móvil
function aplicarFiltrosYCerrar() {
    aplicarFiltros();
    
    // Si estamos en móvil, cerrar el drawer
    if (window.innerWidth < 768) {
        toggleFiltrosMobile();
    }
}

// Cerrar drawer al presionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar-filtros');
        if (sidebar && sidebar.classList.contains('active')) {
            toggleFiltrosMobile();
        }
    }
});


// Cambiar entre vista grid y tabla
function cambiarVista(vista) {
    const grid = document.querySelector('.productos-grid');
    const tabla = document.querySelector('.tabla-wrap');
    const btnGrid = document.querySelector('.btn-vista[data-vista="grid"]');
    const btnTabla = document.querySelector('.btn-vista[data-vista="tabla"]');

    if (vista === 'grid') {
        // Mostrar grid, ocultar tabla
        grid.classList.add('vista-activa');
        grid.classList.remove('vista-oculta');
        tabla.classList.add('vista-oculta');
        tabla.classList.remove('vista-activa');
        
        // Actualizar botones
        btnGrid.classList.add('active');
        btnTabla.classList.remove('active');
        
        // Guardar preferencia
        localStorage.setItem('vista_catalogo', 'grid');
    } else {
        // Mostrar tabla, ocultar grid
        tabla.classList.add('vista-activa');
        tabla.classList.remove('vista-oculta');
        grid.classList.add('vista-oculta');
        grid.classList.remove('vista-activa');
        
        // Actualizar botones
        btnTabla.classList.add('active');
        btnGrid.classList.remove('active');
        
        // Guardar preferencia
        localStorage.setItem('vista_catalogo', 'tabla');
    }

    // Notificación
    const vistaTexto = vista === 'grid' ? 'Cuadrícula' : 'Tabla';
    Toastify({
        text: `Vista cambiada a: ${vistaTexto}`,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #667eea, #764ba2)",
        }
    }).showToast();
}

// Cargar vista preferida del usuario al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const vistaGuardada = localStorage.getItem('vista_catalogo') || 'grid';
    if (vistaGuardada === 'tabla') {
        cambiarVista('tabla');
    }
});
