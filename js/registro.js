// registro.js - Formulario de registro con selector de países

document.addEventListener('DOMContentLoaded', async () => {
    await inicializarRegistro();
    configurarEventos();
});

// Inicializar página de registro
async function inicializarRegistro() {
    try {
        mostrarCargando(true);
        await cargarPaises();
        
        if (paisesCache.length === 0) {
            throw new Error('No se pudieron cargar países');
        }
        
        crearSelectorPaises();
        mostrarCargando(false);
    } catch (error) {
        mostrarCargando(false);
        console.error('Error al inicializar registro:', error);
        
        Swal.fire({
            icon: 'warning',
            title: 'Problema al cargar países',
            html: `
                <p>Se cargó una lista reducida de países.</p>
                <p style="font-size: 0.9em; color: #666;">Si no encuentras tu país, recarga la página.</p>
            `,
            confirmButtonText: 'Continuar'
        });
        
        // Intentar cargar países de respaldo
        if (typeof obtenerPaisesRespaldo === 'function') {
            paisesCache = obtenerPaisesRespaldo();
            crearSelectorPaises();
        }
    }
}

// Crear selector personalizado de países
function crearSelectorPaises() {
    const contenedor = document.getElementById('selector-pais');
    if (!contenedor) {
        // Buscar el campo de nacionalidad en el formulario
        const form = document.querySelector('form');
        if (!form) return;
        
        // Crear contenedor antes del botón de submit
        const nuevoContenedor = document.createElement('div');
        nuevoContenedor.id = 'selector-pais';
        nuevoContenedor.className = 'mb-3';
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            form.insertBefore(nuevoContenedor, submitBtn.parentElement);
        } else {
            form.appendChild(nuevoContenedor);
        }
    }

    const contenedorFinal = document.getElementById('selector-pais');
    if (!contenedorFinal) return;

    // Crear select con países y bandera
    contenedorFinal.innerHTML = `
        <label for="select-pais" class="form-label">Nacionalidad <abbr title="campo obligatorio">*</abbr></label>
        <div style="display: flex; gap: 10px; align-items: start;">
            <div style="flex: 1;">
                <select id="select-pais" class="form-select" required>
                    <option value="">Selecciona tu país...</option>
                    ${paisesCache.map(pais => `
                        <option value="${pais.codigo}" data-bandera="${pais.bandera}" data-nombre="${pais.nombre}">
                            ${pais.nombre}
                        </option>
                    `).join('')}
                </select>
                <div class="invalid-feedback">Por favor selecciona tu nacionalidad</div>
            </div>
            <div id="bandera-container" style="min-width: 60px; height: 45px; border: 2px solid #ddd; border-radius: 5px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; display: none;">
                <span id="bandera-display" style="font-size: 2em;"></span>
            </div>
        </div>
    `;

    // Agregar evento para mostrar bandera
    const select = document.getElementById('select-pais');
    const banderaContainer = document.getElementById('bandera-container');
    const banderaDisplay = document.getElementById('bandera-display');
    
    if (select && banderaDisplay) {
        select.addEventListener('change', (e) => {
            const option = e.target.selectedOptions[0];
            if (option && option.value) {
                const bandera = option.getAttribute('data-bandera');
                
                console.log('Bandera seleccionada:', bandera); // Debug
                
                // Detectar si es URL de imagen o emoji
                if (bandera && bandera.startsWith('http')) {
                    // Es una URL de imagen
                    banderaDisplay.innerHTML = `<img src="${bandera}" alt="Bandera" style="max-width: 50px; max-height: 35px; object-fit: contain;">`;
                    console.log('Cargando imagen:', bandera);
                } else if (bandera) {
                    // Es un emoji o texto - forzar como HTML
                    banderaDisplay.innerHTML = bandera;
                    console.log('Mostrando emoji/texto:', bandera);
                }
                
                banderaContainer.style.display = 'flex';
            } else {
                banderaContainer.style.display = 'none';
            }
        });
    }
}

// Configurar eventos del selector
function configurarEventos() {
    // Evento del formulario
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', manejarSubmitRegistro);
    }
}

// Obtener país seleccionado del select
function obtenerPaisSeleccionado() {
    const select = document.getElementById('select-pais');
    if (!select || !select.value) return null;
    
    return paisesCache.find(p => p.codigo === select.value);
}

// Manejar envío del formulario
async function manejarSubmitRegistro(e) {
    e.preventDefault();
    
    const form = e.target;
    limpiarErroresFormulario(form);

    // Obtener valores
    const nombres = form.querySelector('[name="nombres"], #nombres')?.value.trim();
    const apellidos = form.querySelector('[name="apellidos"], #apellidos')?.value.trim();
    const email = form.querySelector('[name="email"], #email')?.value.trim();
    const contrasena = form.querySelector('[name="password"], #password, [name="contrasena"]')?.value;
    const confirmarContrasena = form.querySelector('[name="confirmar-password"], #confirmar-password, [name="confirmar"]')?.value;
    const telefono = form.querySelector('[name="telefono"], #telefono')?.value.trim();
    const fechaNacimiento = form.querySelector('[name="fecha-nacimiento"], #fecha-nacimiento, [type="date"]')?.value;
    const terminos = form.querySelector('[name="terminos"], #terminos, [type="checkbox"]')?.checked;
    const tipoUsuario = form.querySelector('input[name="tipo"]:checked')?.value || 'comprador';

    let errores = 0;

    // Validaciones
    if (!validarNoVacio(nombres)) {
        mostrarErrorCampo(form.querySelector('[name="nombres"], #nombres'), 'Los nombres son obligatorios');
        errores++;
    }

    if (!validarNoVacio(apellidos)) {
        mostrarErrorCampo(form.querySelector('[name="apellidos"], #apellidos'), 'Los apellidos son obligatorios');
        errores++;
    }

    if (!validarEmail(email)) {
        mostrarErrorCampo(form.querySelector('[name="email"], #email'), 'Email inválido');
        errores++;
    }

    if (!validarContrasena(contrasena)) {
        mostrarErrorCampo(form.querySelector('[name="password"], #password, [name="contrasena"]'), 'Mínimo 6 caracteres');
        errores++;
    }

    if (!validarContrasenasCoinciden(contrasena, confirmarContrasena)) {
        mostrarErrorCampo(form.querySelector('[name="confirmar-password"], #confirmar-password, [name="confirmar"]'), 'Las contraseñas no coinciden');
        errores++;
    }

    if (telefono && !validarTelefono(telefono)) {
        mostrarErrorCampo(form.querySelector('[name="telefono"], #telefono'), 'Teléfono inválido');
        errores++;
    }

    if (fechaNacimiento && !validarMayorEdad(fechaNacimiento)) {
        mostrarErrorCampo(form.querySelector('[name="fecha-nacimiento"], #fecha-nacimiento, [type="date"]'), 'Debes ser mayor de 18 años');
        errores++;
    }

    // Obtener país del select
    const paisSeleccionado = obtenerPaisSeleccionado();
    
    if (!paisSeleccionado) {
        const selectPais = document.getElementById('select-pais');
        if (selectPais) {
            selectPais.classList.add('is-invalid');
        }
        errores++;
    }

    if (!terminos) {
        Swal.fire('Error', 'Debes aceptar los términos y condiciones', 'warning');
        errores++;
    }

    if (errores > 0) return;

    // Verificar si el email ya está registrado
    let usuarios = obtenerDeStorage(STORAGE_KEYS.USUARIOS) || [];
    const emailExiste = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (emailExiste) {
        Swal.fire('Error', 'Este email ya está registrado. Intenta con otro o inicia sesión.', 'warning');
        return;
    }

    // Registrar usuario
    const nuevoUsuario = {
        id: Date.now(),
        nombres,
        apellidos,
        email,
        contrasena: contrasena, // Guardar contraseña
        rol: 'comprador', // Siempre será comprador
        nacionalidad: paisSeleccionado.nombre,
        bandera: paisSeleccionado.bandera,
        telefono: telefono || '',
        fechaNacimiento: fechaNacimiento || '',
        fechaRegistro: new Date().toISOString().split('T')[0]
    };

    // Guardar en localStorage
    usuarios.push(nuevoUsuario);
    guardarEnStorage(STORAGE_KEYS.USUARIOS, usuarios);

    // Mensaje de éxito
    await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        html: `
            <p>Bienvenido/a <strong>${nombres} ${apellidos}</strong></p>
            <img src="${paisSeleccionado.bandera}" alt="${paisSeleccionado.nombre}" style="width:50px;margin:10px 0;">
            <p>Nacionalidad: ${paisSeleccionado.nombre}</p>
            <p>Rol: Comprador</p>
            <hr>
            <p style="font-size: 0.9em;">Ya puedes iniciar sesión con tu cuenta</p>
        `,
        confirmButtonText: 'Ir a Login'
    });

    // Redirigir al login
    window.location.href = '../login/login.html';
}
