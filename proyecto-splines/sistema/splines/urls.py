from django.urls import path
from . import views

urlpatterns = [

    # Vistas
    path('', views.inicio, name='inicio'),
    path('manual', views.manual, name='manual'),
    path('informacion/splines', views.splines, name='splines'),
    path('informacion/aplicacion', views.aplicacion, name='aplicacion'),

    # Cálculos
    path('calculate', views.calculate_spline, name='calculate_spline'),
]
