// validaciones.js - Validación de formularios

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar teléfono
function validarTelefono(telefono) {
    const regex = /^\+?[\d\s\-()]+$/;
    return regex.test(telefono) && telefono.replace(/\D/g, '').length >= 7;
}

// Validar fecha
function validarFecha(fecha) {
    const fechaObj = new Date(fecha);
    return !isNaN(fechaObj.getTime());
}

// Validar que sea mayor de edad
function validarMayorEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    
    return edad >= 18;
}

// Validar contraseña (mínimo 6 caracteres)
function validarContrasena(contrasena) {
    return contrasena.length >= 6;
}

// Validar que las contraseñas coincidan
function validarContrasenasCoinciden(contrasena1, contrasena2) {
    return contrasena1 === contrasena2 && contrasena1.length > 0;
}

// Validar precio (número positivo)
function validarPrecio(precio) {
    const num = parseFloat(precio);
    return !isNaN(num) && num > 0;
}

// Validar stock (número entero positivo o cero)
function validarStock(stock) {
    const num = parseInt(stock);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
}

// Validar campo no vacío
function validarNoVacio(valor) {
    return valor && valor.toString().trim().length > 0;
}

// Validar URL
function validarURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Mostrar error en campo
function mostrarErrorCampo(input, mensaje) {
    input.classList.add('is-invalid');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = mensaje;
    } else {
        const newErrorDiv = document.createElement('div');
        newErrorDiv.className = 'invalid-feedback';
        newErrorDiv.textContent = mensaje;
        input.parentNode.insertBefore(newErrorDiv, input.nextSibling);
    }
}

// Limpiar error en campo
function limpiarErrorCampo(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}

// Limpiar todos los errores de un formulario
function limpiarErroresFormulario(formulario) {
    const inputs = formulario.querySelectorAll('.is-invalid, .is-valid');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
}
