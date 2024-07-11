let myChart; // Variable global para mantener la referencia al gráfico

function generateLinearGrafic(vectX, vectY) {
    // Limpiar el gráfico anterior si existe
    if (myChart) {
        myChart.destroy();
    }

    // Datos
    const data = {
        x: vectX,
        y: vectY
    };

    // Generar colores para cada segmento
    const colors = generateColors(data.x.length - 1);

    // Crear datasets para los segmentos
    const datasets = data.x.slice(0, -1).map((_, i) => {
        return {
            label: `Segmento ${i + 1}`,
            data: [
                { x: data.x[i], y: data.y[i] },
                { x: data.x[i + 1], y: data.y[i + 1] }
            ],
            borderColor: colors[i],
            fill: false,
            tension: 0
        };
    });

    // Configuración del gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}

function generateQuadraticGrafic(vectX, vectY) {
    // Limpiar el gráfico anterior si existe
    if (typeof myChart !== 'undefined') {
        myChart.destroy();
    }

    // Función para interpolar puntos intermedios cuadráticos
    function interpolateQuadraticPoints(x1, y1, x2, y2, x3, y3, numPoints) {
        const points = [];
        const step = 1 / numPoints;
        for (let i = 0; i <= numPoints; i++) {
            const t = i * step;
            const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * x2 + t * t * x3;
            const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * y2 + t * t * y3;
            points.push({ x, y });
        }
        return points;
    }

    // Generar colores para cada segmento
    const colors = generateColors(vectX.length - 2);

    // Crear datasets para los segmentos cuadráticos
    const segmentDatasets = [];
    for (let i = 0; i < vectX.length - 2; i++) {
        const segment = interpolateQuadraticPoints(vectX[i], vectY[i], vectX[i + 1], vectY[i + 1], vectX[i + 2], vectY[i + 2], 10);
        segmentDatasets.push({
            label: `Segmento ${i + 1}`,
            data: segment,
            borderColor: colors[i],
            fill: false,
            tension: 0 // No usar tension para curvas cuadráticas
        });
    }

    // Dataset para la línea completa
    const fullLineDataset = {
        label: 'Línea Completa',
        data: vectX.map((x, index) => ({ x, y: vectY[index] })),
        borderColor: 'black',
        fill: false,
        tension: 0.4 // Ajustar la tensión para una curvatura más notable
    };

    // Configuración del gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: vectX,
            datasets: [...segmentDatasets, fullLineDataset]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left'
                }
            }
        }
    });
}

function generateCubicGrafic(vectX, vectY) {
    // Limpiar el gráfico anterior si existe
    if (typeof myChart !== 'undefined') {
        myChart.destroy();
    }

    // Función para interpolar puntos intermedios cúbicos
    function interpolateCubicPoints(x0, y0, x1, y1, x2, y2, x3, y3, numPoints) {
        const points = [];
        const step = 1 / numPoints;
        for (let i = 0; i <= numPoints; i++) {
            const t = i * step;
            const x = cubicBezierInterpolate(x0, x1, x2, x3, t);
            const y = cubicBezierInterpolate(y0, y1, y2, y3, t);
            points.push({ x, y });
        }
        return points;
    }

    // Función para interpolación cúbica de Bézier
    function cubicBezierInterpolate(a, b, c, d, t) {
        return (
            a * (1 - t) ** 3 +
            3 * b * t * (1 - t) ** 2 +
            3 * c * t ** 2 * (1 - t) +
            d * t ** 3
        );
    }

    // Generar colores para cada segmento
    const colors = generateColors(vectX.length - 3);

    // Crear datasets para los segmentos cúbicos
    const segmentDatasets = [];
    for (let i = 0; i < vectX.length - 3; i++) {
        const segment = interpolateCubicPoints(vectX[i], vectY[i], vectX[i + 1], vectY[i + 1], vectX[i + 2], vectY[i + 2], vectX[i + 3], vectY[i + 3], 10);
        segmentDatasets.push({
            label: `Segmento ${i + 1}`,
            data: segment,
            borderColor: colors[i],
            fill: false,
            tension: 0 // No usar tension para curvas cúbicas
        });
    }

    // Dataset para la línea completa
    const fullLineDataset = {
        label: 'Línea Completa',
        data: vectX.map((x, index) => ({ x, y: vectY[index] })),
        borderColor: 'black',
        fill: false,
        tension: 0.4 // Ajustar la tensión para una curvatura más notable
    };

    // Configuración del gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: vectX,
            datasets: [...segmentDatasets, fullLineDataset]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left'
                }
            }
        }
    });
}

// Función para generar colores de forma dinámica
function generateColors(numSegments) {
    const colors = [];
    const rainbowColors = [
        'red', 'orange', 'yellow', 'green', 'blue', 'purple',
        'cyan', 'magenta', 'lime', 'pink', 'teal', 'brown',
        'navy', 'maroon', 'olive', 'coral', 'indigo', 'gold',
        'silver', 'black', 'white', 'aquamarine', 'azure',
        'bisque', 'blanchedalmond', 'burlywood', 'cadetblue',
        'chartreuse', 'chocolate', 'cornflowerblue', 'crimson',
        'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray',
        'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen',
        'darkorange', 'darkorchid', 'darkred', 'darksalmon',
        'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise',
        'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dodgerblue',
        'firebrick', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite',
        'goldenrod', 'greenyellow', 'honeydew', 'hotpink', 'indianred',
        'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen',
        'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
        'lightgray', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen',
        'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'limegreen',
        'linen', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
        'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
        'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
        'navajowhite', 'oldlace', 'orangered', 'orchid', 'palegoldenrod',
        'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff',
        'peru', 'plum', 'powderblue', 'rosybrown', 'royalblue', 'saddlebrown',
        'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue',
        'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan',
        'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'whitesmoke', 'yellowgreen'
    ]; // Colores de ejemplo

    for (let i = 0; i < numSegments; i++) {
        colors.push(rainbowColors[i % rainbowColors.length]);
    }

    return colors;
}