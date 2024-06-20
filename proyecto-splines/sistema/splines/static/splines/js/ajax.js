function calculate_spline(type) {
    let x1 = document.getElementById('x1').value;
    let x2 = document.getElementById('x2').value;
    let y1 = document.getElementById('y1').value;
    let y2 = document.getElementById('y2').value;

    const csrftoken = getCookie('csrftoken');
    $.ajax({
        url: '/calculate',
        type: 'POST',
        data: {
            x: x1 + ',' + x2,
            y: y1 + ',' + y2,
            spline_type: type,
            csrfmiddlewaretoken: csrftoken
        },
        success: function(data) {
            if (data.error) {
                console.log('Error:', data.error);
                // Manejar el error en la interfaz si es necesario
            } else {
                console.log('Steps:', data.steps);
                console.log('Plot URL:', data.plot_url);
                // Actualizar la interfaz con los pasos de cálculo y la imagen del gráfico
                updateInterface(data.steps, data.plot_url);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            // Manejar el error en la interfaz si es necesario
        }
    });
}

function updateInterface(steps, plot_url) {
    // Limpiar la lista de pasos antes de agregar nuevos
    $('#steps-list').empty();

    // Verificar que los pasos sean un array
    if (Array.isArray(steps) && steps.length > 0) {
        // Construir la lista de pasos
        let stepsList = '';
        steps.forEach(step => {
            stepsList += `<li><strong>Segmento ${step.segmento}:</strong> Pendiente = ${step.pendiente.toFixed(2)}, Intersección = ${step.interseccion.toFixed(2)}, Ecuación: y = ${step.ecuacion}</li>`;
        });
        $('#steps-list').html(stepsList);
    } else {
        // Si no hay pasos válidos, mostrar un mensaje alternativo
        $('#steps-list').html('<li>No se encontraron pasos de cálculo.</li>');
    }

    // Actualizar la imagen del gráfico
    $('#plot-img').attr('src', 'data:image/png;base64,' + plot_url);
}