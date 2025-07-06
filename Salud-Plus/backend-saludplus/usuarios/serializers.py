from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Doctor, Cita, Reserva # <--- Asegúrate de importar Cita aquí

Paciente = get_user_model()

# --- Serializador de Registro de Paciente ---
class PacienteRegistroSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False,
        min_length=8
    )
    
    class Meta:
        model = Paciente
        fields = ['email', 'nombre_completo', 'password', 'password2']
        extra_kwargs = {
            'password': {
                'write_only': True,
                'min_length': 8,
                'style': {'input_type': 'password'},
                'trim_whitespace': False
            },
            'email': {
                'required': True,
                'allow_blank': False
            }
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                "password2": "Las contraseñas no coinciden."
            })
        
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                "password": list(e.messages)
            })
        
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        validated_data['username'] = validated_data['email'].split('@')[0]
        return Paciente.objects.create_user(**validated_data)

# --- Serializador de Autenticación de Paciente (solo para validación de credenciales) ---
class PacienteAuthSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        write_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email y contraseña son requeridos.")

        user = Paciente.objects.filter(email=email).first()
        
        if not user:
            raise serializers.ValidationError({
                "email": "No existe un usuario con este email."
            })

        if not user.check_password(password):
            raise serializers.ValidationError({
                "password": "Contraseña incorrecta."
            })

        if not user.is_active:
            raise serializers.ValidationError("Esta cuenta está desactivada.")

        attrs['user'] = user
        return attrs

# --- Serializador para Token de Autenticación (incluye is_doctor) ---
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'id': self.user.id,
            'email': self.user.email,
            'nombre_completo': self.user.nombre_completo
        })
        if hasattr(self.user, 'doctor_profile'):
            data['is_doctor'] = True
            data['doctor_id'] = self.user.doctor_profile.id
            data['doctor_especialidad'] = self.user.doctor_profile.especialidad
        else:
            data['is_doctor'] = False
        
        return data

# --- Serializador para Doctor (listado general) ---
class DoctorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.nombre_completo', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'email', 'especialidad', 'universidad']

# --- NUEVOS SERIALIZADORES PARA CITA ---

# Serializador para obtener solo el nombre completo del paciente (anidado en Cita)
class PacienteNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'nombre_completo']

# Serializador para obtener solo el nombre completo y especialidad del doctor (anidado en Cita)
class DoctorNestedSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.nombre_completo', read_only=True)
    specialty = serializers.CharField(source='especialidad', read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty']

# Serializador principal para el modelo Cita
class CitaSerializer(serializers.ModelSerializer):
    # Campos de relación anidados para mostrar información del paciente y doctor
    paciente = PacienteNestedSerializer(read_only=True)
    doctor = DoctorNestedSerializer(read_only=True)

    class Meta:
        model = Cita
        fields = [
            'id', 'paciente', 'doctor', 'fecha', 'hora', 'motivo_consulta', 'estado',
            'observaciones', 'medicamentos_recetados', 'examenes_solicitados',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'paciente', 'doctor', 'created_at', 'updated_at']

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'
        