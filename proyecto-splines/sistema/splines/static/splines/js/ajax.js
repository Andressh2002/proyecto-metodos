function calculate_spline() {
    document.getElementById('data-container').classList.add('d-none');
    document.getElementById('data-loading').classList.remove('d-none');
    const spline = document.getElementById('spline_type').value;
    const csrftoken = getCookie('csrftoken');

    const points = getPoints();
    $.ajax({
        url: '/calculate',
        type: 'POST',
        data: {
            x: points.x,
            y: points.y,
            spline_type: spline,
            csrfmiddlewaretoken: csrftoken
        },
        success: function (data) {
            console.log('Data:', data);
            if (data.error) {
                console.log('Error:', data.error);
                document.getElementById('data-loading').classList.add('d-none');
                // Manejar el error en la interfaz si es necesario
            } else {
                console.log('Steps:', data.steps);
                //console.log('Plot URL:', data.plot_url);
                // Actualizar la interfaz con los pasos de cálculo y la imagen del gráfico
                updateInterface(data.steps, points, spline);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
            document.getElementById('data-loading').classList.add('d-none');
            $('#steps-loading').html(`<p>${error}</p>`);
            // Manejar el error en la interfaz si es necesario
        }
    });
}

function updateInterface(steps, points, spline) {
    console.log(spline);
    // Limpiar la lista de pasos antes de agregar nuevos
    document.getElementById('data-container').classList.remove('d-none');
    document.getElementById('data-loading').classList.add('d-none');
    $('#steps-list').empty();

    const stepsContainer = document.getElementById('steps-list');
    const newStep = document.createElement('div');
    newStep.className = 'list-group list-group-flush';

    switch (spline) {
        case 'linear':
            // Verificar que los pasos sean un array
            if (Array.isArray(steps) && steps.length > 0) {
                // Construir la lista de pasos
                steps.forEach(step => {
                    const template = document.getElementById('listLineal-template').innerHTML;
                    const listHtml = replacePlaceholders(template, {
                        segmento: step.segmento,
                        pendiente: step.pendiente.toFixed(2),
                        interseccion: step.interseccion.toFixed(2),
                        ecuacion: step.ecuacion,
                        x1: step.detalles.x1.toString(),
                        x2: step.detalles.x2.toString(),
                        y1: step.detalles.y1.toString(),
                        y2: step.detalles.y2.toString(),
                        calculoPendiente: step.detalles.calculo_pendiente,
                        calculoInterseccion: step.detalles.calculo_interseccion
                    });

                    newStep.innerHTML += listHtml;
                    stepsContainer.appendChild(newStep);
                });
            } else {
                // Si no hay pasos válidos, mostrar un mensaje alternativo
                $('#steps-list').html('<li>No se encontraron pasos de cálculo.</li>');
            }

            // Actualizar la tabla de datos si points está definido
            if (points) {
                updateDataTable(points);
            }

            // Actualizar la imagen del gráfico
            generateLinearGrafic(getVectPoints().x, getVectPoints().y);
            //$('#plot-img').attr('src', 'data:image/png;base64,' + plot_url);
            break;

        case 'quadratic':
            // Verificar que los pasos sean un array
            if (Array.isArray(steps) && steps.length > 0) {
                // Construir la lista de pasos
                steps.forEach(step => {
                    const template = document.getElementById('listCuadratica-template').innerHTML;
                    const listHtml = replacePlaceholders(template, {
                        segmento: step.segmento,
                        pendiente_inicial: step.pendiente_inicial,
                        pendiente_final: step.pendiente_final,
                        a: step.a.toString(),
                        b: step.b.toString(),
                        c: step.c.toString(),
                        ecuacion: step.ecuacion,
                        x1: step.detalles.x1.toString(),
                        x2: step.detalles.x2.toString(),
                        y1: step.detalles.y1.toString(),
                        y2: step.detalles.y2.toString(),
                        calculo_a: step.detalles.calculo_a,
                        calculo_b: step.detalles.calculo_b,
                        calculo_c: step.detalles.calculo_c
                    });

                    newStep.innerHTML += listHtml;
                    stepsContainer.appendChild(newStep);
                });
            } else {
                // Si no hay pasos válidos, mostrar un mensaje alternativo
                $('#steps-list').html('<li>No se encontraron pasos de cálculo.</li>');
            }

            // Actualizar la tabla de datos si points está definido
            if (points) {
                updateDataTable(points);
            }

            // Actualizar la imagen del gráfico
            generateQuadraticGrafic(getVectPoints().x, getVectPoints().y);
            //$('#plot-img').attr('src', 'data:image/png;base64,' + plot_url);
            break;

        case 'cubic':
            // Verificar que los pasos sean un array
            if (Array.isArray(steps) && steps.length > 0) {
                // Construir la lista de pasos
                steps.forEach(step => {
                    const template = document.getElementById('listCubica-template').innerHTML;
                    const listHtml = replacePlaceholders(template, {
                        segmento: step.segmento,
                        pendiente_inicial: step.pendiente_inicial,
                        pendiente_final: step.pendiente_final,
                        a: step.a.toString(),
                        b: step.b.toString(),
                        c: step.c.toString(),
                        d: step.d.toString(),
                        ecuacion: step.ecuacion,
                        x1: step.detalles.x1.toString(),
                        x2: step.detalles.x2.toString(),
                        y1: step.detalles.y1.toString(),
                        y2: step.detalles.y2.toString(),
                        calculo_a: step.detalles.calculo_a,
                        calculo_b: step.detalles.calculo_b,
                        calculo_c: step.detalles.calculo_c,
                        calculo_d: step.detalles.calculo_d
                    });

                    newStep.innerHTML += listHtml;
                    stepsContainer.appendChild(newStep);
                });
            } else {
                // Si no hay pasos válidos, mostrar un mensaje alternativo
                $('#steps-list').html('<li>No se encontraron pasos de cálculo.</li>');
            }

            // Actualizar la tabla de datos si points está definido
            if (points) {
                updateDataTable(points);
            }

            // Actualizar la imagen del gráfico
            generateCubicGrafic(getVectPoints().x, getVectPoints().y);
            //$('#plot-img').attr('src', 'data:image/png;base64,' + plot_url);
            break;
        default:
            break;
    }

}

function updateDataTable(points) {
    // Limpiar la tabla antes de agregar nuevos datos
    $('#data-list').empty();

    // Verificar que points.x y points.y sean cadenas válidas
    if (typeof points.x === 'string' && typeof points.y === 'string') {
        // Convertir puntos x e y en arrays separados por comas
        let xArray = points.x.split(',');
        let yArray = points.y.split(',');

        // Verificar que ambos arrays tengan la misma longitud
        if (xArray.length === yArray.length) {
            // Construir la tabla de datos con clases de Bootstrap
            let tableHtml = `
                    <thead>
                        <tr>
                            <th scope="col">Punto</th>
                            <th scope="col">X</th>
                            <th scope="col">Y</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            xArray.forEach((x, index) => {
                let row = `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${x}</td>
                        <td>${yArray[index]}</td>
                    </tr>
                `;
                tableHtml += row;
            });
            tableHtml += '</tbody>';

            // Agregar la tabla construida al elemento con id #data-list
            $('#data-list').html(tableHtml);
        } else {
            // Si los arrays no tienen la misma longitud, mostrar un mensaje de error
            $('#data-list').html('<div class="alert alert-danger" role="alert">Error: Los datos de puntos no tienen la misma cantidad de elementos para X e Y.</div>');
        }
    } else {
        // Si points.x o points.y no son cadenas válidas, mostrar un mensaje de error
        $('#data-list').html('<div class="alert alert-danger" role="alert">Error: Los datos de puntos no son válidos.</div>');
    }
}

function getPoints() {
    let xValues = [];
    let yValues = [];

    let index = 1;
    while (true) {
        let xElement = document.getElementById('x' + index);
        let yElement = document.getElementById('y' + index);

        if (!xElement || !yElement) {
            break;
        }

        xValues.push(xElement.value);
        yValues.push(yElement.value);

        index++;
    }

    return {
        x: xValues.join(','),
        y: yValues.join(',')
    };
}

function getVectPoints() {
    let xValues = [];
    let yValues = [];

    let index = 1;
    while (true) {
        let xElement = document.getElementById('x' + index);
        let yElement = document.getElementById('y' + index);

        if (!xElement || !yElement) {
            break;
        }

        xValues.push(xElement.value);
        yValues.push(yElement.value);

        index++;
    }

    return {
        x: xValues,
        y: yValues
    };
}