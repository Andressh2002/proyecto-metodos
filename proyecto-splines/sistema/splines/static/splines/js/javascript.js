// Contador para llevar el seguimiento del número de puntos
let pointCount = 2;

// Función para reemplazar placeholders en una cadena de texto
function replacePlaceholders(template, data) {
    return template.replace(/{{\s*(\w+)\s*}}/g, (match, key) => data[key] || '');
}

// Función para agregar un nuevo punto al formulario
function addPoint() {
    pointCount++; // Incrementar el contador de puntos
    const pointsContainer = document.getElementById('pointsContainer'); // Obtener el contenedor de puntos
    const newPoint = document.createElement('div'); // Crear un nuevo div para el punto
    const xName = document.getElementById('x').value;
    const yName = document.getElementById('y').value;
    const pointsNames = verifyNameNull(xName, yName, pointCount);
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
    const points = pointsContainer.getElementsByClassName('point'); // Obtener todos los puntos
    if (points.length > 0) { // Comprobar si hay al menos un punto añadido
        pointsContainer.removeChild(points[points.length - 1]); // Eliminar el último punto
        pointCount--; // Decrementar el contador de puntos
    }
    updateRemoveButtonState();
}

// Función para eliminar todos los puntos adicionales y dejar solo los dos primeros
function resetToTwoPoints() {
    const pointsContainer = document.getElementById('pointsContainer'); // Obtener el contenedor de puntos
    const points = pointsContainer.getElementsByClassName('point'); // Obtener todos los puntos
    while (points.length > 0) {
        pointsContainer.removeChild(points[points.length - 1]); // Eliminar el último punto hasta que queden solo dos
    }
    pointCount = 2; // Resetear el contador de puntos
    updateRemoveButtonState();
}

// Función para actualizar el estado del botón 'Eliminar'
function updateRemoveButtonState() {
    const removeButton = document.getElementById('removeBtn'); // Obtener el botón 'Eliminar'
    if (pointCount <= 2) {
        removeButton.disabled = true; // Deshabilitar el botón si hay 2 puntos o menos
        removeButton.classList.remove('btn-danger'); // Remover la clase 'btn-danger'
        removeButton.classList.add('btn-secondary'); // Agregar la clase 'btn-secondary'
    } else {
        removeButton.disabled = false; // Habilitar el botón si hay más de 2 puntos
        removeButton.classList.remove('btn-secondary'); // Remover la clase 'btn-secondary'
        removeButton.classList.add('btn-danger'); // Agregar la clase 'btn-danger'
    }
}

// Inicializar el estado del botón 'Eliminar' al cargar la página
updateRemoveButtonState();
