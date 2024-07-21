from django.shortcuts import render
#from .utils import validar
from django.http import JsonResponse

import numpy as np
from scipy.interpolate import interp1d
import matplotlib.pyplot as plt
import io
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

@csrf_exempt
def calculate_spline(request):
    if request.method == 'POST':
        x_points = request.POST.get('x', 'No data received')
        y_points = request.POST.get('y', 'No data received')
        spline_type = request.POST.get('spline_type', 'quadratic')

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
                steps = calculate_linear_spline(x, y)
            elif spline_type == 'quadratic':
                steps = calculate_quadratic_spline(x, y)
            elif spline_type == 'cubic':
                steps = calculate_cubic_spline(x, y)
            else:
                return HttpResponseBadRequest(f'Tipo de spline no válido: {spline_type}')

            # Devolver la respuesta como JSON
            return JsonResponse({'steps': steps})

        except ValueError as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Método no permitido'}, status=405)


def calculate_linear_spline(x, y):
    # Calcular el spline lineal
    steps = []
    slopes = []
    intercepts = []

    for i in range(len(x) - 1):
        x1, x2 = x[i], x[i+1]
        y1, y2 = y[i], y[i+1]

        slope = (y2 - y1) / (x2 - x1)
        intercept = y1 - slope * x1

        slopes.append(slope)
        intercepts.append(intercept)

        step_detail = {
            'segmento': i + 1,
            'pendiente': slope,
            'interseccion': intercept,
            'ecuacion': f'y = {slope:.2f}x + {intercept:.2f}',
            'detalles': {
                'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
                'calculo_pendiente': f'({y2} - {y1}) / ({x2} - {x1}) = {slope:.2f}',
                'calculo_interseccion': f'{y1} - ({slope:.2f} * {x1}) = {intercept:.2f}'
            }
        }

        steps.append(step_detail)

    return steps


def calculate_quadratic_spline(x, y):
    x = np.array(x)
    y = np.array(y)
    
    n = len(x) - 1
    h = np.diff(x)
    
    # Matriz A y vector b para resolver los coeficientes c
    A = np.zeros((n+1, n+1))
    b = np.zeros(n+1)
    
    A[0, 0] = 1
    A[-1, -1] = 1
    for i in range(1, n):#cambiar a 1
        A[i, i-1] = h[i-1]
        A[i, i] = 2 * (h[i-1] + h[i])
        A[i, i+1] = h[i]
        b[i] = 3 * ((y[i+1] - y[i]) / h[i] - (y[i] - y[i-1]) / h[i-1])
    
    # Resolver para c
    c = np.linalg.solve(A, b)
    
    # Calcular coeficientes a y b
    a = y[:-1]
    b_coeff = (y[1:] - y[:-1]) / h - h * (2 * c[:-1] + c[1:]) / 3

    steps = []
    for i in range(n):
        x1, x2 = x[i], x[i+1]
        y1, y2 = y[i], y[i+1]
        h_i = h[i]
        c_i = c[i]
        c_next = c[i+1]
        
        a_i = a[i]
        b_i = b_coeff[i]
        
        # Calculo de pendientes
        pendiente_inicial = b_i
        pendiente_final = b_i + 2 * c_i * (x2 - x1)
        
        # Calculo de derivadas
        derivada_inicial = pendiente_inicial
        derivada_final = pendiente_final
        
        # Ecuaciones de las derivadas
        derivada_inicial_eq = f"dy/dx = {b_i:.2f}"
        derivada_final_eq = f"dy/dx = {b_i:.2f} + 2*{c_i:.2f}*(x - {x1:.2f}) = {derivada_final:.2f}"
        
        # Detalles del cálculo paso a paso
        step_detail = {
            'segmento': i + 1,
            'a': a_i,
            'b': b_i,
            'c': c_i,
            'ecuacion': f'y = {a_i:.2f} + {b_i:.2f}(x - {x1:.2f}) + {c_i:.2f}(x - {x1:.2f})^2',
            'pendiente_inicial': pendiente_inicial,
            'pendiente_final': pendiente_final,
            'derivada_inicial': derivada_inicial_eq,
            'derivada_final': derivada_final_eq,
            'detalles': {
                'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
                'calculo_a': f'y1 = {y1:.2f}',
                'calculo_b': f'({y2:.2f} - {y1:.2f}) / ({x2:.2f} - {x1:.2f}) - ({h_i:.2f} * (2 * {c_i:.2f} + {c_next:.2f}) / 3) = {b_i:.2f}',
                'calculo_c': f'({y2:.2f} - {y1:.2f}) / {h_i:.2f} - {h_i:.2f} * (2 * {c_i:.2f} + {c_next:.2f}) / 3 = {c_i:.2f}',
                'pendiente_inicial_detalle': f'b = {b_i:.2f}',
                'pendiente_final_detalle': f'b + 2 * c * (x2 - x1) = {b_i:.2f} + 2 * {c_i:.2f} * ({x2 - x1:.2f}) = {pendiente_final:.2f}',
                'derivada_inicial_detalle': derivada_inicial_eq,
                'derivada_final_detalle': derivada_final_eq
            }
        }

        steps.append(step_detail)

    return steps

def calculate_cubic_spline(x, y):
    x = np.array(x)
    y = np.array(y)
    
    n = len(x) - 1
    h = np.diff(x)
    
    # Matriz A y vector b para resolver los coeficientes c
    A = np.zeros((n+1, n+1))
    b = np.zeros(n+1)
    
    A[0, 0] = 1
    A[-1, -1] = 1
    for i in range(1, n):
        A[i, i-1] = h[i-1]
        A[i, i] = 2 * (h[i-1] + h[i])
        A[i, i+1] = h[i]
        b[i] = 3 * ((y[i+1] - y[i]) / h[i] - (y[i] - y[i-1]) / h[i-1])
    
    # Resolver para c
    c = np.linalg.solve(A, b)
    
    # Calcular coeficientes a, b, y d
    a = y[:-1]
    b_coeff = (y[1:] - y[:-1]) / h - h * (2 * c[:-1] + c[1:]) / 3
    d = (c[1:] - c[:-1]) / (3 * h)

    steps = []
    for i in range(n):
        x1, x2 = x[i], x[i+1]
        y1, y2 = y[i], y[i+1]
        h_i = h[i]
        c_i = c[i]
        c_next = c[i+1]
        
        a_i = a[i]
        b_i = b_coeff[i]
        d_i = d[i] if i < n-1 else 0  # Manejar el último valor de d
        
        # Calculo de pendientes
        pendiente_inicial = b_i
        pendiente_final = b_i + 2 * c_i * (x2 - x1) + 3 * d_i * (x2 - x1)**2
        
        # Calculo de derivadas
        derivada_inicial = pendiente_inicial
        derivada_final = pendiente_final
        
        # Ecuaciones de las derivadas
        derivada_inicial_eq = f"dy/dx = {b_i:.2f} + 2*{c_i:.2f}(x - {x1:.2f}) + 3*{d_i:.2f}(x - {x1:.2f})^2"
        derivada_final_eq = f"dy/dx = {b_i:.2f} + 2*{c_i:.2f}(x - {x1:.2f}) + 3*{d_i:.2f}(x - {x1:.2f})^2 = {derivada_final:.2f}"
        
        # Detalles del cálculo paso a paso
        step_detail = {
            'segmento': i + 1,
            'a': a_i,
            'b': b_i,
            'c': c_i,
            'd': d_i,
            'ecuacion': f'y = {a_i:.2f} + {b_i:.2f}(x - {x1:.2f}) + {c_i:.2f}(x - {x1:.2f})^2 + {d_i:.2f}(x - {x1:.2f})^3',
            'pendiente_inicial': pendiente_inicial,
            'pendiente_final': pendiente_final,
            'derivada_inicial': derivada_inicial_eq,
            'derivada_final': derivada_final_eq,
            'detalles': {
                'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2,
                'calculo_a': f'y1 = {y1:.2f}',
                'calculo_b': f'({y2:.2f} - {y1:.2f}) / ({x2:.2f} - {x1:.2f}) - ({h_i:.2f} * (2 * {c_i:.2f} + {c_next:.2f}) / 3) = {b_i:.2f}',
                'calculo_c': f'({y2:.2f} - {y1:.2f}) / {h_i:.2f} - {h_i:.2f} * (2 * {c_i:.2f} + {c_next:.2f}) / 3 = {c_i:.2f}',
                'calculo_d': f'({c_next:.2f} - {c_i:.2f}) / (3 * {h_i:.2f}) = {d_i:.2f}',
                'pendiente_inicial_detalle': f'b = {b_i:.2f}',
                'pendiente_final_detalle': f'b + 2 * c * (x2 - x1) + 3 * d * (x2 - x1)^2 = {b_i:.2f} + 2 * {c_i:.2f} * ({x2 - x1:.2f}) + 3 * {d_i:.2f} * ({(x2 - x1):.2f})^2 = {pendiente_final:.2f}',
                'derivada_inicial_detalle': derivada_inicial_eq,
                'derivada_final_detalle': derivada_final_eq
            }
        }

        steps.append(step_detail)

    return steps