import numpy as np
import matplotlib.pyplot as plt

# Datos de ejemplo
x = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9,  10])
y = np.array([0, 2, 1, 3, 7, 8, 6, 7, 9, 11, 8])

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

# Graficar los datos originales y el spline
plt.scatter(x, y, label='Datos originales')
plt.plot(x_nuevos, y_nuevos, label='Spline lineal', color='red')

# Mostrar cada segmento del spline con los cálculos
for i in range(len(x) - 1):
    plt.plot([x[i], x[i+1]], [y[i], y[i+1]], 'o-', label=f'Segmento {i+1}: y = {slopes[i]:.2f}x + {intercepts[i]:.2f}')
    print(f"Segmento {i+1}:")
    print(f"  Punto 1: ({x[i]}, {y[i]})")
    print(f"  Punto 2: ({x[i+1]}, {y[i+1]})")
    print(f"  Pendiente: {slopes[i]:.2f}")
    print(f"  Intersección: {intercepts[i]:.2f}")
    print(f"  Ecuación del segmento: y = {slopes[i]:.2f}x + {intercepts[i]:.2f}\n")

plt.legend()
plt.xlabel('x')
plt.ylabel('y')
plt.title('Spline Lineal con Cálculos Paso a Paso')
plt.show()