from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator
from .managers import PacienteManager

class Paciente(AbstractUser):
    # Hacer que username no sea obligatorio
    username = models.CharField(
        max_length=150,
        unique=False,  
        blank=True,   
        null=True     
    )
    
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator(message="Ingrese un email válido.")]
    )
    nombre_completo = models.CharField(max_length=150, verbose_name="Nombre completo")

    # Configuración clave para usar email como identificador
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre_completo']  # username ya no es requerido
    objects = PacienteManager()

    class Meta:
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
       
        if not self.username:
            self.username = self.email.split('@')[0]  # Usa la parte antes del @
        super().save(*args, **kwargs)
class Doctor(models.Model):
   
    user = models.OneToOneField(Paciente, on_delete=models.CASCADE, related_name='doctor_profile')
    especialidad = models.CharField(max_length=100)
    universidad = models.CharField(max_length=100)
    

    def __str__(self):
        return self.user.nombre_completo 

    class Meta:
        verbose_name = "Doctor"
        verbose_name_plural = "Doctores"

class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='citas_paciente')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='citas_doctor')
    
    fecha = models.DateField()
    hora = models.TimeField()
    motivo_consulta = models.TextField()
    
    ESTADO_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('Confirmada', 'Confirmada'),
        ('Completada', 'Completada'), # Se usará cuando el doctor guarde los detalles
        ('Cancelada', 'Cancelada'),
    ]
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES, default='Pendiente')

    # Campos que el doctor llenará después de la consulta
    observaciones = models.TextField(blank=True, null=True)
    medicamentos_recetados = models.TextField(blank=True, null=True)
    examenes_solicitados = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Asegura que un doctor no tenga dos citas a la misma hora en la misma fecha
        unique_together = ('doctor', 'fecha', 'hora')
        # Ordena las citas por fecha y hora por defecto
        ordering = ['fecha', 'hora']
        verbose_name = "Cita"
        verbose_name_plural = "Citas"

    def __str__(self):
        return f"Cita de {self.paciente.nombre_completo} con {self.doctor.user.nombre_completo} el {self.fecha} a las {self.hora}"