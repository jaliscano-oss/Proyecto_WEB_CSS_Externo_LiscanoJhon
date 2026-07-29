// home.js - Lógica de la página de inicio

document.addEventListener('DOMContentLoaded', async () => {
    mostrarLoaderBienvenida();
    await cargarDatos();
    renderizarProductosDestacados();
    renderizarCategorias();
    cargarDatosClima();
    actualizarContadorCarrito();
    actualizarNavbarUsuario();
    inicializarAnimaciones();
    mostrarBannerBienvenida();
    actualizarCarritoFlotante();
    
    // Evento para restablecer datos
    const btnRestablecer = document.getElementById('btnRestablecer');
    if (btnRestablecer) {
        btnRestablecer.addEventListener('click', restablecerDatos);
    }
});

// Mostrar loader de bienvenida
function mostrarLoaderBienvenida() {
    const loader = document.getElementById('welcome-loader');
    if (!loader) return;

    // Ocultar loader después de 2 segundos
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Remover del DOM después de la animación
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 2000);
}

// Mostrar banner de bienvenida
function mostrarBannerBienvenida() {
    // Verificar si ya se mostró antes en esta sesión
    const bannerMostrado = sessionStorage.getItem('banner_mostrado');
    
    if (!bannerMostrado) {
        setTimeout(() => {
            const banner = document.getElementById('notification-banner');
            if (banner) {
                banner.classList.add('show');
                sessionStorage.setItem('banner_mostrado', 'true');
                
                // Auto-ocultar después de 10 segundos
                setTimeout(() => {
                    cerrarNotificacion();
                }, 10000);
            }
        }, 3000); // Mostrar 3 segundos después de cargar
    }
}

// Cerrar notificación
function cerrarNotificacion() {
    const banner = document.getElementById('notification-banner');
    if (banner) {
        banner.classList.remove('show');
    }
}

// Inicializar animaciones
function inicializarAnimaciones() {
    // Intersection Observer para animar elementos al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observar secciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Animar tarjetas
    document.querySelectorAll('.tarjeta').forEach((tarjeta, index) => {
        tarjeta.style.animationDelay = `${index * 0.1}s`;
        tarjeta.classList.add('fade-in');
    });
}

// Actualizar carrito flotante
function actualizarCarritoFlotante() {
    const carrito = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const badge = document.getElementById('floating-cart-badge');
    if (badge) {
        badge.textContent = total;
        if (total > 0) {
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
}

// Renderizar productos destacados en el home
function renderizarProductosDestacados() {
    const contenedor = document.querySelector('#productos-destacados .grupo-tarjetas');
    if (!contenedor) return;

    // Tomar los 3 productos con mejor calificación
    const destacados = [...productos]
        .sort((a, b) => b.calificacion - a.calificacion)
        .slice(0, 6); // Aumentado a 6 productos

    contenedor.innerHTML = destacados.map(producto => {
        const categoria = obtenerNombreCategoria(producto.categoriaId);
        const imgSrc = producto.imagen.replace('../', '');
        
        return `
            <article class="tarjeta">
                <div style="position: relative;">
                    <img src="${imgSrc}" alt="${producto.nombre}" onerror="this.src='img/logoCarritoShopEasy.png'">
                    ${producto.descuento > 0 ? `
                        <span style="position: absolute; top: 10px; right: 10px; background: #dc3545; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">
                            -${producto.descuento}%
                        </span>
                    ` : ''}
                </div>
                <h3 style="font-size: 1.1em; margin: 15px 0 10px 0;">${producto.nombre}</h3>
                <p style="color: #666; font-size: 0.9em;">${categoria}</p>
                <div style="margin: 10px 0;">
                    <span style="color: #ffa500;">${generarEstrellas(producto.calificacion)}</span>
                    <span style="color: #666; font-size: 0.85em;">(${producto.resenas})</span>
                </div>
                <p style="font-size: 1.3em; color: #007bff; font-weight: bold; margin: 10px 0;">
                    ${formatearPrecio(producto.precio)}
                    ${producto.precioAnterior ? `<s style="color: #999; font-size: 0.7em; font-weight: normal;">${formatearPrecio(producto.precioAnterior)}</s>` : ''}
                </p>
                <p class="nota" style="font-size: 0.85em;">Stock: ${producto.stock} unidades</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="verDetalleDesdeHome(${producto.id})" style="flex: 1; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        <i class="fa-solid fa-eye"></i> Ver
                    </button>
                    ${producto.stock > 0 ? `
                        <button onclick="agregarAlCarritoHome(${producto.id})" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fa-solid fa-cart-plus"></i> Agregar
                        </button>
                    ` : `
                        <button disabled style="flex: 1; padding: 8px; background: #ddd; color: #999; border: none; border-radius: 5px;">
                            Agotado
                        </button>
                    `}
                </div>
            </article>
        `;
    }).join('');
}

// Renderizar categorías dinámicamente
function renderizarCategorias() {
    const contenedor = document.querySelector('#categorias .grupo-tarjetas');
    if (!contenedor) return;

    contenedor.innerHTML = categorias.map(cat => `
        <article class="tarjeta">
            <h3>${cat.nombre}</h3>
            <img src="${cat.imagen}" alt="${cat.nombre}">
            <p>${cat.descripcion}</p>
            <button><a href="catalogo/catalogo.html?categoria=${cat.id}">Ver productos</a></button>
        </article>
    `).join('');
}

// Ver detalle desde home
function verDetalleDesdeHome(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    const categoria = obtenerNombreCategoria(producto.categoriaId);
    
    Swal.fire({
        title: producto.nombre,
        html: `
            <div style="text-align:left;">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%;max-width:300px;margin:0 auto 20px;display:block;border-radius:8px;" onerror="this.src='img/logoCarritoShopEasy.png'">
                <p><strong>Categoría:</strong> ${categoria}</p>
                <p><strong>Precio:</strong> ${formatearPrecio(producto.precio)}</p>
                <p><strong>Calificación:</strong> ${generarEstrellas(producto.calificacion)} (${producto.resenas})</p>
                <p><strong>Stock:</strong> ${producto.stock} unidades</p>
                <p>${producto.descripcion}</p>
            </div>
        `,
        width: 600,
        showCancelButton: producto.stock > 0,
        confirmButtonText: producto.stock > 0 ? 'Agregar al carrito' : 'Cerrar',
        cancelButtonText: 'Cerrar'
    }).then((result) => {
        if (result.isConfirmed && producto.stock > 0) {
            agregarAlCarritoHome(id);
        }
    });
}

// Agregar al carrito desde home
function agregarAlCarritoHome(id) {
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
                window.location.href = 'login/login.html';
            }
        });
        return;
    }

    const producto = obtenerProductoPorId(id);
    if (!producto) return;

    let carrito = obtenerDeStorage(STORAGE_KEYS.CARRITO) || [];
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

    guardarEnStorage(STORAGE_KEYS.CARRITO, carrito);

    Toastify({
        text: `${producto.nombre} agregado al carrito`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    actualizarContadorCarrito();
    actualizarCarritoFlotante();
}

// Cargar datos del clima
async function cargarDatosClima() {
    const widget = document.getElementById('widget-clima');
    if (!widget) return;

    // Renderizar la estructura del widget de clima
    widget.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-body p-4">
                <h2 class="text-center mb-4 text-shopeasy">
                    <i class="fa-solid fa-cloud-sun me-2"></i>Clima en Ecuador
                </h2>
                <p class="text-center text-muted mb-4">Consulta el clima actual en las principales ciudades del país</p>
                
                <div class="d-flex gap-2 justify-content-center flex-wrap mb-4">
                    <button class="btn btn-primary" onclick="cambiarCiudadClima('Santo Domingo')">
                        <i class="fa-solid fa-location-dot me-1"></i>Santo Domingo
                    </button>
                    <button class="btn btn-outline-primary" onclick="cambiarCiudadClima('Quevedo')">
                        <i class="fa-solid fa-location-dot me-1"></i>Quevedo
                    </button>
                    <button class="btn btn-outline-primary" onclick="cambiarCiudadClima('Quito')">
                        <i class="fa-solid fa-location-dot me-1"></i>Quito
                    </button>
                    <button class="btn btn-outline-primary" onclick="cambiarCiudadClima('Guayaquil')">
                        <i class="fa-solid fa-location-dot me-1"></i>Guayaquil
                    </button>
                </div>
                
                <div id="datos-clima" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando clima...</span>
                    </div>
                    <p class="mt-2 text-muted">Cargando información del clima...</p>
                </div>
            </div>
        </div>
    `;

    // Cargar clima por defecto
    cambiarCiudadClima('Santo Domingo');
}

// Cambiar ciudad del clima
async function cambiarCiudadClima(ciudad) {
    const contenedor = document.getElementById('datos-clima');
    if (!contenedor) return;

    try {
        // Mostrar spinner mientras carga
        contenedor.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando clima...</span>
            </div>
            <p class="mt-2 text-muted">Obteniendo datos de ${ciudad}...</p>
        `;
        
        const clima = await obtenerClima(ciudad);
        const interpretacion = interpretarCodigoClima(clima.codigoClima);

        contenedor.innerHTML = `
            <div class="bg-light p-4 rounded">
                <h3 class="text-center mb-4">
                    <i class="fa-solid fa-location-dot text-shopeasy me-2"></i>${clima.ciudad}
                    <span class="fs-1 ms-2">${interpretacion.icono}</span>
                </h3>
                <div class="row g-3 text-center">
                    <div class="col-6 col-md-3">
                        <div class="p-3 bg-white rounded shadow-sm">
                            <i class="fa-solid fa-temperature-half text-danger fs-3 mb-2 d-block"></i>
                            <p class="mb-1 text-muted small">Temperatura</p>
                            <p class="mb-0 fs-4 fw-bold text-shopeasy">${clima.temperatura}°C</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="p-3 bg-white rounded shadow-sm">
                            <i class="fa-solid fa-droplet text-primary fs-3 mb-2 d-block"></i>
                            <p class="mb-1 text-muted small">Humedad</p>
                            <p class="mb-0 fs-4 fw-bold text-shopeasy">${clima.humedad}%</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="p-3 bg-white rounded shadow-sm">
                            <i class="fa-solid fa-wind text-info fs-3 mb-2 d-block"></i>
                            <p class="mb-1 text-muted small">Viento</p>
                            <p class="mb-0 fs-4 fw-bold text-shopeasy">${clima.velocidadViento} km/h</p>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="p-3 bg-white rounded shadow-sm">
                            <i class="fa-solid fa-cloud text-secondary fs-3 mb-2 d-block"></i>
                            <p class="mb-1 text-muted small">Condición</p>
                            <p class="mb-0 fw-bold text-shopeasy">${interpretacion.texto}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Actualizar botones activos (incluir texto del icono en comparación)
        document.querySelectorAll('#widget-clima .btn').forEach(btn => {
            const btnTexto = btn.textContent.trim();
            if (btnTexto.includes(ciudad)) {
                btn.className = 'btn btn-primary';
            } else {
                btn.className = 'btn btn-outline-primary';
            }
        });

    } catch (error) {
        contenedor.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fa-solid fa-circle-exclamation me-2"></i>
                Error al cargar el clima de ${ciudad}. Por favor, intenta de nuevo.
            </div>
        `;
        console.error('Error:', error);
    }
}

// Cerrar sesión desde home
function cerrarSesionHome() {
    cerrarSesion();
}
