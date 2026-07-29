// storage.js - Gestión de localStorage

const STORAGE_KEYS = {
    PRODUCTOS: 'shopeasy_productos',
    CATEGORIAS: 'shopeasy_categorias',
    USUARIOS: 'shopeasy_usuarios',
    CARRITO: 'shopeasy_carrito',
    SESION: 'shopeasy_sesion'
};

// Guardar datos en localStorage
function guardarEnStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
}

// Obtener datos de localStorage
function obtenerDeStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error al leer de localStorage:', error);
        return null;
    }
}

// Limpiar todos los datos
function limpiarStorage() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
        return false;
    }
}

// Verificar si existe dato en storage
function existeEnStorage(key) {
    return localStorage.getItem(key) !== null;
}
