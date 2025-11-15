# Medical App Backend - API REST

Backend completo para aplicación médica con autenticación biométrica, gestión de expedientes clínicos, citas médicas y control de accesos.

## 🚀 Tecnologías

- **Node.js** + **Express** - Servidor y API REST
- **JWT** - Autenticación y autorización
- **RabbitMQ** - Mensajería asíncrona
- **Bcrypt** - Cifrado de contraseñas
- **Multer** - Subida de archivos
- **Express Validator** - Validación de datos

## 📁 Estructura del Proyecto

```
App_Server/
├── config/              # Configuraciones (JWT, roles)
├── controllers/         # Lógica de negocio
├── routes/             # Rutas de la API
├── services/           # Servicios (RabbitMQ, biométrico)
├── data/               # Datos mock
├── server.js           # Punto de entrada
└── package.json        # Dependencias

Middleware/
├── auth.middleware.js         # Autenticación JWT
├── authorization.middleware.js # Control de roles y permisos
├── validation.middleware.js    # Validación de datos
└── errorHandler.middleware.js  # Manejo de errores
```

## 🔧 Instalación

### 1. Instalar dependencias

```bash
cd App_Server
npm install
```

### 2. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu-clave-secreta-super-segura
RABBITMQ_URL=amqp://localhost:5672
```

### 3. Crear directorio de uploads

```bash
mkdir -p uploads/documents
```

### 4. Instalar RabbitMQ (opcional para desarrollo)

**macOS:**
```bash
brew install rabbitmq
brew services start rabbitmq
```

**Ubuntu/Debian:**
```bash
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

**Windows:**
Descargar desde https://www.rabbitmq.com/download.html

**Docker:**
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

## 🏃 Ejecución

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Documentación de la API

### Base URL
```
http://localhost:3000/api
```

### Autenticación

Todas las rutas protegidas requieren header de autorización:
```
Authorization: Bearer {token}
```

---

## 🔐 Auth Endpoints

### POST /api/auth/login
Login con email y contraseña

**Request:**
```json
{
  "email": "paciente@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "uuid",
    "email": "paciente@email.com",
    "name": "Carlos López",
    "role": "patient"
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### POST /api/auth/register
Registrar nuevo usuario

**Request:**
```json
{
  "email": "nuevo@email.com",
  "password": "password123",
  "name": "Juan Pérez",
  "phone": "+52 55 1234 5678",
  "role": "patient"
}
```

### POST /api/auth/biometric/init
Iniciar autenticación biométrica

**Request:**
```json
{
  "email": "paciente@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid",
  "challenge": "base64-challenge",
  "expiresIn": 30000
}
```

### POST /api/auth/biometric/verify
Verificar autenticación biométrica

**Request:**
```json
{
  "sessionId": "uuid",
  "biometricData": "fingerprint-data",
  "email": "paciente@email.com"
}
```

---

## 👤 Patient Endpoints

### GET /api/patients
Obtener lista de pacientes (Admin/Doctor)

**Query params:**
- `search` - Buscar por nombre o ID
- `limit` - Número de resultados (default: 50)
- `offset` - Paginación (default: 0)

### GET /api/patients/:patientId
Obtener expediente completo de un paciente

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": { /* datos del paciente */ },
    "consultations": [ /* historial clínico */ ],
    "documents": [ /* documentos médicos */ ],
    "summary": {
      "totalConsultations": 5,
      "totalDocuments": 12,
      "lastVisit": "2024-11-10"
    }
  }
}
```

### POST /api/patients/:patientId/consultations
Crear nueva consulta médica (Doctor/Admin)

**Request:**
```json
{
  "chiefComplaint": "Dolor de cabeza",
  "symptoms": ["Cefalea", "Mareo"],
  "vitalSigns": {
    "bloodPressure": "120/80",
    "heartRate": 75,
    "temperature": 36.5
  },
  "diagnosis": "Cefalea tensional",
  "treatment": "Ibuprofeno 400mg cada 8 horas",
  "prescription": [
    {
      "medication": "Ibuprofeno",
      "dose": "400mg",
      "frequency": "Cada 8 horas",
      "duration": "5 días"
    }
  ]
}
```

---

## 📅 Appointment Endpoints

### GET /api/appointments
Obtener citas del usuario

**Query params:**
- `status` - programada | completada | cancelada
- `startDate` - Fecha inicial (YYYY-MM-DD)
- `endDate` - Fecha final (YYYY-MM-DD)
- `doctorId` - Filtrar por doctor

### POST /api/appointments
Crear nueva cita

**Request:**
```json
{
  "patientId": "PAT-001",
  "doctorId": "uuid-doctor",
  "date": "2024-11-25",
  "time": "10:00",
  "type": "Consulta",
  "reason": "Revisión anual"
}
```

### POST /api/appointments/:appointmentId/cancel
Cancelar cita

**Request:**
```json
{
  "reason": "No puedo asistir"
}
```

---

## 📄 Document Endpoints

### GET /api/documents/patient/:patientId
Obtener documentos de un paciente

**Query params:**
- `type` - laboratorio | imagen | receta | vacuna
- `category` - Filtrar por categoría

### POST /api/documents/patient/:patientId
Subir documento (Doctor/Admin)

**Request:** Multipart form-data
```
file: [archivo PDF/imagen]
type: "laboratorio"
name: "Análisis de sangre"
description: "Resultados de biometría"
category: "Laboratorio"
tags: "sangre,biometría"
```

### DELETE /api/documents/:documentId
Eliminar documento (Admin/quien lo subió)

---

## 🔓 Access Endpoints

### GET /api/access/patient/:patientId
Obtener permisos de acceso de un paciente

### POST /api/access/patient/:patientId/grant
Otorgar permiso de acceso (requiere biométrico)

**Headers:**
```
X-Biometric-Token: biometric-token
```

**Request:**
```json
{
  "grantedTo": "uuid-usuario",
  "permissions": ["read", "write"],
  "expiresAt": "2025-12-31"
}
```

### POST /api/access/:permissionId/revoke
Revocar permiso (requiere biométrico)

---

## 👨‍💼 Profile Endpoints

### GET /api/profile
Obtener perfil del usuario actual

### PATCH /api/profile
Actualizar perfil

**Request:**
```json
{
  "name": "Nuevo Nombre",
  "phone": "+52 55 9999 8888"
}
```

### POST /api/profile/change-password
Cambiar contraseña

**Request:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

### POST /api/profile/biometric
Configurar autenticación biométrica

**Request:**
```json
{
  "enabled": true,
  "biometricData": "fingerprint-data"
}
```

---

## 👥 Roles y Permisos

### Roles disponibles:
- **admin** - Acceso total al sistema
- **doctor** - Gestión de pacientes, consultas y documentos
- **patient** - Acceso a su propio expediente y citas
- **tutor** - Acceso a expedientes de dependientes

### Permisos por rol:

**Admin:**
- Todos los permisos del sistema
- Gestión de usuarios
- Configuración del sistema

**Doctor:**
- Ver y actualizar pacientes
- Crear consultas
- Subir documentos médicos
- Ver y crear citas

**Patient:**
- Ver su propio expediente
- Crear y cancelar citas
- Gestionar permisos de acceso
- Ver documentos

**Tutor:**
- Ver expedientes de dependientes
- Crear y cancelar citas para dependientes
- Gestionar permisos de acceso para dependientes

---

## 📨 RabbitMQ - Eventos

El sistema publica eventos en RabbitMQ para procesamiento asíncrono:

### Colas:
- `appointments_queue` - Eventos de citas
- `documents_queue` - Eventos de documentos
- `notifications_queue` - Notificaciones

### Eventos publicados:

**appointment.created**
```json
{
  "action": "created",
  "data": { /* datos de la cita */ },
  "timestamp": "2024-11-15T10:00:00Z"
}
```

**document.uploaded**
```json
{
  "action": "uploaded",
  "data": { /* datos del documento */ },
  "timestamp": "2024-11-15T10:00:00Z"
}
```

**notification.***
```json
{
  "type": "appointment_created",
  "message": "Nueva cita programada",
  "timestamp": "2024-11-15T10:00:00Z"
}
```

---

## 🧪 Datos de Prueba

### Usuarios de prueba:

**Administrador:**
- Email: `admin@medical.com`
- Password: `password123`
- Role: admin

**Doctor - Cardiología:**
- Email: `dra.garcia@medical.com`
- Password: `password123`
- Role: doctor

**Doctor - Pediatría:**
- Email: `dr.martinez@medical.com`
- Password: `password123`
- Role: doctor

**Paciente:**
- Email: `paciente@email.com`
- Password: `password123`
- Role: patient

**Tutor:**
- Email: `tutor@email.com`
- Password: `password123`
- Role: tutor

---

## 🔒 Seguridad

### Características implementadas:

1. **JWT** - Tokens de autenticación con expiración
2. **Bcrypt** - Hash de contraseñas (10 rounds)
3. **Helmet** - Headers de seguridad HTTP
4. **CORS** - Control de origen cruzado
5. **Rate Limiting** - Límite de peticiones
6. **Validación** - Validación de entrada con express-validator
7. **Autenticación biométrica** - Capa adicional de seguridad
8. **Roles y permisos** - Control de acceso basado en roles

### Recomendaciones para producción:

1. Usar HTTPS en producción
2. Cambiar JWT_SECRET a una clave fuerte
3. Configurar rate limiting más estricto
4. Implementar logs de auditoría
5. Usar base de datos real (PostgreSQL/MongoDB)
6. Implementar sistema de backup
7. Monitoreo y alertas

---

## 🐛 Manejo de Errores

Todos los errores siguen el formato:

```json
{
  "error": "Tipo de error",
  "message": "Descripción del error",
  "details": { /* detalles adicionales */ }
}
```

### Códigos de estado HTTP:

- `200` - OK
- `201` - Created
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `409` - Conflict (duplicado)
- `413` - Payload Too Large
- `500` - Internal Server Error

---

## 📞 Soporte

Para dudas o problemas, consultar la documentación o contactar al equipo de desarrollo.

## 📝 Licencia

ISC
