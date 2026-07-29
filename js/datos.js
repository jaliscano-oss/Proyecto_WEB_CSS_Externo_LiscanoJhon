// datos.js - Carga de archivos JSON y gestión de datos

let productos = [];
let categorias = [];
let usuarios = [];

// Cargar datos desde JSON o localStorage
async function cargarDatos() {
    try {
        // Intentar cargar desde localStorage primero
        const productosStorage = obtenerDeStorage(STORAGE_KEYS.PRODUCTOS);
        const categoriasStorage = obtenerDeStorage(STORAGE_KEYS.CATEGORIAS);
        const usuariosStorage = obtenerDeStorage(STORAGE_KEYS.USUARIOS);

        if (productosStorage && categoriasStorage && usuariosStorage) {
            productos = productosStorage;
            categorias = categoriasStorage;
            usuarios = usuariosStorage;
            console.log('Datos cargados desde localStorage');
        } else {
            // Cargar desde JSON
            await cargarDesdeJSON();
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarError('Error al cargar los datos. Por favor, recarga la página.');
    }
}

// Cargar datos desde archivos JSON
async function cargarDesdeJSON() {
    try {
        mostrarCargando(true);

        // Detectar si estamos en una subcarpeta
        const basePath = window.location.pathname.includes('/catalogo/') || 
                         window.location.pathname.includes('/registro/') ||
                         window.location.pathname.includes('/login/') ||
                         window.location.pathname.includes('/carrito/')
                         ? '../json/' : 'json/';

        const [responseProd, responseCat, responseUser] = await Promise.all([
            fetch(basePath + 'productos.json'),
            fetch(basePath + 'categorias.json'),
            fetch(basePath + 'usuarios.json')
        ]);

        if (!responseProd.ok || !responseCat.ok || !responseUser.ok) {
            throw new Error('Error al cargar archivos JSON');
        }

        productos = await responseProd.json();
        categorias = await responseCat.json();
        usuarios = await responseUser.json();

        // Guardar en localStorage
        guardarEnStorage(STORAGE_KEYS.PRODUCTOS, productos);
        guardarEnStorage(STORAGE_KEYS.CATEGORIAS, categorias);
        guardarEnStorage(STORAGE_KEYS.USUARIOS, usuarios);

        console.log('Datos cargados desde JSON y guardados en localStorage');
        mostrarCargando(false);
    } catch (error) {
        mostrarCargando(false);
        throw error;
    }
}

// Restablecer datos desde JSON
async function restablecerDatos() {
    const resultado = await Swal.fire({
        title: '¿Restablecer datos?',
        text: 'Esto eliminará todos los cambios y restaurará los datos originales',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restablecer',
        cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
        try {
            limpiarStorage();
            await cargarDesdeJSON();
            
            Toastify({
                text: "Datos restablecidos correctamente",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();

            // Recargar la página para actualizar todo
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron restablecer los datos', 'error');
        }
    }
}

// Obtener producto por ID
function obtenerProductoPorId(id) {
    return productos.find(p => p.id === parseInt(id));
}

// Obtener categoría por ID
function obtenerCategoriaPorId(id) {
    return categorias.find(c => c.id === parseInt(id));
}

// Obtener nombre de categoría
function obtenerNombreCategoria(categoriaId) {
    const categoria = obtenerCategoriaPorId(categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
}
