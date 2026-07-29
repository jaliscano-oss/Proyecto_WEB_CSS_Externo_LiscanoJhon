// pago.js - Lógica de la página de pago

let carritoItems = [];
let metodoPagoSeleccionado = 'tarjeta';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const sesion = obtenerUsuarioLogueado();
    if (!sesion || !sesion.email) {
        Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Debes iniciar sesión para realizar una compra',
            confirmButtonText: 'Ir a Login',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            window.location.href = '../login/login.html';
        });
        return;
    }

    await cargarDatos();
    cargarCarrito();
    verificarCarrito();
    renderizarResumen();
    inicializarEventos();
});

// Cargar carrito
function cargarCarrito() {
    carritoItems = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
}

// Verificar que el carrito no esté vacío
function verificarCarrito() {
    if (carritoItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'No tienes productos en el carrito',
            confirmButtonText: 'Ir al catálogo'
        }).then(() => {
            window.location.href = '../catalogo/catalogo.html';
        });
    }
}

// Renderizar resumen del pedido
function renderizarResumen() {
    renderizarItems();
    renderizarTotales();
}

// Renderizar items del carrito
function renderizarItems() {
    const contenedor = document.getElementById('resumen-items');
    if (!contenedor) return;

    const html = carritoItems.map(item => {
        const producto = obtenerProductoPorId(item.id);
        if (!producto) return '';

        return `
            <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${producto.nombre}</strong><br>
                    <small>Cantidad: ${item.cantidad}</small>
                </div>
                <div style="text-align: right;">
                    ${formatearPrecio(producto.precio * item.cantidad)}
                </div>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = html || '<p>No hay productos</p>';
}

// Renderizar totales
function renderizarTotales() {
    const contenedor = document.getElementById('resumen-totales');
    if (!contenedor) return;

    const subtotal = carritoItems.reduce((total, item) => {
        const producto = obtenerProductoPorId(item.id);
        return producto ? total + (producto.precio * item.cantidad) : total;
    }, 0);

    const envio = 5.00; // Costo fijo de envío para demo
    const total = subtotal + envio;

    contenedor.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Subtotal:</span>
            <strong>${formatearPrecio(subtotal)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Envío:</span>
            <strong>${formatearPrecio(envio)}</strong>
        </div>
        <hr>
        <div style="display: flex; justify-content: space-between; font-size: 1.3em; margin: 10px 0;">
            <strong>Total:</strong>
            <strong style="color: #007bff;">${formatearPrecio(total)}</strong>
        </div>
    `;
}

// Inicializar eventos
function inicializarEventos() {
    // Selección de método de pago
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
            metodoPagoSeleccionado = this.getAttribute('data-method');
            
            // Mostrar/ocultar formulario de tarjeta
            const datosTarjeta = document.getElementById('datos-tarjeta');
            if (datosTarjeta) {
                datosTarjeta.style.display = metodoPagoSeleccionado === 'tarjeta' ? 'block' : 'none';
            }
        });
    });

    // Formatear número de tarjeta
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\s/g, '');
            let valorFormateado = valor.match(/.{1,4}/g)?.join(' ') || valor;
            e.target.value = valorFormateado;
            
            // Actualizar preview
            document.getElementById('preview-numero').textContent = 
                valorFormateado || '•••• •••• •••• ••••';
        });
    }

    // Actualizar preview de nombre
    const nombreTarjeta = document.getElementById('nombre-tarjeta');
    if (nombreTarjeta) {
        nombreTarjeta.addEventListener('input', function(e) {
            document.getElementById('preview-nombre').textContent = 
                e.target.value.toUpperCase() || 'NOMBRE APELLIDO';
        });
    }

    // Formatear y actualizar fecha de expiración
    const fechaExpiracion = document.getElementById('fecha-expiracion');
    if (fechaExpiracion) {
        fechaExpiracion.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length >= 2) {
                valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
            }
            e.target.value = valor;
            
            // Actualizar preview
            document.getElementById('preview-fecha').textContent = valor || 'MM/AA';
        });
    }

    // Solo números en CVV
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Confirmar pago
async function confirmarPago() {
    const form = document.getElementById('form-pago');
    
    // Validar según método de pago
    if (metodoPagoSeleccionado === 'tarjeta') {
        if (!validarFormularioTarjeta()) {
            return;
        }
    }
    
    // Validar dirección de envío
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const telefono = document.getElementById('telefono-contacto').value.trim();
    
    if (!direccion || !ciudad || !telefono) {
        Swal.fire('Error', 'Por favor completa todos los campos requeridos de envío', 'error');
        return;
    }

    // Calcular totales
    const subtotal = carritoItems.reduce((total, item) => {
        const producto = obtenerProductoPorId(item.id);
        return producto ? total + (producto.precio * item.cantidad) : total;
    }, 0);
    const envio = 5.00;
    const total = subtotal + envio;

    // Confirmar pago
    const result = await Swal.fire({
        title: '¿Confirmar pedido?',
        html: `
            <div style="text-align: left;">
                <p><strong>Método de pago:</strong> ${obtenerNombreMetodoPago()}</p>
                <p><strong>Dirección:</strong> ${direccion}, ${ciudad}</p>
                <p><strong>Total a pagar:</strong> <span style="color: #007bff; font-size: 1.3em;">${formatearPrecio(total)}</span></p>
                <hr>
                <p style="font-size: 0.9em; color: #666;">Se enviará un correo de confirmación a tu email</p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar y pagar',
        cancelButtonText: 'Revisar',
        confirmButtonColor: '#28a745'
    });

    if (result.isConfirmed) {
        procesarPago(total, direccion, ciudad, telefono);
    }
}

// Validar formulario de tarjeta
function validarFormularioTarjeta() {
    const nombreTarjeta = document.getElementById('nombre-tarjeta').value.trim();
    const numeroTarjeta = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');
    const fechaExpiracion = document.getElementById('fecha-expiracion').value;
    const cvv = document.getElementById('cvv').value;

    if (!nombreTarjeta) {
        Swal.fire('Error', 'Ingresa el nombre del titular de la tarjeta', 'error');
        return false;
    }

    if (numeroTarjeta.length < 13 || numeroTarjeta.length > 19) {
        Swal.fire('Error', 'Número de tarjeta inválido', 'error');
        return false;
    }

    if (!fechaExpiracion.match(/^\d{2}\/\d{2}$/)) {
        Swal.fire('Error', 'Fecha de expiración inválida (MM/AA)', 'error');
        return false;
    }

    // Validar que la fecha no esté vencida
    const [mes, año] = fechaExpiracion.split('/').map(n => parseInt(n));
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = parseInt(fechaActual.getFullYear().toString().slice(-2));
    
    if (año < añoActual || (año === añoActual && mes < mesActual)) {
        Swal.fire('Error', 'La tarjeta está vencida', 'error');
        return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
        Swal.fire('Error', 'CVV inválido', 'error');
        return false;
    }

    return true;
}

// Procesar pago
async function procesarPago(total, direccion, ciudad, telefono) {
    // Mostrar loader
    Swal.fire({
        title: 'Procesando pago...',
        html: 'Por favor espera mientras procesamos tu pedido',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Simular procesamiento (en producción sería una llamada a API real)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generar número de orden
    const numeroOrden = 'ORD-' + Date.now();

    // Guardar orden en localStorage
    const orden = {
        numero: numeroOrden,
        fecha: new Date().toISOString(),
        items: carritoItems,
        total: total,
        metodoPago: metodoPagoSeleccionado,
        direccion: direccion,
        ciudad: ciudad,
        telefono: telefono,
        estado: 'procesando'
    };

    let ordenes = obtenerDeStorage('shopeasy_ordenes') || [];
    ordenes.push(orden);
    guardarEnStorage('shopeasy_ordenes', ordenes);

    // Limpiar carrito
    guardarEnStorage(STORAGE_KEYS.CARRITO, []);

    // Mostrar éxito
    await Swal.fire({
        icon: 'success',
        title: '¡Pago exitoso!',
        html: `
            <div style="text-align: center;">
                <p style="font-size: 1.2em; margin: 20px 0;">Tu pedido ha sido confirmado</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Número de orden:</strong></p>
                    <p style="font-size: 1.3em; color: #007bff; margin: 5px 0;">${numeroOrden}</p>
                </div>
                <p style="color: #666; font-size: 0.9em;">
                    <i class="fa-solid fa-envelope"></i> 
                    Recibirás un email con los detalles de tu pedido
                </p>
                <p style="color: #666; font-size: 0.9em;">
                    <i class="fa-solid fa-truck"></i> 
                    Tiempo estimado de entrega: 3-5 días hábiles
                </p>
            </div>
        `,
        confirmButtonText: 'Volver al inicio',
        confirmButtonColor: '#28a745'
    });

    // Redirigir al inicio
    window.location.href = '../index.html';
}

// Obtener nombre del método de pago
function obtenerNombreMetodoPago() {
    const metodos = {
        'tarjeta': 'Tarjeta de Crédito/Débito',
        'paypal': 'PayPal',
        'efectivo': 'Pago contra entrega'
    };
    return metodos[metodoPagoSeleccionado] || 'Desconocido';
}
