# Aquí las operaciones matemáticas
import numpy as np
import matplotlib.pyplot as plt # type: ignore
from scipy.interpolate import interpld

def validar(request):
    try:
        data = request.POST.get('data', 'No data received')
        return {'data': data}
    except Exception as e:
        return {'error': 'ERROR!'}

def calcularSplineLineal(request):
    try:
        #data = request.POST.get('data', 'Datos no recibidos')
        # Datos de ejemplo
        x = np.array([0, 1, 2, 3, 4, 5])
        y = np.array([0, 2, 1, 3, 7, 8])

        # Calcular las pendientes y las intersecciones
        slopes = []
        intercepts = []
        for i in range(len(x) - 1):
            slope = (y[i+1] - y[i]) / (x[i+1] - x[i])
            intercept = y[i] - slope * x[i]
            slopes.append(slope)
            intercepts.append(intercept)

        # Crear el spline lineal manualmente y mostrar cada paso
        x_nuevos = np.linspace(0, 5, 100)
        y_nuevos = np.zeros_like(x_nuevos)
        for i in range(len(x) - 1):
            mask = (x_nuevos >= x[i]) & (x_nuevos <= x[i+1])
            y_nuevos[mask] = slopes[i] * x_nuevos[mask] + intercepts[i]

        return {'data': [{
            'x': x,
            'y': y,
            'newX': x_nuevos,
            'newY': y_nuevos,
            'slopes': slopes,
            'intercepts': intercepts,
        }]}
    except Exception as e:
        return {'error': 'ERROR!'}