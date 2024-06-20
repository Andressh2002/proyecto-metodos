from django.shortcuts import render
#from .utils import validar
from django.http import JsonResponse

import numpy as np
from scipy.interpolate import interp1d
import matplotlib.pyplot as plt
import io
import urllib, base64
import base64
import urllib.parse
from django.http import HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

# Vistas de la aplicación.
def inicio(request):
    return render(request, 'pages/inicio.html')

def manual(request):
    return render(request, 'pages/manual.html')

def splines(request):
    return render(request, 'pages/splines.html')

def aplicacion(request):
    return render(request, 'pages/aplicacion.html')

# Métodos matemáticos.
""" def calculate(request):
    if request.method == 'POST':
        return JsonResponse(validar(request))
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400) """

""" def calculate_spline(request):
    if request.method == "POST":
        x_points = request.POST.get('x', 'No data received')
        y_points = request.POST.get('y', 'No data received')
        spline_type = request.POST.get("spline_type", 'No data received')
        
        try:
            x = [float(xi) for xi in x_points.split(',')]
            y = [float(yi) for yi in y_points.split(',')]
        except ValueError as e:
            return HttpResponseBadRequest(f"Error al convertir los puntos a números: {e}")

        if len(x) != len(y):
            return HttpResponseBadRequest("La cantidad de puntos x y y no coincide.")

        x = np.array(x)
        y = np.array(y)

        steps = []

        if spline_type == 'linear':
            steps.append("Tipo de spline: Lineal")
            slopes = []
            intercepts = []
            for i in range(len(x) - 1):
                slope = (y[i+1] - y[i]) / (x[i+1] - x[i])
                intercept = y[i] - slope * x[i]
                slopes.append(slope)
                intercepts.append(intercept)
                steps.append(f"Segmento {i+1}: Pendiente = {slope:.2f}, Intersección = {intercept:.2f}, Ecuación: y = {slope:.2f}x + {intercept:.2f}")

            spline = interp1d(x, y, kind='linear')
        
        elif spline_type == 'quadratic':
            steps.append("Tipo de spline: Cuadrático")
            spline = interp1d(x, y, kind='quadratic')
            steps.append("Cálculo del spline cuadrático completado.")
        
        elif spline_type == 'cubic':
            steps.append("Tipo de spline: Cúbico")
            spline = interp1d(x, y, kind='cubic')
            steps.append("Cálculo del spline cúbico completado.")
        else:
            return HttpResponseBadRequest(f"Tipo de spline no reconocido: {spline_type}")

        x_nuevos = np.linspace(min(x), max(x), 500)
        y_nuevos = spline(x_nuevos)

        plt.figure(figsize=(10, 6))
        plt.scatter(x, y, label='Datos originales')
        plt.plot(x_nuevos, y_nuevos, label=f'Spline {spline_type}', color='red')
        plt.legend()
        plt.xlabel('x')
        plt.ylabel('y')
        plt.title(f'Spline {spline_type.capitalize()}')

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        string = base64.b64encode(buf.read())
        uri = urllib.parse.quote(string)
        return render(request, 'components/responseAll.html', {'plot_url': 'data:image/png;base64,' + uri, 'steps': steps})

    return render(request, 'components/responseAll.html') """

@csrf_exempt
def calculate_spline(request):
    if request.method == 'POST':
        x_points = request.POST.get('x', 'No data received')
        y_points = request.POST.get('y', 'No data received')
        spline_type = request.POST.get('spline_type', 'linear')

        try:
            x = [float(xi) for xi in x_points.split(',')]
            y = [float(yi) for yi in y_points.split(',')]

            if len(x) != len(y):
                return HttpResponseBadRequest("La cantidad de puntos x y y no coincide.")

            # Convertir a numpy arrays
            x = np.array(x)
            y = np.array(y)

            # Calcular el spline según el tipo especificado
            if spline_type == 'linear':
                steps, plot_url = calculate_linear_spline(x, y)
            elif spline_type == 'quadratic':
                steps, plot_url = calculate_quadratic_spline(x, y)
            elif spline_type == 'cubic':
                steps, plot_url = calculate_cubic_spline(x, y)
            else:
                return HttpResponseBadRequest(f'Tipo de spline no válido: {spline_type}')

            # Devolver la respuesta como JSON
            return JsonResponse({'steps': steps, 'plot_url': plot_url})

        except ValueError as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Método no permitido'}, status=405)


def calculate_linear_spline(x, y):
    # Calcular el spline lineal
    steps = []
    slopes = []
    intercepts = []

    for i in range(len(x) - 1):
        slope = (y[i+1] - y[i]) / (x[i+1] - x[i])
        intercept = y[i] - slope * x[i]
        slopes.append(slope)
        intercepts.append(intercept)
        steps.append({
            'segmento': i + 1,
            'pendiente': slope,
            'interseccion': intercept,
            'ecuacion': f'y = {slope:.2f}x + {intercept:.2f}'
        })

    # Generar gráfico
    x_new = np.linspace(min(x), max(x), 500)
    spline = interp1d(x, y, kind='linear')
    y_new = spline(x_new)

    plt.figure(figsize=(10, 6))
    plt.scatter(x, y, label='Datos originales')
    plt.plot(x_new, y_new, label='Spline Lineal', color='red')
    plt.legend()
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Spline Lineal')

    # Convertir la imagen a base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plot_url = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return steps, plot_url


def calculate_quadratic_spline(x, y):
    # Calcular el spline cuadrático
    steps = ["Cálculo del spline cuadrático:"]
    spline = interp1d(x, y, kind='quadratic')

    # Generar gráfico
    x_new = np.linspace(min(x), max(x), 500)
    y_new = spline(x_new)

    plt.figure(figsize=(10, 6))
    plt.scatter(x, y, label='Datos originales')
    plt.plot(x_new, y_new, label='Spline Cuadrático', color='red')
    plt.legend()
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Spline Cuadrático')

    # Convertir la imagen a base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plot_url = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return steps, plot_url


def calculate_cubic_spline(x, y):
    # Calcular el spline cúbico
    steps = ["Cálculo del spline cúbico:"]
    spline = interp1d(x, y, kind='cubic')

    # Generar gráfico
    x_new = np.linspace(min(x), max(x), 500)
    y_new = spline(x_new)

    plt.figure(figsize=(10, 6))
    plt.scatter(x, y, label='Datos originales')
    plt.plot(x_new, y_new, label='Spline Cúbico', color='red')
    plt.legend()
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Spline Cúbico')

    # Convertir la imagen a base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plot_url = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return steps, plot_url