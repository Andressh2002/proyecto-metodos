// Vector de puntos
let points = [];

// Contador para llevar el seguimiento del número de puntos
let pointCount = 0;

// Función para reemplazar placeholders en una cadena de texto
function replacePlaceholders(template, data) {
    return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => data[key] || '');
}

// Función para agregar un nuevo punto al formulario
function addPoint(xName = '', yName = '') {
    pointCount++; // Incrementar el contador de puntos
    const pointsContainer = document.getElementById('pointsContainer'); // Obtener el contenedor de puntos
    const newPoint = document.createElement('div'); // Crear un nuevo div para el punto

    if (!xName || !yName) {
        xName = document.getElementById('x').value;
        yName = document.getElementById('y').value;
    }
    
    const pointsNames = verifyNameNull(xName, yName, pointCount);
    
    // Agregar el nuevo punto al vector de puntos
    points.push({ x: pointsNames[0], y: pointsNames[1] });

    // Obtener la plantilla y reemplazar los placeholders
    const template = document.getElementById('point-template').innerHTML;
    const pointHtml = replacePlaceholders(template, {
        pointX: pointsNames[0],
        pointY: pointsNames[1],
        pointCount: pointCount
    });

    newPoint.className = 'point'; // Asignar la clase 'point' al nuevo div
    newPoint.innerHTML = pointHtml; // Añadir el HTML del componente
    // Añadir los campos de entrada para x e y
    pointsContainer.appendChild(newPoint); // Agregar el nuevo punto al contenedor
    updateRemoveButtonState();
}

function verifyNameNull(xName, yName, count) {
    let x = xName;
    let y = yName;
    if (xName.trim() == null || xName.trim() == '') {
        x = 'X' + count.toString();
    }
    if (yName.trim() == null || yName.trim() == '') {
        y = 'Y' + count.toString();
    }
    return [x, y];
}

// Función para eliminar el último punto añadido
function removeLastPoint() {
    const pointsContainer = document.getElementById('pointsContainer'); // Obtener el contenedor de puntos
    const pointsElements = pointsContainer.getElementsByClassName('point'); // Obtener todos los puntos
    if (pointsElements.length > 0) { // Comprobar si hay al menos un punto añadido
        pointsContainer.removeChild(pointsElements[pointsElements.length - 1]); // Eliminar el último punto
        points.pop(); // Eliminar el último punto del vector
        pointCount--; // Decrementar el contador de puntos
    }
    updateRemoveButtonState();
}

// Función para eliminar todos los puntos adicionales y dejar solo los dos primeros
function resetToTwoPoints() {
    const pointsContainer = document.getElementById('pointsContainer'); // Obtener el contenedor de puntos
    const pointsElements = pointsContainer.getElementsByClassName('point'); // Obtener todos los puntos
    while (pointsElements.length > 0) {
        pointsContainer.removeChild(pointsElements[pointsElements.length - 1]); // Eliminar el último punto hasta que queden solo dos
    }
    points = []; // Resetear el vector de puntos
    pointCount = 0; // Resetear el contador de puntos
    addPoint('', ''); // Agregar el primer punto con valores predeterminados
    addPoint('', ''); // Agregar el segundo punto con valores predeterminados
    updateRemoveButtonState();
}

// Función para actualizar el estado del botón 'Eliminar'
function updateRemoveButtonState() {
    const removeButton = document.getElementById('removeBtn'); // Obtener el botón 'Eliminar'
    if (pointCount <= 2) {
        removeButton.disabled = true; // Deshabilitar el botón si hay 2 puntos o menos
        removeButton.classList.remove('personalized-button'); // Remover la clase
        removeButton.classList.add('personalized-button-disabled'); // Agregar la clase
    } else {
        removeButton.disabled = false; // Habilitar el botón si hay más de 2 puntos
        removeButton.classList.remove('personalized-button-disabled'); // Remover la clase
        removeButton.classList.add('personalized-button'); // Agregar la clase
    }
}

// Función para actualizar el estado del botón 'Eliminar'
function updateCalcButtonState() {
    const calcButton = document.getElementById('calculateBtn'); // Obtener el botón 'Eliminar'
    const slt = document.getElementById('spline_type');
    if (slt.value == '' || slt.value == null) {
        calcButton.disabled = true; // Deshabilitar el botón si no hay nada seleccionado en el select
        calcButton.classList.remove('personalized-button'); // Remover la clase
        calcButton.classList.add('personalized-button-disabled'); // Agregar la clase
    } else {
        calcButton.disabled = false; // Habilitar el botón si hay algún valor válido seleccionado en el select
        calcButton.classList.remove('personalized-button-disabled'); // Remover la clase
        calcButton.classList.add('personalized-button'); // Agregar la clase
    }
}

// Función para inicializar el formulario con dos puntos
function initializeForm() {
    addPoint('', ''); // Agregar el primer punto con valores predeterminados
    addPoint('', ''); // Agregar el segundo punto con valores predeterminados
}

// Inicializar el estado del botón 'Eliminar' y el formulario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateRemoveButtonState();
    updateCalcButtonState();
    initializeForm();
});