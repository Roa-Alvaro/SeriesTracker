SeriesTracker
Plataforma Full-Stack orientada a la gestión personal y el seguimiento detallado de contenido audiovisual (series de televisión). Este proyecto ha sido diseñado y desarrollado como el Trabajo Final del módulo de Proyecto para el Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW).

🛠️ Estructura del Proyecto
El repositorio está configurado bajo una arquitectura de monorrepo, manteniendo un desacoplamiento nítido entre el servidor y el cliente:

seriestracker-backend: API RESTful pura encargada de la lógica de negocio y el control transaccional.

seriestracker-frontend: Single Page Application (SPA) encargada de la interfaz gráfica y la experiencia de usuario.

🚀 Tecnologías Utilizadas
Backend: Java 17, Spring Boot, Spring Security 6 (Autenticación basada en sesión imperativa), Spring Data JPA.

Frontend: React, React Router DOM, Context API, JavaScript, Vite.

Persistencia: MySQL Server.

⚙️ Despliegue Rápido en Local
1. Servidor (Backend)
Crea una base de datos en MySQL llamada seriestracker.

Modifica el archivo application.properties con tus credenciales locales.

Ejecuta el comando para arrancar la API en el puerto 8080:
./mvnw spring-boot:run

2. Cliente (Frontend)
Accede al directorio del frontend e instala los módulos necesarios:
npm install

Inicia el servidor de desarrollo en el puerto 5173:
npm run dev
