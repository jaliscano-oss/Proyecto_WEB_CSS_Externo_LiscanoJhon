// admin.js - Gestión de productos (agregar, editar, eliminar)

let productoEditando = null;
let chartProductos = null;

// Inicializar navbar específico para administradores
function inicializarNavbarAdmin() {
    const sesion = obtenerUsuarioLogueado();
    if (!sesion || sesion.rol !== 'administrador') return;

    const navbarMenu = document.getElementById('navbar-menu-admin');
    if (!navbarMenu) return;

    navbarMenu.innerHTML = `
        <li class="nav-item">
            <a class="nav-link active" href="admin.html">
                <i class="fa-solid fa-gauge-high"></i> Panel Admin
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="index.html" title="Ver como comprador">
                <i class="fa-solid fa-store"></i> Ver Tienda
            </a>
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fa-solid fa-user-shield"></i> ${sesion.nombres}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <h6 class="dropdown-header">
                        <i class="fa-solid fa-shield-halved text-danger"></i> Administrador
                    </h6>
                </li>
                <li><span class="dropdown-item-text small text-muted">${sesion.email}</span></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item" href="#" onclick="limpiarStorageCompleto(); return false;">
                        <i class="fa-solid fa-broom text-warning"></i> Limpiar Storage
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <a class="dropdown-item text-danger" href="#" onclick="cerrarSesion(); return false;">
                        <i class="fa-solid fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </li>
            </ul>
        </li>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!requerirAutenticacion(['administrador'])) {
        return;
    }
    
    await cargarDatos();
    inicializarNavbarAdmin();
    inicializarAdmin();
    generarEstadisticas();
});

function inicializarAdmin() {
    renderizarTablaProductos();
    renderizarTablaUsuarios();
    renderizarTablaCategorias();
    configurarFormulario();
    cargarCategoriasSelect();
    generarEstadisticas();
    
    // Evento para restablecer datos
    const btnRestablecer = document.getElementById('btnRestablecer');
    if (btnRestablecer) {
        btnRestablecer.addEventListener('click', restablecerDatos);
    }

    // Evento para actualizar estadísticas cuando cambian tabs
    const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', () => {
            if (tab.getAttribute('href') === '#productos-tab') {
                generarEstadisticas();
            }
        });
    });
}

// Renderizar tabla de productos para administración
function renderizarTablaProductos() {
    const contenedor = document.getElementById('tabla-productos-admin');
    if (!contenedor) return;

    const html = `
        <table class="table table-hover">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${productos.map(p => `
                    <tr>
                        <td class="align-middle">${p.id}</td>
                        <td class="align-middle">
                            <img src="${p.imagen}" alt="${p.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" onerror="this.src='img/logoCarritoShopEasy.png'">
                        </td>
                        <td class="align-middle">
                            <strong>${p.nombre}</strong>
                            <br><small class="text-muted">${p.descripcion.substring(0, 50)}...</small>
                        </td>
                        <td class="align-middle">${obtenerNombreCategoria(p.categoriaId)}</td>
                        <td class="align-middle"><strong>${formatearPrecio(p.precio)}</strong></td>
                        <td class="align-middle">${p.stock}</td>
                        <td class="align-middle">${generarBadgeStock(p.stock)}</td>
                        <td class="align-middle">
                            <div class="btn-group" role="group">
                                <button class="btn btn-sm btn-primary" onclick="editarProducto(${p.id})" title="Editar">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})" title="Eliminar">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-muted mt-2">
            <i class="fa-solid fa-info-circle me-1"></i>
            Total: <strong>${productos.length}</strong> productos
        </div>
    `;

    contenedor.innerHTML = html;
}

// Mostrar formulario para nuevo producto
function mostrarFormularioNuevo() {
    productoEditando = null;
    mostrarFormularioProducto();
}

// Cargar categorías en select
function cargarCategoriasSelect() {
    const select = document.getElementById('categoria-producto');
    if (!select) return;

    select.innerHTML = categorias.map(cat => 
        `<option value="${cat.id}">${cat.nombre}</option>`
    ).join('');
}

// Mostrar formulario de producto
function mostrarFormularioProducto(producto = null) {
    const esEdicion = producto !== null;
    
    Swal.fire({
        title: esEdicion ? 'Editar Producto' : 'Nuevo Producto',
        html: `
            <form id="form-producto" class="text-start">
                <div class="mb-3">
                    <label class="form-label">Nombre *</label>
                    <input type="text" id="nombre-producto" class="form-control" value="${producto?.nombre || ''}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Categoría *</label>
                    <select id="categoria-producto" class="form-select" required>
                        ${categorias.map(cat => 
                            `<option value="${cat.id}" ${producto?.categoriaId === cat.id ? 'selected' : ''}>${cat.nombre}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Descripción *</label>
                    <textarea id="descripcion-producto" class="form-control" rows="3" required>${producto?.descripcion || ''}</textarea>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Precio *</label>
                        <input type="number" id="precio-producto" class="form-control" step="0.01" min="0" value="${producto?.precio || ''}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Stock *</label>
                        <input type="number" id="stock-producto" class="form-control" min="0" value="${producto?.stock || 0}" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Precio Anterior</label>
                        <input type="number" id="precio-anterior-producto" class="form-control" step="0.01" min="0" value="${producto?.precioAnterior || ''}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Descuento (%)</label>
                        <input type="number" id="descuento-producto" class="form-control" min="0" max="100" value="${producto?.descuento || 0}">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Calificación (1-5)</label>
                    <input type="number" id="calificacion-producto" class="form-control" min="1" max="5" value="${producto?.calificacion || 4}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Imagen URL *</label>
                    <input type="text" id="imagen-producto" class="form-control" value="${producto?.imagen || '../img/logoCarritoShopEasy.png'}" required>
                </div>
            </form>
        `,
        width: 600,
        showCancelButton: true,
        confirmButtonText: esEdicion ? 'Actualizar' : 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return validarYObtenerDatosFormulario();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (esEdicion) {
                actualizarProducto(producto.id, result.value);
            } else {
                crearProducto(result.value);
            }
        }
    });
}

// Validar y obtener datos del formulario
function validarYObtenerDatosFormulario() {
    const nombre = document.getElementById('nombre-producto').value.trim();
    const categoria = parseInt(document.getElementById('categoria-producto').value);
    const descripcion = document.getElementById('descripcion-producto').value.trim();
    const precio = parseFloat(document.getElementById('precio-producto').value);
    const stock = parseInt(document.getElementById('stock-producto').value);
    const precioAnterior = document.getElementById('precio-anterior-producto').value;
    const descuento = parseInt(document.getElementById('descuento-producto').value) || 0;
    const calificacion = parseInt(document.getElementById('calificacion-producto').value) || 4;
    const imagen = document.getElementById('imagen-producto').value.trim();

    if (!nombre || !descripcion || !precio || isNaN(stock)) {
        Swal.showValidationMessage('Por favor completa todos los campos obligatorios');
        return false;
    }

    if (precio <= 0) {
        Swal.showValidationMessage('El precio debe ser mayor a 0');
        return false;
    }

    if (stock < 0) {
        Swal.showValidationMessage('El stock no puede ser negativo');
        return false;
    }

    return {
        nombre,
        categoriaId: categoria,
        descripcion,
        precio,
        stock,
        precioAnterior: precioAnterior ? parseFloat(precioAnterior) : null,
        descuento,
        calificacion,
        resenas: Math.floor(Math.random() * 200) + 10,
        estado: stock > 0 ? 'disponible' : 'agotado',
        imagen,
        fechaRegistro: new Date().toISOString().split('T')[0]
    };
}

// Crear nuevo producto
function crearProducto(datos) {
    // Generar nuevo ID
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    
    const nuevoProducto = {
        id: nuevoId,
        ...datos
    };

    productos.push(nuevoProducto);
    guardarEnStorage(STORAGE_KEYS.PRODUCTOS, productos);

    Toastify({
        text: "✅ Producto creado exitosamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    renderizarTablaProductos();
    generarEstadisticas();
}

// Editar producto
function editarProducto(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    productoEditando = producto;
    mostrarFormularioProducto(producto);
}

// Actualizar producto
function actualizarProducto(id, datos) {
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return;

    productos[index] = {
        ...productos[index],
        ...datos
    };

    guardarEnStorage(STORAGE_KEYS.PRODUCTOS, productos);

    Toastify({
        text: "✅ Producto actualizado exitosamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    renderizarTablaProductos();
    generarEstadisticas();
}

// Eliminar producto
async function eliminarProducto(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    const resultado = await Swal.fire({
        title: '¿Eliminar producto?',
        html: `
            <p>¿Estás seguro de eliminar:</p>
            <strong>${producto.nombre}</strong>
            <p class="text-muted">Esta acción no se puede deshacer</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
        productos = productos.filter(p => p.id !== id);
        guardarEnStorage(STORAGE_KEYS.PRODUCTOS, productos);

        Toastify({
            text: "🗑️ Producto eliminado",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }
        }).showToast();

        renderizarTablaProductos();
        generarEstadisticas();
    }
}

// Configurar eventos del formulario
function configurarFormulario() {
    // Ya se maneja en las funciones individuales
}

// Generar estadísticas y gráfico
function generarEstadisticas() {
    const seccionStats = document.getElementById('estadisticas-admin');
    if (!seccionStats) return;
    
    const totalProductos = productos.length;
    const productosDisponibles = productos.filter(p => p.stock > 0).length;
    const totalUsuarios = usuarios.length;
    const precioPromedio = productos.length > 0 
        ? productos.reduce((sum, p) => sum + p.precio, 0) / productos.length 
        : 0;

    seccionStats.innerHTML = `
        <div class="col-md-6 col-lg-3">
            <div class="stats-card purple">
                <i class="fa-solid fa-box fa-2x mb-2"></i>
                <h3>${totalProductos}</h3>
                <p>Productos Totales</p>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="stats-card green">
                <i class="fa-solid fa-check-circle fa-2x mb-2"></i>
                <h3>${productosDisponibles}</h3>
                <p>Productos Disponibles</p>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="stats-card blue">
                <i class="fa-solid fa-users fa-2x mb-2"></i>
                <h3>${totalUsuarios}</h3>
                <p>Usuarios Registrados</p>
            </div>
        </div>
        <div class="col-md-6 col-lg-3">
            <div class="stats-card pink">
                <i class="fa-solid fa-dollar-sign fa-2x mb-2"></i>
                <h3>${formatearPrecio(precioPromedio)}</h3>
                <p>Precio Promedio</p>
            </div>
        </div>
    `;

    setTimeout(() => generarGraficoProductos(), 100);
}

// Renderizar tabla de usuarios
function renderizarTablaUsuarios() {
    const contenedor = document.getElementById('tabla-usuarios-admin');
    if (!contenedor) return;

    const html = `
        <table class="table table-hover">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Nacionalidad</th>
                    <th>Teléfono</th>
                    <th>Registro</th>
                </tr>
            </thead>
            <tbody>
                ${usuarios.map(u => `
                    <tr>
                        <td class="align-middle">${u.id}</td>
                        <td class="align-middle">
                            <strong>${u.nombres} ${u.apellidos}</strong>
                        </td>
                        <td class="align-middle">${u.email}</td>
                        <td class="align-middle">
                            ${u.rol === 'administrador' 
                                ? '<span class="badge bg-danger"><i class="fa-solid fa-shield me-1"></i>Administrador</span>' 
                                : '<span class="badge bg-primary"><i class="fa-solid fa-user me-1"></i>Comprador</span>'}
                        </td>
                        <td class="align-middle">
                            ${u.bandera ? `<span style="font-size: 1.5em">${u.bandera}</span>` : ''} 
                            ${u.nacionalidad || 'N/A'}
                        </td>
                        <td class="align-middle">${u.telefono || 'N/A'}</td>
                        <td class="align-middle"><small>${u.fechaRegistro || 'N/A'}</small></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="text-muted mt-2">
            <i class="fa-solid fa-info-circle me-1"></i>
            Total: <strong>${usuarios.length}</strong> usuarios 
            (${usuarios.filter(u => u.rol === 'administrador').length} administradores, 
            ${usuarios.filter(u => u.rol === 'comprador').length} compradores)
        </div>
    `;

    contenedor.innerHTML = html;
}

// Renderizar tabla de categorías
function renderizarTablaCategorias() {
    const contenedor = document.getElementById('tabla-categorias-admin');
    if (!contenedor) return;

    const html = `
        <table class="table table-hover">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Productos</th>
                </tr>
            </thead>
            <tbody>
                ${categorias.map(cat => {
                    const cantidadProductos = productos.filter(p => p.categoriaId === cat.id).length;
                    return `
                        <tr>
                            <td class="align-middle">${cat.id}</td>
                            <td class="align-middle">
                                <img src="${cat.imagen}" alt="${cat.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;" onerror="this.src='img/logoCarritoShopEasy.png'">
                            </td>
                            <td class="align-middle"><strong>${cat.nombre}</strong></td>
                            <td class="align-middle">${cat.descripcion}</td>
                            <td class="align-middle">
                                <span class="badge bg-info">${cantidadProductos} productos</span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        <div class="text-muted mt-2">
            <i class="fa-solid fa-info-circle me-1"></i>
            Total: <strong>${categorias.length}</strong> categorías
        </div>
    `;

    contenedor.innerHTML = html;
}

// Mostrar información del usuario logueado
function mostrarInfoUsuario() {
    // Esta función ya no es necesaria, se maneja en inicializarNavbarAdmin
}

// Limpiar completamente el localStorage (función para administradores)
async function limpiarStorageCompleto() {
    const resultado = await Swal.fire({
        title: '🧹 Limpiar Storage Completo',
        html: `
            <p>Esta acción eliminará <strong>TODOS</strong> los datos del localStorage:</p>
            <ul class="text-start mt-3">
                <li>Productos modificados</li>
                <li>Usuarios agregados</li>
                <li>Carritos de compra</li>
                <li>Sesiones guardadas</li>
            </ul>
            <p class="text-danger mt-3"><strong>Tendrás que iniciar sesión nuevamente.</strong></p>
            <p>¿Deseas continuar?</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, limpiar todo',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });

    if (resultado.isConfirmed) {
        // Limpiar todo el localStorage
        localStorage.clear();
        
        Swal.fire({
            title: '✅ Storage Limpiado',
            text: 'Todos los datos han sido eliminados. Serás redirigido al login.',
            icon: 'success',
            confirmButtonText: 'Entendido',
            timer: 2000
        }).then(() => {
            // Redirigir al login
            window.location.href = 'login/login.html';
        });
    }
}

// Generar gráfico con Chart.js
function generarGraficoProductos() {
    const ctx = document.getElementById('chartProductosPorCategoriaAdmin');
    if (!ctx) return;

    const datosPorCategoria = categorias.map(cat => {
        const cantidad = productos.filter(p => p.categoriaId === cat.id).length;
        return {
            categoria: cat.nombre,
            cantidad: cantidad
        };
    });

    if (chartProductos) {
        chartProductos.destroy();
    }

    chartProductos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datosPorCategoria.map(d => d.categoria),
            datasets: [{
                label: 'Cantidad de productos',
                data: datosPorCategoria.map(d => d.cantidad),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return `Productos: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Restablecer datos del sistema
async function restablecerDatos() {
    const resultado = await Swal.fire({
        title: '⚠️ Restablecer Datos',
        html: `
            <p>Esta acción eliminará todos los datos del almacenamiento local y recargará los datos originales desde los archivos JSON.</p>
            <p class="text-danger"><strong>¿Deseas continuar?</strong></p>
            <ul class="text-start mt-3">
                <li>Se restaurarán los productos originales</li>
                <li>Se restaurarán los usuarios originales</li>
                <li>Se mantendrá tu sesión actual</li>
            </ul>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, restablecer',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });

    if (resultado.isConfirmed) {
        try {
            // Obtener sesión actual antes de limpiar
            const sesionActual = obtenerUsuarioLogueado();
            
            // Limpiar storage (excepto la sesión)
            localStorage.removeItem(STORAGE_KEYS.PRODUCTOS);
            localStorage.removeItem(STORAGE_KEYS.USUARIOS);
            localStorage.removeItem(STORAGE_KEYS.CATEGORIAS);
            localStorage.removeItem(STORAGE_KEYS.CARRITO);
            
            // Recargar datos desde JSON
            await cargarDatos();
            
            // Restaurar la sesión
            if (sesionActual) {
                guardarEnStorage(STORAGE_KEYS.SESION, sesionActual);
            }
            
            // Actualizar la interfaz
            renderizarTablaProductos();
            renderizarTablaUsuarios();
            renderizarTablaCategorias();
            generarEstadisticas();
            
            Swal.fire({
                title: '✅ Datos Restablecidos',
                text: 'Los datos se han restaurado correctamente',
                icon: 'success',
                confirmButtonText: 'Entendido',
                timer: 3000
            });
            
        } catch (error) {
            console.error('Error al restablecer datos:', error);
            Swal.fire({
                title: '❌ Error',
                text: 'Hubo un problema al restablecer los datos. Por favor, recarga la página.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    }
}

// Función auxiliar para generar badge de estado según stock
function generarBadgeStock(stock) {
    if (stock === 0) {
        return '<span class="badge bg-danger">Agotado</span>';
    } else if (stock <= 5) {
        return '<span class="badge bg-warning text-dark">Bajo stock</span>';
    } else {
        return '<span class="badge bg-success">Disponible</span>';
    }
}
