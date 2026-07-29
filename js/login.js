// login.js - Sistema de autenticación

let usuariosCargados = [];

document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosLogin();
    inicializarFormularioLogin();
    verificarSesionActiva();
});

// Cargar datos de usuarios
async function cargarDatosLogin() {
    try {
        mostrarCargando(true);
        
        // Intentar cargar desde localStorage primero
        const usuariosStorage = obtenerDeStorage(STORAGE_KEYS.USUARIOS);
        
        if (usuariosStorage && usuariosStorage.length > 0) {
            usuariosCargados = usuariosStorage;
            console.log('Usuarios cargados desde localStorage:', usuariosCargados.length);
        } else {
            // Cargar desde JSON
            const basePath = window.location.pathname.includes('/login/') ? '../json/' : 'json/';
            const response = await fetch(basePath + 'usuarios.json');
            
            if (!response.ok) {
                throw new Error('Error al cargar usuarios.json');
            }
            
            usuariosCargados = await response.json();
            guardarEnStorage(STORAGE_KEYS.USUARIOS, usuariosCargados);
            console.log('Usuarios cargados desde JSON:', usuariosCargados.length);
        }
        
        mostrarCargando(false);
    } catch (error) {
        mostrarCargando(false);
        console.error('Error al cargar usuarios:', error);
        mostrarError('Error al cargar datos de usuarios. Intenta recargar la página.');
    }
}

// Inicializar formulario de login
function inicializarFormularioLogin() {
    const form = document.querySelector('.formulario-login');
    if (!form) return;

    form.addEventListener('submit', manejarLogin);
}

// Verificar si hay sesión activa
function verificarSesionActiva() {
    const sesionActiva = obtenerDeStorage(STORAGE_KEYS.SESION);
    
    if (sesionActiva && sesionActiva.email) {
        // Redirigir automáticamente sin mostrar alert molesto
        redirigirSegunRol(sesionActiva.rol);
    }
}

// Manejar el proceso de login
async function manejarLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Obtener valores del formulario
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const recordar = form.querySelector('input[name="recordar"]')?.checked || false;
    
    // Validaciones básicas
    if (!validarEmail(email)) {
        Swal.fire('Error', 'Por favor ingresa un email válido', 'error');
        return;
    }
    
    if (!validarContrasena(password)) {
        Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    // Buscar usuario (sin especificar rol, el sistema lo determina automáticamente)
    const usuario = buscarUsuarioPorCredenciales(email, password);
    
    if (usuario) {
        // Login exitoso
        await loginExitoso(usuario, recordar);
    } else {
        // Login fallido
        loginFallido(email);
    }
}

// Buscar usuario por credenciales (sin filtrar por rol)
function buscarUsuarioPorCredenciales(email, password) {
    return usuariosCargados.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.contrasena === password
    );
}

// Login exitoso
async function loginExitoso(usuario, recordar) {
    // Guardar sesión
    const sesionData = {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        nacionalidad: usuario.nacionalidad,
        bandera: usuario.bandera,
        fechaLogin: new Date().toISOString(),
        recordar: recordar
    };
    
    guardarEnStorage(STORAGE_KEYS.SESION, sesionData);
    
    // Mostrar mensaje de éxito
    await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido/a!',
        html: `
            <div style="text-align: center;">
                <p><strong>${usuario.nombres} ${usuario.apellidos}</strong></p>
                <p style="font-size: 0.9em; color: #666;">
                    <img src="${usuario.bandera}" alt="${usuario.nacionalidad}" style="width: 30px; margin-right: 5px;">
                    ${usuario.nacionalidad}
                </p>
                <p style="font-size: 0.9em; color: #666;">Rol: ${usuario.rol}</p>
            </div>
        `,
        timer: 2000,
        showConfirmButton: false
    });
    
    // Redirigir según el rol
    redirigirSegunRol(usuario.rol);
}

// Login fallido
function loginFallido(email) {
    Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        html: `
            <p>No se encontró una cuenta con:</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p style="font-size: 0.9em; color: #666;">
                Verifica tus credenciales o <a href="../registro/registro.html">regístrate aquí</a>
            </p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 15px;">
                <p style="font-size: 0.85em; margin: 0;"><strong>Usuarios de prueba:</strong></p>
                <p style="font-size: 0.8em; margin: 5px 0;">Comprador: juan.perez@email.com / 123456</p>
                <p style="font-size: 0.8em; margin: 5px 0;">Administrador: admin@shopeasy.ec / admin123</p>
            </div>
        `,
        confirmButtonText: 'Intentar de nuevo'
    });
}

// Redirigir según rol
function redirigirSegunRol(rol) {
    // Detectar si estamos en una subcarpeta
    const enSubcarpeta = window.location.pathname.includes('/login/') ||
                         window.location.pathname.includes('/carrito/') ||
                         window.location.pathname.includes('/catalogo/') ||
                         window.location.pathname.includes('/pago/') ||
                         window.location.pathname.includes('/registro/');
    
    const basePath = enSubcarpeta ? '../' : '';
    
    switch(rol) {
        case 'administrador':
            window.location.href = basePath + 'admin.html';
            break;
        case 'comprador':
        default:
            window.location.href = basePath + 'index.html';
            break;
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem(STORAGE_KEYS.SESION);
    
    Toastify({
        text: "Sesión cerrada correctamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }
    }).showToast();
    
    // Recargar página
    setTimeout(() => {
        location.reload();
    }, 500);
}

// Obtener usuario logueado
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
        Swal.fire({
            icon: 'warning',
            title: 'Acceso restringido',
            text: 'Debes iniciar sesión para acceder a esta página',
            confirmButtonText: 'Ir a Login'
        }).then(() => {
            window.location.href = 'login/login.html';
        });
        return false;
    }
    
    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(sesion.rol)) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para acceder a esta página',
            confirmButtonText: 'Volver'
        }).then(() => {
            window.history.back();
        });
        return false;
    }
    
    return true;
}
