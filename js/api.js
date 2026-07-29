// api.js - Consumo de APIs externas

// API de Países
let paisesCache = [];

async function cargarPaises() {
    // Intentar cargar desde API REST Countries
    try {
        console.log('Cargando países desde REST Countries API...');
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Parsear correctamente con verificación de datos
        paisesCache = data
            .map(pais => {
                // Usar flags.png como prioridad ya que es más compatible
                const bandera = pais.flags?.png || pais.flags?.svg || '🏳️';
                return {
                    nombre: pais.name?.common || pais.name,
                    bandera: bandera,
                    codigo: pais.cca2
                };
            })
            .filter(p => p.nombre && p.codigo) // Filtrar países sin datos
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
        
        console.log(`✓ ${paisesCache.length} países cargados desde API`);
        console.log('Ejemplo de país:', paisesCache[0]); // Debug
        
        return paisesCache;
        
    } catch (error) {
        console.warn('✗ Error al cargar desde API:', error.message);
        console.log('Usando lista de respaldo con emojis');
        paisesCache = obtenerPaisesRespaldo();
        return paisesCache;
    }
}

// Lista de respaldo de países (principales de América Latina y el mundo)
function obtenerPaisesRespaldo() {
    return [
        { nombre: 'Argentina', bandera: '🇦🇷', codigo: 'AR' },
        { nombre: 'Bolivia', bandera: '🇧🇴', codigo: 'BO' },
        { nombre: 'Brasil', bandera: '🇧🇷', codigo: 'BR' },
        { nombre: 'Chile', bandera: '🇨🇱', codigo: 'CL' },
        { nombre: 'Colombia', bandera: '🇨🇴', codigo: 'CO' },
        { nombre: 'Costa Rica', bandera: '🇨🇷', codigo: 'CR' },
        { nombre: 'Cuba', bandera: '🇨🇺', codigo: 'CU' },
        { nombre: 'Ecuador', bandera: '🇪🇨', codigo: 'EC' },
        { nombre: 'El Salvador', bandera: '🇸🇻', codigo: 'SV' },
        { nombre: 'España', bandera: '🇪🇸', codigo: 'ES' },
        { nombre: 'Guatemala', bandera: '🇬🇹', codigo: 'GT' },
        { nombre: 'Honduras', bandera: '🇭🇳', codigo: 'HN' },
        { nombre: 'México', bandera: '🇲🇽', codigo: 'MX' },
        { nombre: 'Nicaragua', bandera: '🇳🇮', codigo: 'NI' },
        { nombre: 'Panamá', bandera: '🇵🇦', codigo: 'PA' },
        { nombre: 'Paraguay', bandera: '🇵🇾', codigo: 'PY' },
        { nombre: 'Perú', bandera: '🇵🇪', codigo: 'PE' },
        { nombre: 'Puerto Rico', bandera: '🇵🇷', codigo: 'PR' },
        { nombre: 'República Dominicana', bandera: '🇩🇴', codigo: 'DO' },
        { nombre: 'Uruguay', bandera: '🇺🇾', codigo: 'UY' },
        { nombre: 'Venezuela', bandera: '🇻🇪', codigo: 'VE' },
        { nombre: 'Estados Unidos', bandera: '🇺🇸', codigo: 'US' },
        { nombre: 'Canadá', bandera: '🇨🇦', codigo: 'CA' },
        { nombre: 'Francia', bandera: '🇫🇷', codigo: 'FR' },
        { nombre: 'Alemania', bandera: '🇩🇪', codigo: 'DE' },
        { nombre: 'Italia', bandera: '🇮🇹', codigo: 'IT' },
        { nombre: 'Portugal', bandera: '🇵🇹', codigo: 'PT' },
        { nombre: 'Reino Unido', bandera: '🇬🇧', codigo: 'GB' },
        { nombre: 'China', bandera: '🇨🇳', codigo: 'CN' },
        { nombre: 'Japón', bandera: '🇯🇵', codigo: 'JP' },
        { nombre: 'Corea del Sur', bandera: '🇰🇷', codigo: 'KR' },
        { nombre: 'India', bandera: '🇮🇳', codigo: 'IN' },
        { nombre: 'Australia', bandera: '🇦🇺', codigo: 'AU' }
    ].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

// Filtrar países por búsqueda
function filtrarPaises(termino) {
    const terminoLower = termino.toLowerCase();
    return paisesCache.filter(pais => 
        pais.nombre.toLowerCase().includes(terminoLower)
    );
}

// API de Clima - Open-Meteo
const CIUDADES_CLIMA = {
    'Santo Domingo': { lat: -0.25, lon: -79.15 },
    'Quevedo': { lat: -1.03, lon: -79.46 },
    'Quito': { lat: -0.18, lon: -78.47 },
    'Guayaquil': { lat: -2.17, lon: -79.90 }
};

async function obtenerClima(ciudad) {
    try {
        const coords = CIUDADES_CLIMA[ciudad];
        if (!coords) {
            throw new Error('Ciudad no encontrada');
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al obtener clima');
        }

        const data = await response.json();
        
        return {
            temperatura: data.current.temperature_2m,
            humedad: data.current.relative_humidity_2m,
            velocidadViento: data.current.wind_speed_10m,
            codigoClima: data.current.weather_code,
            ciudad: ciudad
        };
    } catch (error) {
        console.error('Error al obtener clima:', error);
        throw error;
    }
}

// Interpretar código de clima
function interpretarCodigoClima(codigo) {
    const codigos = {
        0: { texto: 'Despejado', icono: '☀️' },
        1: { texto: 'Principalmente despejado', icono: '🌤️' },
        2: { texto: 'Parcialmente nublado', icono: '⛅' },
        3: { texto: 'Nublado', icono: '☁️' },
        45: { texto: 'Niebla', icono: '🌫️' },
        48: { texto: 'Niebla con escarcha', icono: '🌫️' },
        51: { texto: 'Llovizna ligera', icono: '🌦️' },
        53: { texto: 'Llovizna moderada', icono: '🌧️' },
        55: { texto: 'Llovizna intensa', icono: '🌧️' },
        61: { texto: 'Lluvia ligera', icono: '🌧️' },
        63: { texto: 'Lluvia moderada', icono: '🌧️' },
        65: { texto: 'Lluvia intensa', icono: '⛈️' },
        80: { texto: 'Chubascos ligeros', icono: '🌦️' },
        81: { texto: 'Chubascos moderados', icono: '🌧️' },
        82: { texto: 'Chubascos violentos', icono: '⛈️' },
        95: { texto: 'Tormenta', icono: '⛈️' }
    };

    return codigos[codigo] || { texto: 'Desconocido', icono: '❓' };
}
