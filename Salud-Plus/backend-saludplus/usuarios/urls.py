# usuarios/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # Importa TokenRefreshView
from .views import ( ReservaListCreateView )

from .views import (
    RegistroPacienteView,
    CustomTokenObtainPairView,
    DoctorListView,       
    DoctorCitasListView,   
    CitaDetailUpdateView,  
)

urlpatterns = [
    
    path('registro/', RegistroPacienteView.as_view(), name='registro'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    
   
    path('doctores/', DoctorListView.as_view(), name='doctor-list'), 
    
   
    path('citas/doctor/', DoctorCitasListView.as_view(), name='doctor-citas-list'), 
    path('citas/<int:pk>/', CitaDetailUpdateView.as_view(), name='cita-detail-update'),
    path('reservas/', ReservaListCreateView.as_view(), name='reserva-list-create'),
]