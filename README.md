# Plataforma de Servicios de Limpieza

Bienvenido a la Plataforma de Servicios de Limpieza, una aplicación web moderna diseñada para conectar a clientes con personal de limpieza calificado. Este proyecto facilita la gestión de solicitudes de limpieza, asignación de personal y seguimiento de servicios.

## 🚀 Características Principales

- **Gestión de Usuarios**: Registro y autenticación para Clientes y Personal de Limpieza.
- **Solicitudes de Servicio**: Los clientes pueden solicitar servicios de limpieza detallando fecha, hora y tipo de servicio.
- **Asignación de Personal**: El sistema permite asignar personal a las solicitudes (o auto-asignación según la lógica de negocio).
- **Panel de Control**: Vistas personalizadas para clientes y personal.
- **Verificación de Documentos**: Flujo de carga y verificación de documentos para el personal de limpieza.

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack tecnológico robusto y moderno:

- **Frontend**: [Next.js](https://nextjs.org/) (React Framework)
- **Backend**: Next.js API Routes
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [pg](https://node-postgres.com/) (Cliente PostgreSQL para Node.js)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Autenticación**: JWT & Bcrypt
- **Manejo de Archivos**: Sistema de carga de archivos local

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada)
- [PostgreSQL](https://www.postgresql.org/download/) (Base de datos local o remota)
- Git

## ⚙️ Instalación y Configuración

Sigue estos pasos para configurar el proyecto en tu entorno local:

1.  **Clonar el repositorio**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd proyecto-customer
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar Variables de Entorno**

    Crea un archivo `.env.local` en la raíz del proyecto y agrega las siguientes variables. Asegúrate de ajustar los valores según tu configuración de PostgreSQL:

    ``env
    # Configuración de Base de Datos
    DB_USER=postgres
    DB_PASSWORD=tu_contraseña
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=limpieza-db
    DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/limpieza-db

    # Configuración de Correo (SMTP)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=tu_email@gmail.com
    SMTP_PASS=tu_contraseña_de_aplicacion

    # URL de la Aplicación
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Configurar la Base de Datos**

    Este proyecto incluye un archivo `schema.sql` para inicializar la base de datos.

    - Crea la base de datos en PostgreSQL (ej. `limpieza-db`).
    

    *Alternativamente, puedes copiar el contenido de `schema.sql` y ejecutarlo en tu herramienta de administración de base de datos favorita (pgAdmin, DBeaver, TablePlus).*
    


6.  **Ejecutar el Servidor de Desarrollo**

    ```bash
    npm run dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📂 Estructura del Proyecto

- `/app`: Páginas y rutas de la aplicación (Next.js App Router).
- `/app/api`: Endpoints de la API backend.
- `/components`: Componentes de React reutilizables.
- `/lib`: Utilidades y configuración de base de datos (`db.js`).
- `/public`: Archivos estáticos y cargas de documentos.
- `/scripts`: Scripts de utilidad para mantenimiento de la base de datos.
- `schema.sql`: Definición de la estructura de la base de datos.

## 🤝 Contribución

Si deseas contribuir a este proyecto, por favor crea un fork y envía un Pull Request con tus mejoras.

---

Equipo de trabajo:
Benites Mendoza Fernando
Castillo Pezo Mateo

