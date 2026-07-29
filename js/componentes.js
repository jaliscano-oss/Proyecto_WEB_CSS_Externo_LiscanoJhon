// componentes.js - Funciones para generar componentes dinámicos

// Mostrar indicador de carga
function mostrarCargando(mostrar) {
    let loader = document.getElementById('loader-global');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader-global';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: rgba(255,255,255,0.95);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        loader.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 mb-0">Cargando datos...</p>
        `;
        document.body.appendChild(loader);
    }
    
    loader.style.display = mostrar ? 'block' : 'none';
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
}

// Generar estrellas de calificación
function generarEstrellas(calificacion) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= calificacion) {
            html += '★';
        } else {
            html += '☆';
        }
    }
    return html;
}

// Calcular precio con descuento
function calcularPrecioConDescuento(precio, descuento) {
    return precio - (precio * descuento / 100);
}

// Formatear precio
function formatearPrecio(precio) {
    return `$${parseFloat(precio).toFixed(2)}`;
}

// Generar badge de stock
function generarBadgeStock(stock) {
    if (stock === 0 || stock === 'agotado') {
        return '<span class="badge badge-rojo">Agotado</span>';
    } else if (stock <= 5) {
        return `<span class="badge badge-amarillo">Últimas ${stock}</span>`;
    } else {
        return '<span class="badge badge-verde">Disponible</span>';
    }
}

// Generar tarjeta de producto
function generarTarjetaProducto(producto) {
    const categoria = obtenerNombreCategoria(producto.categoriaId);
    const precioFinal = producto.descuento > 0 
        ? calcularPrecioConDescuento(producto.precio, producto.descuento) 
        : producto.precio;
    
    // Determinar ruta base según ubicación
    const enSubcarpeta = window.location.pathname.includes('/catalogo/') || 
                         window.location.pathname.includes('/registro/') ||
                         window.location.pathname.includes('/login/');
    const rutaBase = enSubcarpeta ? '../' : '';
    const imgSrc = producto.imagen.replace('../', '');
    
    let precioHTML = `<p class="precio">${formatearPrecio(precioFinal)}`;
    if (producto.precioAnterior) {
        precioHTML += ` <s style="color:#888;font-weight:normal;font-size:0.85em">${formatearPrecio(producto.precioAnterior)}</s>`;
    }
    precioHTML += `</p>`;

    return `
        <article class="producto-card" data-id="${producto.id}">
            <img src="${rutaBase}${imgSrc}" alt="${producto.nombre}" onerror="this.src='${rutaBase}img/logoCarritoShopEasy.png'">
            <h3>${producto.nombre}</h3>
            <p>${categoria}</p>
            ${precioHTML}
            ${generarBadgeStock(producto.stock)}
            <div class="acciones">
                <button class="btn-ver" onclick="verDetalleProducto(${producto.id})">Ver</button>
                ${producto.stock > 0 ? `<button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">Agregar</button>` : ''}
            </div>
        </article>
    `;
}

// Generar fila de tabla de producto
function generarFilaProducto(producto) {
    const categoria = obtenerNombreCategoria(producto.categoriaId);
    
    // Determinar ruta base según ubicación
    const enSubcarpeta = window.location.pathname.includes('/catalogo/') || 
                         window.location.pathname.includes('/registro/') ||
                         window.location.pathname.includes('/login/');
    const rutaBase = enSubcarpeta ? '../' : '';
    const imgSrc = producto.imagen.replace('../', '');
    
    return `
        <tr data-id="${producto.id}">
            <td>
                <img src="${rutaBase}${imgSrc}" alt="${producto.nombre}" style="width:50px;height:50px;object-fit:cover;margin-right:10px;border-radius:5px;" onerror="this.src='${rutaBase}img/logoCarritoShopEasy.png'">
                <a href="#" onclick="verDetalleProducto(${producto.id}); return false;">${producto.nombre}</a>
            </td>
            <td>${categoria}</td>
            <td><strong>${formatearPrecio(producto.precio)}</strong></td>
            <td>${producto.precioAnterior ? `<s>${formatearPrecio(producto.precioAnterior)}</s>` : '—'}</td>
            <td>${producto.descuento > 0 ? producto.descuento + '%' : '—'}</td>
            <td>${generarEstrellas(producto.calificacion)} (${producto.resenas})</td>
            <td>${generarBadgeStock(producto.stock)}</td>
            <td>
                <button class="btn-ver" onclick="verDetalleProducto(${producto.id})">Ver</button>
                ${producto.stock > 0 ? `<button class="btn-agregar mt-1" onclick="agregarAlCarrito(${producto.id})">Agregar</button>` : ''}
            </td>
        </tr>
    `;
}

// Generar mensaje de "sin resultados"
function generarMensajeSinResultados(mensaje = 'No se encontraron resultados') {
    return `
        <div class="sin-resultados" style="text-align:center;padding:40px;color:#666;">
            <i class="fa-solid fa-box-open" style="font-size:60px;color:#ddd;"></i>
            <h3 style="margin-top:20px;">${mensaje}</h3>
            <p>Intenta con otros términos de búsqueda o filtros</p>
        </div>
    `;
}

// Actualizar navbar con información del usuario (compartida entre todas las páginas)
function actualizarNavbarUsuario() {
    const sesion = obtenerUsuarioLogueado();
    const navbarNav = document.querySelector('.navbar-nav');
    
    if (!navbarNav) return;
    
    // Buscar los items de login y registro
    const loginItem = navbarNav.querySelector('a[href*="login"]')?.parentElement;
    const registroItem = navbarNav.querySelector('a[href*="registro"]')?.parentElement;
    
    if (sesion && sesion.email) {
        // Usuario logueado - ocultar login y registro
        if (loginItem) loginItem.style.display = 'none';
        if (registroItem) registroItem.style.display = 'none';
        
        // Verificar si el dropdown ya existe
        const existingDropdown = document.getElementById('usuario-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Agregar dropdown de usuario
        const userDropdown = document.createElement('li');
        userDropdown.className = 'nav-item dropdown';
        userDropdown.id = 'usuario-dropdown';
        
        // Determinar icono y opciones según el rol
        const iconoUsuario = sesion.rol === 'administrador' 
            ? '<i class="fa-solid fa-user-shield"></i>' 
            : '<i class="fa-solid fa-user-circle"></i>';
        
        const badgeRol = sesion.rol === 'administrador'
            ? '<span class="badge bg-danger ms-2">Admin</span>'
            : '';
        
        // Determinar ruta base según ubicación
        const enSubcarpeta = window.location.pathname.includes('/catalogo/') || 
                             window.location.pathname.includes('/carrito/') ||
                             window.location.pathname.includes('/pago/') ||
                             window.location.pathname.includes('/registro/') ||
                             window.location.pathname.includes('/login/');
        const rutaBase = enSubcarpeta ? '../' : '';
        
        const opcionesAdmin = sesion.rol === 'administrador' ? `
            <li>
                <h6 class="dropdown-header text-danger">
                    <i class="fa-solid fa-shield-halved"></i> Administrador
                </h6>
            </li>
            <li><span class="dropdown-item-text small text-muted">${sesion.email}</span></li>
            <li><hr class="dropdown-divider"></li>
            <li>
                <a class="dropdown-item" href="${rutaBase}admin.html">
                    <i class="fa-solid fa-gauge-high text-primary"></i> Panel de Administración
                </a>
            </li>
            <li><hr class="dropdown-divider"></li>
        ` : `
            <li><h6 class="dropdown-header">${sesion.nombres} ${sesion.apellidos}</h6></li>
            <li><span class="dropdown-item-text small text-muted">${sesion.email}</span></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#"><i class="fa-solid fa-user"></i> Mi Perfil</a></li>
            <li><a class="dropdown-item" href="#"><i class="fa-solid fa-shopping-bag"></i> Mis Pedidos</a></li>
            <li><hr class="dropdown-divider"></li>
        `;
        
        userDropdown.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${iconoUsuario} ${sesion.nombres}${badgeRol}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                ${opcionesAdmin}
                <li>
                    <a class="dropdown-item text-danger" href="#" onclick="cerrarSesion(); return false;">
                        <i class="fa-solid fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </li>
            </ul>
        `;
        navbarNav.appendChild(userDropdown);
        
    } else {
        // Usuario no logueado - mostrar login y registro
        if (loginItem) loginItem.style.display = 'block';
        if (registroItem) registroItem.style.display = 'block';
        
        // Remover dropdown si existe
        const userDropdown = document.getElementById('usuario-dropdown');
        if (userDropdown) userDropdown.remove();
    }
}


// Cerrar sesión (función compartida)
function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEYS.SESION);
    
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: "✅ Sesión cerrada correctamente",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }
        }).showToast();
    }
    
    // Redirigir al login o recargar
    setTimeout(() => {
        const enSubcarpeta = window.location.pathname.includes('/catalogo/') || 
                             window.location.pathname.includes('/carrito/') ||
                             window.location.pathname.includes('/pago/') ||
                             window.location.pathname.includes('/admin');
        
        if (enSubcarpeta || window.location.pathname.includes('admin.html')) {
            const rutaBase = window.location.pathname.includes('/admin') ? '' : '../';
            window.location.href = rutaBase + 'login/login.html';
        } else {
            location.reload();
        }
    }, 500);
}

// Obtener usuario logueado (función compartida)
function obtenerUsuarioLogueado() {
    return obtenerDeStorage(STORAGE_KEYS.SESION);
}

// Verificar si usuario está logueado
function estaLogueado() {
    const sesion = obtenerUsuarioLogueado();
    return sesion !== null && sesion.email;
}

// Requerir autenticación (para páginas protegidas)
function requerirAutenticacion(rolesPermitidos = []) {
    const sesion = obtenerUsuarioLogueado();
    
    if (!sesion || !sesion.email) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'warning',
                title: 'Acceso restringido',
                text: 'Debes iniciar sesión para acceder a esta página',
                confirmButtonText: 'Ir a Login'
            }).then(() => {
                window.location.href = 'login/login.html';
            });
        } else {
            window.location.href = 'login/login.html';
        }
        return false;
    }
    
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(sesion.rol)) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'No tienes permisos para acceder a esta página',
                confirmButtonText: 'Volver'
            }).then(() => {
                window.history.back();
            });
        } else {
            window.history.back();
        }
        return false;
    }
    
    return true;
}

// Actualizar contador del carrito en el navbar
function actualizarContadorCarrito() {
    const carrito = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const enlaceCarrito = document.querySelector('a[href*="carrito"]');
    if (enlaceCarrito) {
        const textoActual = enlaceCarrito.textContent;
        // Remover contador anterior si existe
        const textoLimpio = textoActual.replace(/\s*\(\d+\)/, '');
        // Agregar nuevo contador
        enlaceCarrito.textContent = total > 0 ? `${textoLimpio} (${total})` : textoLimpio;
    }
}
