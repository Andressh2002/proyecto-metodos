// Evento que se dispara cuando el modal se muestra
const modalElement = document.getElementById('mdlEditPoint');
modalElement.addEventListener('show.bs.modal', function (event) {
    // Botón que abrió el modal
    const button = event.relatedTarget;
    // Extraer la información de los atributos de datos
    const inputId = button.getAttribute('data-input-id');
    const otherData = button.getAttribute('data-other-data');

    // Modificar elementos dentro del modal usando los datos obtenidos
    const modalBodyInput = modalElement.querySelector('.modal-body input');
    if (modalBodyInput) {
        modalBodyInput.value = inputId; // Ejemplo de uso de los datos
    }

    const hidden = modalElement.querySelector('.overflow-hidden');
    if (hidden) {
        hidden.value = otherData;
    }
});