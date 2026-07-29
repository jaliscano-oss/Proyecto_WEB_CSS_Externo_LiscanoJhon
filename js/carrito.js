// carrito.js - Lógica completa del carrito de compras

let carritoItems = [];
let descuentoAplicado = 0;
let codigoCuponActual = '';

// Cupones válidos
const CUPONES = {
    'SHOP20': { descuento: 20, tipo: 'porcentaje', descripcion: '20% de descuento' },
    'PRIMERA10': { descuento: 10, tipo: 'fijo', descripcion: '$10 de descuento' },
    'ENVIOGRATIS': { descuento: 0, tipo: 'envio', descripcion: 'Envío gratis' },
    'BIENVENIDO15': { descuento: 15, tipo: 'porcentaje', descripcion: '15% de descuento' }
};

// Costos de envío
const COSTOS_ENVIO = {
    'estandar': 0,
    'express': 4.99,
    'mismo-dia': 8.99
};

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const sesion = obtenerUsuarioLogueado();
    if (!sesion || !sesion.email) {
        Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Debes iniciar sesión para acceder al carrito',
            confirmButtonText: 'Ir a Login',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            window.location.href = '../login/login.html';
        });
        return;
    }

    await cargarDatos();
    actualizarNavbarUsuario();
    cargarCarrito();
    renderizarCarrito();
    inicializarEventos();
});

// Cargar carrito desde localStorage
function cargarCarrito() {
    carritoItems = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
    console.log('Carrito cargado:', carritoItems);
}

// Renderizar carrito completo
function renderizarCarrito() {
    const contenedor = document.getElementById('productos-carrito');
    if (!contenedor) return;

    if (carritoItems.length === 0) {
        mostrarCarritoVacio();
        return;
    }

    const html = `
        <h3 class="h5 mb-4 text-shopeasy">Productos seleccionados</h3>
        <div id="lista-items-carrito">
            ${carritoItems.map(item => generarItemCarrito(item)).join('')}
        </div>
        
        ${generarSeccionCupon()}
        ${generarResumenPedido()}
        
        <div class="d-flex flex-wrap gap-3 align-items-center mt-4">
            <button type="button" class="btn btn-success btn-lg" onclick="procederAlPago()">
                <i class="fa-solid fa-credit-card me-2"></i>Proceder al pago
            </button>
            <a href="../catalogo/catalogo.html" class="btn btn-outline-primary">
                <i class="fa-solid fa-arrow-left me-2"></i>Seguir comprando
            </a>
            <button type="button" class="btn btn-outline-danger" onclick="vaciarCarrito()">
                <i class="fa-solid fa-trash me-2"></i>Vaciar carrito
            </button>
        </div>
    `;

    contenedor.innerHTML = html;
    actualizarContadorNavbar();
}

// Generar HTML de un item del carrito
function generarItemCarrito(item) {
    const producto = obtenerProductoPorId(item.id);
    if (!producto) return '';

    const categoria = obtenerNombreCategoria(producto.categoriaId);
    const subtotal = producto.precio * item.cantidad;
    const rutaBase = '../';
    const imgSrc = producto.imagen.replace('../', '');

    return `
        <div class="card mb-3 shadow-sm producto-carrito" data-id="${item.id}">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <img src="${rutaBase}${imgSrc}" alt="${producto.nombre}" 
                             class="img-fluid rounded"
                             onerror="this.src='${rutaBase}img/logoCarritoShopEasy.png'">
                    </div>
                    <div class="col-md-9">
                        <h4 class="h5 text-shopeasy mb-2">${producto.nombre}</h4>
                        <p class="text-muted mb-2"><i class="fa-solid fa-tag me-1"></i><strong>Categoría:</strong> ${categoria}</p>
                        <p class="mb-2">
                            <strong>Precio unitario:</strong> 
                            <span class="text-primary fw-bold">${formatearPrecio(producto.precio)}</span> 
                            ${producto.precioAnterior ? `<s class="text-muted">${formatearPrecio(producto.precioAnterior)}</s>` : ''}
                        </p>
                        
                        <div class="d-flex flex-wrap gap-3 align-items-center my-3">
                            <div class="d-flex align-items-center gap-2">
                                <label for="qty-${item.id}" class="form-label mb-0">Cantidad:</label>
                                <input type="number" id="qty-${item.id}" 
                                       class="form-control form-control-sm" 
                                       value="${item.cantidad}" 
                                       min="1" 
                                       max="${producto.stock}"
                                       onchange="actualizarCantidad(${item.id}, this.value)"
                                       style="width: 80px;">
                            </div>
                            <small class="text-muted">Stock disponible: ${producto.stock}</small>
                        </div>
                        
                        <p class="mb-2">
                            <strong>Subtotal:</strong> 
                            <span class="fs-5 fw-bold text-success">${formatearPrecio(subtotal)}</span>
                        </p>
                        <div class="mb-3">
                            <span class="badge ${producto.stock > 10 ? 'bg-success' : producto.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}">
                                ${producto.stock > 10 ? 'En stock' : producto.stock > 0 ? 'Últimas unidades' : 'Agotado'}
                            </span>
                        </div>
                        
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${item.id})">
                            <i class="fa-solid fa-trash me-1"></i>Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generar sección de cupón
function generarSeccionCupon() {
    return `
        <div class="card shadow-sm mb-4" id="cupon">
            <div class="card-body">
                <h3 class="h5 mb-3"><i class="fa-solid fa-ticket me-2"></i>Código de descuento</h3>
                <div class="row g-2">
                    <div class="col-md-8">
                        <input type="text" 
                               id="codigo-cupon" 
                               class="form-control"
                               placeholder="Ingresa tu código aquí" 
                               value="${codigoCuponActual}">
                    </div>
                    <div class="col-md-4">
                        <button type="button" class="btn btn-primary w-100" onclick="aplicarCupon()">
                            <i class="fa-solid fa-check me-1"></i>Aplicar cupón
                        </button>
                    </div>
                </div>
                ${descuentoAplicado > 0 || codigoCuponActual ? `
                    <div class="alert alert-success mt-3 mb-0 d-flex justify-content-between align-items-center" role="alert">
                        <span>
                            <i class="fa-solid fa-check-circle me-2"></i> 
                            Cupón "${codigoCuponActual}" aplicado: ${CUPONES[codigoCuponActual]?.descripcion}
                        </span>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removerCupon()">
                            Quitar
                        </button>
                    </div>
                ` : `
                    <small class="text-muted d-block mt-2">
                        <i class="fa-solid fa-info-circle me-1"></i>Cupones disponibles: SHOP20, PRIMERA10, BIENVENIDO15
                    </small>
                `}
            </div>
        </div>
    `;
}

// Generar resumen del pedido
function generarResumenPedido() {
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento(subtotal);
    const metodoEnvio = document.querySelector('input[name="envio"]:checked')?.value || 'estandar';
    const costoEnvio = COSTOS_ENVIO[metodoEnvio];
    const total = subtotal - descuento + costoEnvio;

    return `
        <div class="card shadow-sm border-primary mb-4" id="resumen-pedido">
            <div class="card-body">
                <h3 class="h5 border-bottom border-shopeasy border-2 pb-2 mb-3">
                    <i class="fa-solid fa-receipt me-2"></i>Resumen del pedido
                </h3>
                <table class="table table-borderless mb-0">
                    <tbody>
                        <tr>
                            <th scope="row">Subtotal (${calcularTotalItems()} artículos)</th>
                            <td class="text-end">${formatearPrecio(subtotal)}</td>
                        </tr>
                        ${descuento > 0 ? `
                        <tr>
                            <th scope="row">Descuento aplicado</th>
                            <td class="text-end text-success">- ${formatearPrecio(descuento)}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <th scope="row">Costo de envío</th>
                            <td class="text-end">${costoEnvio === 0 ? '<span class="badge bg-success">Gratis</span>' : formatearPrecio(costoEnvio)}</td>
                        </tr>
                        <tr class="border-top border-primary border-2">
                            <th scope="row" class="fs-5">Total a pagar</th>
                            <td class="text-end"><strong class="text-primary fs-4">${formatearPrecio(total)}</strong></td>
                        </tr>
                    </tbody>
                </table>

                <!-- Método de envío -->
                <div class="mt-4">
                    <h6 class="mb-3"><i class="fa-solid fa-truck me-2"></i>Método de envío</h6>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="envio" id="envio-estandar" value="estandar" ${metodoEnvio === 'estandar' ? 'checked' : ''} onchange="renderizarCarrito()">
                        <label class="form-check-label" for="envio-estandar">
                            Envío estándar (3-5 días hábiles) — <span class="badge bg-success">Gratis</span>
                        </label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="envio" id="envio-express" value="express" ${metodoEnvio === 'express' ? 'checked' : ''} onchange="renderizarCarrito()">
                        <label class="form-check-label" for="envio-express">
                            Envío express (1-2 días hábiles) — ${formatearPrecio(COSTOS_ENVIO.express)}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="envio" id="envio-mismo-dia" value="mismo-dia" ${metodoEnvio === 'mismo-dia' ? 'checked' : ''} onchange="renderizarCarrito()">
                        <label class="form-check-label" for="envio-mismo-dia">
                            Envío mismo día (solo Santo Domingo) — ${formatearPrecio(COSTOS_ENVIO['mismo-dia'])}
                        </label>
                    </div>
                </div>

                <!-- Opciones adicionales -->
                <div class="mt-4">
                    <h6 class="mb-3"><i class="fa-solid fa-sliders me-2"></i>Opciones adicionales</h6>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" name="regalo" id="opcion-regalo" value="si">
                        <label class="form-check-label" for="opcion-regalo">
                            Envolver como regalo (+$2.00)
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="factura" id="opcion-factura" value="si">
                        <label class="form-check-label" for="opcion-factura">
                            Necesito factura con datos de empresa
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Mostrar carrito vacío
function mostrarCarritoVacio() {
    const contenedor = document.getElementById('productos-carrito');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="text-center py-5">
            <i class="fa-solid fa-cart-shopping display-1 text-muted mb-4"></i>
            <h3 class="h4 mb-3">Tu carrito está vacío</h3>
            <p class="text-muted mb-4">¡Explora nuestro catálogo y encuentra productos increíbles!</p>
            <a href="../catalogo/catalogo.html" class="btn btn-primary btn-lg">
                <i class="fa-solid fa-shopping-bag me-2"></i>Ir al catálogo
            </a>
        </div>
    `;
}

// Calcular subtotal
function calcularSubtotal() {
    return carritoItems.reduce((total, item) => {
        const producto = obtenerProductoPorId(item.id);
        return producto ? total + (producto.precio * item.cantidad) : total;
    }, 0);
}

// Calcular total de items
function calcularTotalItems() {
    return carritoItems.reduce((total, item) => total + item.cantidad, 0);
}

// Calcular descuento
function calcularDescuento(subtotal) {
    if (!codigoCuponActual || !CUPONES[codigoCuponActual]) return 0;

    const cupon = CUPONES[codigoCuponActual];
    if (cupon.tipo === 'porcentaje') {
        return subtotal * (cupon.descuento / 100);
    } else if (cupon.tipo === 'fijo') {
        return cupon.descuento;
    }
    return 0;
}

// Actualizar cantidad de un producto
function actualizarCantidad(id, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    const producto = obtenerProductoPorId(id);

    if (!producto || cantidad < 1) {
        Toastify({
            text: "Cantidad inválida",
            duration: 2000,
            style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
        }).showToast();
        return;
    }

    if (cantidad > producto.stock) {
        Toastify({
            text: `Solo hay ${producto.stock} unidades disponibles`,
            duration: 3000,
            style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
        }).showToast();
        return;
    }

    const item = carritoItems.find(i => i.id === id);
    if (item) {
        item.cantidad = cantidad;
        guardarEnStorage(STORAGE_KEYS.CARRITO, carritoItems);
        renderizarCarrito();

        Toastify({
            text: "Cantidad actualizada",
            duration: 2000,
            style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
        }).showToast();
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    const producto = obtenerProductoPorId(id);
    
    Swal.fire({
        title: '¿Eliminar producto?',
        html: `¿Quieres eliminar <strong>${producto?.nombre}</strong> del carrito?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carritoItems = carritoItems.filter(item => item.id !== id);
            guardarEnStorage(STORAGE_KEYS.CARRITO, carritoItems);
            renderizarCarrito();

            Toastify({
                text: "Producto eliminado del carrito",
                duration: 3000,
                style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
            }).showToast();
        }
    });
}

// Vaciar carrito completo
function vaciarCarrito() {
    if (carritoItems.length === 0) return;

    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carritoItems = [];
            codigoCuponActual = '';
            descuentoAplicado = 0;
            guardarEnStorage(STORAGE_KEYS.CARRITO, carritoItems);
            renderizarCarrito();

            Toastify({
                text: "Carrito vaciado",
                duration: 3000,
                style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
            }).showToast();
        }
    });
}

// Aplicar cupón
function aplicarCupon() {
    const input = document.getElementById('codigo-cupon');
    const codigo = input?.value.trim().toUpperCase();

    if (!codigo) {
        Swal.fire('Error', 'Ingresa un código de cupón', 'error');
        return;
    }

    if (!CUPONES[codigo]) {
        Swal.fire('Cupón inválido', 'El código ingresado no es válido', 'error');
        return;
    }

    codigoCuponActual = codigo;
    const cupon = CUPONES[codigo];
    renderizarCarrito();

    Toastify({
        text: `✓ Cupón aplicado: ${cupon.descripcion}`,
        duration: 4000,
        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast();
}

// Remover cupón
function removerCupon() {
    codigoCuponActual = '';
    descuentoAplicado = 0;
    renderizarCarrito();

    Toastify({
        text: "Cupón removido",
        duration: 2000,
        style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
    }).showToast();
}

// Proceder al pago
function procederAlPago() {
    if (carritoItems.length === 0) {
        Swal.fire('Carrito vacío', 'Agrega productos antes de proceder al pago', 'warning');
        return;
    }

    // Verificar stock antes de proceder
    for (const item of carritoItems) {
        const producto = obtenerProductoPorId(item.id);
        if (!producto || producto.stock < item.cantidad) {
            Swal.fire('Error', `No hay suficiente stock de ${producto?.nombre}`, 'error');
            return;
        }
    }

    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento(subtotal);
    const metodoEnvio = document.querySelector('input[name="envio"]:checked')?.value || 'estandar';
    const costoEnvio = COSTOS_ENVIO[metodoEnvio];
    const total = subtotal - descuento + costoEnvio;

    Swal.fire({
        title: 'Confirmar compra',
        html: `
            <div style="text-align: left;">
                <p><strong>Total items:</strong> ${calcularTotalItems()}</p>
                <p><strong>Subtotal:</strong> ${formatearPrecio(subtotal)}</p>
                ${descuento > 0 ? `<p><strong>Descuento:</strong> -${formatearPrecio(descuento)}</p>` : ''}
                <p><strong>Envío:</strong> ${costoEnvio === 0 ? 'Gratis' : formatearPrecio(costoEnvio)}</p>
                <hr>
                <p style="font-size: 1.2em;"><strong>Total a pagar:</strong> <span style="color: #007bff;">${formatearPrecio(total)}</span></p>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Continuar al pago',
        cancelButtonText: 'Revisar carrito'
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirigir a página de pago
            window.location.href = '../pago/pago.html';
        }
    });
}

// Actualizar contador en navbar
function actualizarContadorNavbar() {
    const total = calcularTotalItems();
    const enlaceCarrito = document.querySelector('a[href*="carrito"]');
    
    if (enlaceCarrito) {
        const textoOriginal = enlaceCarrito.innerHTML;
        enlaceCarrito.innerHTML = textoOriginal.replace(/\(\d+\)/, `(${total})`);
    }
}

// Inicializar eventos
function inicializarEventos() {
    // Los eventos ya están inline en el HTML generado
}
