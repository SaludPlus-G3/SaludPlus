🏥 SaludPlus - Plataforma de Agendamiento Médico
Este proyecto corresponde a la plataforma web inicial del centro médico SaludPlus, diseñada para:

Dar a conocer SaludPlus y a sus médicos.

Registrar a los futuros pacientes.

Reservar horas médicas.

Visualizar sus citas.

Representar a los usuarios: paciente, doctor y administrador.

🚀 Tecnologías
El proyecto SaludPlus está construido utilizando las siguientes tecnologías:

Frontend: Angular (versión 19.2.0)

Backend: Django (con Django REST Framework)

Base de Datos: PostgreSQL

Contenerización: Docker 

Control de Versiones: Git

▶️ Ejecución Local (sin Docker)
Para ejecutar el proyecto localmente sin Docker, sigue los pasos para el backend (Django) y el frontend (Angular).

Backend (Django)
Navega al directorio del backend:

cd backend-saludplus

Crea y activa un entorno virtual (recomendado):

python -m venv venv
# En Windows:
.\venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate

Instalar las dependencias de Python:

pip install -r requirements.txt

Configurar las variables de entorno:
Crear un archivo .env en el directorio backend-saludplus con las siguientes variables.

SECRET_KEY=tu_secret_key_aqui_cambiala_en_produccion
DEBUG=True
DB_NAME=saludplus_db
DB_USER=saludplus_user
DB_PASSWORD=saludplus_password
DB_HOST=localhost # O la IP de tu servidor PostgreSQL local
DB_PORT=5432



Realizar las migraciones de la base de datos:

python manage.py migrate

Crea un superusuario, para acceder al admin de Django:

python manage.py createsuperuser

Inicia el servidor de desarrollo de Django:

python manage.py runserver

El backend estará disponible en http://127.0.0.1:8000.

Frontend (Angular)
Navega al directorio del frontend:

cd frontend-saludplus

Instala las dependencias de Node.js:

npm install

Inicia el servidor de desarrollo de Angular:

ng serve

Accede a la aplicación en tu navegador:
Abre tu navegador y ve a http://localhost:4200.

Credenciales de Prueba:
Para visualizar las interfaces de usuario:

1) Doctor:

Email: luismendez@redsalud.cl

Contraseña: Tomas

2) Administrador:

Email: Administrador@redsalud.cl

Contraseña: Tomas2001

3) Paciente:

Email: JuanPerez@gmail.cl

Contraseña: Juan123

🐳 Ejecución con Docker 


Para construir las imagenes y levantar los servicios:
docker-compose up --build

Accede a tu aplicación:
Una vez que los servicios estén levantados, abre tu navegador y ve a:

http://localhost:4200


