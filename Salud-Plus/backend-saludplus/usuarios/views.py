from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import Paciente, Doctor, Cita # Asegúrate de que Cita esté importado
from .serializers import (
    CustomTokenObtainPairSerializer,
    PacienteRegistroSerializer,
    DoctorSerializer,
    CitaSerializer # Asegúrate de que CitaSerializer esté importado
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.shortcuts import get_object_or_404
from django.db import IntegrityError # Importar IntegrityError para manejo de errores de BD

# Obtener el modelo de usuario personalizado
Paciente = get_user_model()

# --- Vistas de Autenticación y Registro ---

class RegistroPacienteView(generics.CreateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteRegistroSerializer
    permission_classes = [AllowAny] # Permitir a cualquiera registrarse

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            paciente = serializer.save()

            # Generar tokens JWT para el nuevo usuario
            token_serializer = CustomTokenObtainPairSerializer()
            # Necesitamos pasar las credenciales para validar y obtener los tokens
            token_data = token_serializer.validate({
                'email': paciente.email,
                'password': request.data['password'] # Usar la contraseña enviada en la solicitud de registro
            })

            response_data = {
                "status": "success",
                "message": "Usuario registrado exitosamente",
                "user": {
                    "id": paciente.id,
                    "email": paciente.email,
                    "nombre_completo": paciente.nombre_completo
                },
                "tokens": token_data
            }

            return Response(response_data, status=status.HTTP_201_CREATED)

        except DRFValidationError as e:
            # Captura errores de validación del serializador
            return Response({
                "status": "error",
                "errors": e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            # Captura errores de integridad de la base de datos (ej. email duplicado)
            return Response({
                "status": "error",
                "message": "El email ya está registrado. Por favor, use otro email o inicie sesión.",
                "errors": {"email": ["Este email ya existe."]}
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Captura cualquier otro error inesperado
            print(f"Error inesperado durante el registro: {e}")
            return Response({
                "status": "error",
                "message": "Error interno del servidor durante el registro.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtener tokens JWT.
    Permite a cualquier usuario (no autenticado) obtener tokens.
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny] # ¡CRÍTICO! Permite el acceso sin autenticación para obtener el token.

# --- Vista para obtener detalles del Paciente (usuario logueado) ---
class PacienteDetailView(generics.RetrieveAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteRegistroSerializer # O un serializador más simple si solo necesitas detalles
    permission_classes = [IsAuthenticated] # Solo usuarios autenticados pueden ver sus propios detalles

    def get_object(self):
        # Retorna el objeto Paciente asociado al usuario autenticado
        return self.request.user

# --- Vista para listar Doctores ---
class DoctorListView(generics.ListAPIView):
    """
    Permite listar todos los doctores.
    Puede ser accesible públicamente o requerir autenticación según el caso de uso.
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny] # Los doctores pueden ser listados públicamente

# --- Vistas para Cita (DENTRO DE USUARIOS) ---

class DoctorCitasListView(generics.ListAPIView):
    """
    Permite a un doctor autenticado ver la lista de sus propias citas.
    """
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated] # Requiere autenticación

    def get_queryset(self):
        # Asegurarse de que el usuario autenticado es un doctor
        if not hasattr(self.request.user, 'doctor_profile'):
            raise DRFValidationError("Acceso denegado. Solo los doctores pueden ver sus citas.")
        
        # Filtrar citas por el doctor logueado
        doctor_id = self.request.user.doctor_profile.id
        # Usar select_related para optimizar la consulta y obtener datos del paciente y usuario del doctor
        return Cita.objects.filter(doctor__id=doctor_id).select_related('paciente', 'doctor__user').order_by('fecha', 'hora')

class CitaDetailUpdateView(generics.RetrieveUpdateAPIView):
    """
    Permite a un doctor autenticado ver los detalles y actualizar una cita específica.
    Solo el doctor asignado a la cita puede actualizarla.
    """
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated] # Requiere autenticación
    lookup_field = 'pk' # El campo para buscar el objeto (por defecto es 'pk')

    def get_object(self):
        # Obtener el objeto Cita por su PK
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        
        # Verificar que el usuario autenticado es el doctor asignado a esta cita
        if not hasattr(self.request.user, 'doctor_profile') or obj.doctor.user != self.request.user:
            raise DRFValidationError("No tienes permiso para ver o actualizar esta cita.")
        return obj

    def perform_update(self, serializer):
        # Al actualizar la cita, si se proporcionan observaciones/medicamentos/exámenes,
        # automáticamente cambiar el estado a 'Completada'.
        if (serializer.validated_data.get('observaciones') is not None or
            serializer.validated_data.get('medicamentos_recetados') is not None or
            serializer.validated_data.get('examenes_solicitados') is not None):
            serializer.save(estado='Completada')
        else:
            serializer.save() # Si no hay campos relevantes, simplemente guardar
