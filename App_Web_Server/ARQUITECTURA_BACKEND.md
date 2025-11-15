# Arquitectura del Backend - Aplicación Médica

## 📐 Arquitectura General

```
┌─────────────────┐
│   Frontend      │
│  (HTML/JS)      │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────────────────────────────┐
│         API Gateway (Express)           │
│  ┌─────────────────────────────────┐   │
│  │  Middleware Layer               │   │
│  │  - CORS                         │   │
│  │  - Helmet (Security)            │   │
│  │  - Rate Limiting                │   │
│  │  - Authentication (JWT)         │   │
│  │  - Authorization (Roles)        │   │
│  │  - Validation                   │   │
│  └─────────────────────────────────┘   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Routes Layer                    │
│  /api/auth     /api/patients            │
│  /api/appointments  /api/documents      │
│  /api/access   /api/profile             │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│       Controllers Layer                 │
│  (Business Logic)                       │
│  - AuthController                       │
│  - PatientController                    │
│  - AppointmentController                │
│  - DocumentController                   │
│  - AccessController                     │
│  - ProfileController                    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│       Services Layer                    │
│  - RabbitMQ Service                     │
│  - Biometric Service                    │
│  - Notification Service (futuro)        │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│       Data Layer                        │
│  - Mock Data (desarrollo)               │
│  - Database (producción - futuro)       │
└─────────────────────────────────────────┘

         │
         ▼
┌─────────────────────────────────────────┐
│       Message Queue (RabbitMQ)          │
│  - appointments_queue                   │
│  - documents_queue                      │
│  - notifications_queue                  │
└─────────────────────────────────────────┘
```

---

## 🔐 Flujo de Autenticación

### 1. Login Tradicional

```
┌────────┐      ┌────────────┐      ┌──────────┐
│ Client │      │   Server   │      │   Data   │
└───┬────┘      └─────┬──────┘      └────┬─────┘
    │                 │                  │
    │  POST /login    │                  │
    │  {email, pass}  │                  │
    ├────────────────>│                  │
    │                 │                  │
    │                 │ Find user        │
    │                 ├─────────────────>│
    │                 │                  │
    │                 │ User data        │
    │                 │<─────────────────┤
    │                 │                  │
    │                 │ Verify password  │
    │                 │ (bcrypt)         │
    │                 │                  │
    │                 │ Generate JWT     │
    │                 │                  │
    │  200 OK         │                  │
    │  {user, tokens} │                  │
    │<────────────────┤                  │
    │                 │                  │
```

### 2. Autenticación Biométrica

```
┌────────┐      ┌────────────┐      ┌──────────┐
│ Client │      │   Server   │      │ Biometric│
└───┬────┘      └─────┬──────┘      └────┬─────┘
    │                 │                  │
    │ POST /bio/init  │                  │
    ├────────────────>│                  │
    │                 │                  │
    │                 │ Create session   │
    │                 ├─────────────────>│
    │                 │                  │
    │ {sessionId,     │                  │
    │  challenge}     │                  │
    │<────────────────┤                  │
    │                 │                  │
    │ [User scans     │                  │
    │  fingerprint]   │                  │
    │                 │                  │
    │ POST /bio/verify│                  │
    │ {sessionId,data}│                  │
    ├────────────────>│                  │
    │                 │                  │
    │                 │ Verify biometric │
    │                 ├─────────────────>│
    │                 │                  │
    │                 │ Valid ✓          │
    │                 │<─────────────────┤
    │                 │                  │
    │                 │ Generate tokens  │
    │                 │                  │
    │ 200 OK          │                  │
    │ {user, tokens}  │                  │
    │<────────────────┤                  │
```

---

## 🔑 Sistema de Roles y Permisos

### Jerarquía de Roles

```
┌─────────────┐
│    ADMIN    │ ◄── Acceso total
└──────┬──────┘
       │
       ├────────┬─────────┬──────────┐
       ▼        ▼         ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
   │ DOCTOR │ │PATIENT │ │ TUTOR  │ │ STAFF  │
   └────────┘ └────────┘ └────────┘ └────────┘
```

### Matriz de Permisos

| Recurso/Acción       | Admin | Doctor | Patient | Tutor |
|---------------------|-------|--------|---------|-------|
| Ver pacientes       | ✅    | ✅     | ❌      | ❌    |
| Ver propio expediente| ✅    | ✅     | ✅      | ❌    |
| Ver expediente hijo | ✅    | ✅     | ❌      | ✅    |
| Crear consultas     | ✅    | ✅     | ❌      | ❌    |
| Subir documentos    | ✅    | ✅     | ❌      | ❌    |
| Crear citas         | ✅    | ✅     | ✅      | ✅    |
| Cancelar citas      | ✅    | ✅     | ✅      | ✅    |
| Gestionar accesos   | ✅    | ❌     | ✅      | ✅    |
| Configurar sistema  | ✅    | ❌     | ❌      | ❌    |

---

## 📨 Integración con RabbitMQ

### Arquitectura de Mensajería

```
┌──────────────────────────────────────────────┐
│              Medical Exchange                │
│              (Type: Topic)                   │
└────┬────────────────┬─────────────────┬──────┘
     │                │                 │
     │ appointment.*  │ document.*      │ notification.*
     ▼                ▼                 ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│Appointments│  │ Documents  │  │Notifications│
│   Queue    │  │   Queue    │  │   Queue    │
└────┬───────┘  └────┬───────┘  └────┬───────┘
     │               │                │
     ▼               ▼                ▼
┌──────────┐  ┌───────────┐   ┌─────────────┐
│Appointment│ │  Document  │   │Notification │
│ Consumer  │  │  Consumer │   │  Consumer   │
└───────────┘  └───────────┘   └─────────────┘
     │               │                │
     ▼               ▼                ▼
  [Update        [Generate        [Send Email/
   Calendar]      Thumbnail]       SMS/Push]
```

### Eventos Publicados

**1. Citas (appointment.*)**
- `appointment.created` - Nueva cita programada
- `appointment.updated` - Cita modificada
- `appointment.cancelled` - Cita cancelada

**2. Documentos (document.*)**
- `document.uploaded` - Documento subido
- `document.deleted` - Documento eliminado

**3. Notificaciones (notification.*)**
- `notification.appointment` - Notificación de cita
- `notification.document` - Nuevo documento disponible
- `notification.access` - Acceso otorgado/revocado

---

## 🗄️ Modelo de Datos

### Entidades Principales

```
┌──────────────┐
│    User      │
├──────────────┤
│ id (PK)      │
│ email        │
│ password     │
│ name         │
│ role         │
│ biometricId  │
└──────┬───────┘
       │
       │ 1:1 (patient/tutor)
       ▼
┌──────────────┐
│   Patient    │
├──────────────┤
│ id (PK)      │
│ userId (FK)  │
│ tutorId (FK) │
│ dateOfBirth  │
│ bloodType    │
│ allergies    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐        ┌──────────────┐
│Consultation  │        │  Document    │
├──────────────┤        ├──────────────┤
│ id (PK)      │        │ id (PK)      │
│ patientId    │◄──────►│ patientId    │
│ doctorId     │        │ uploadedBy   │
│ diagnosis    │        │ fileUrl      │
│ prescription │        │ type         │
└──────────────┘        └──────────────┘

┌──────────────┐
│ Appointment  │
├──────────────┤
│ id (PK)      │
│ patientId    │
│ doctorId     │
│ date         │
│ time         │
│ status       │
└──────────────┘

┌──────────────┐
│AccessPermission│
├──────────────┤
│ id (PK)      │
│ patientId    │
│ grantedTo    │
│ permissions  │
│ expiresAt    │
└──────────────┘
```

---

## 🔄 Flujo de Creación de Cita

```
┌────────┐   ┌────────┐   ┌──────────┐   ┌──────────┐
│ Client │   │  API   │   │RabbitMQ  │   │Notification│
└───┬────┘   └───┬────┘   └────┬─────┘   └────┬─────┘
    │            │              │              │
    │ POST /appointments        │              │
    ├───────────>│              │              │
    │            │              │              │
    │            │ Validate     │              │
    │            │ - Patient exists            │
    │            │ - Doctor exists             │
    │            │ - Check availability        │
    │            │              │              │
    │            │ Create appointment          │
    │            │              │              │
    │            │ Publish event│              │
    │            ├─────────────>│              │
    │            │              │              │
    │ 201 Created│              │              │
    │<───────────┤              │              │
    │            │              │              │
    │            │              │ Consume event│
    │            │              ├─────────────>│
    │            │              │              │
    │            │              │ Send notification
    │            │              │              │
```

---

## 🔒 Flujo de Gestión de Accesos

### Otorgar Acceso (con Biométrico)

```
┌────────┐   ┌────────┐   ┌──────────┐   ┌──────────┐
│Patient │   │  API   │   │Biometric │   │  Data    │
└───┬────┘   └───┬────┘   └────┬─────┘   └────┬─────┘
    │            │              │              │
    │ POST /access/grant        │              │
    │ + Biometric Token         │              │
    ├───────────>│              │              │
    │            │              │              │
    │            │ Verify JWT   │              │
    │            │              │              │
    │            │ Verify Biometric Token      │
    │            ├─────────────>│              │
    │            │              │              │
    │            │ Valid ✓      │              │
    │            │<─────────────┤              │
    │            │              │              │
    │            │ Check permissions           │
    │            │ (patient/tutor/admin)       │
    │            │              │              │
    │            │ Create access permission    │
    │            ├────────────────────────────>│
    │            │              │              │
    │ 201 Created│              │              │
    │<───────────┤              │              │
```

---

## 📊 Endpoints por Módulo

### Auth Module
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/biometric/init
POST   /api/auth/biometric/verify
POST   /api/auth/biometric/enable
POST   /api/auth/refresh
POST   /api/auth/logout
```

### Patient Module
```
GET    /api/patients
GET    /api/patients/:id
GET    /api/patients/:id/history
POST   /api/patients/:id/consultations
PATCH  /api/patients/:id
```

### Appointment Module
```
GET    /api/appointments
GET    /api/appointments/:id
POST   /api/appointments
PATCH  /api/appointments/:id
POST   /api/appointments/:id/cancel
GET    /api/appointments/doctor/:id/availability
```

### Document Module
```
GET    /api/documents/categories
GET    /api/documents/patient/:id
GET    /api/documents/:id
POST   /api/documents/patient/:id
PATCH  /api/documents/:id
DELETE /api/documents/:id
```

### Access Module
```
GET    /api/access/patient/:id
POST   /api/access/patient/:id/grant
POST   /api/access/:id/revoke
PATCH  /api/access/:id
GET    /api/access/check/:patientId/:userId
```

### Profile Module
```
GET    /api/profile
PATCH  /api/profile
POST   /api/profile/change-password
POST   /api/profile/biometric
GET    /api/profile/notifications
PATCH  /api/profile/notifications
DELETE /api/profile
```

---

## 🛡️ Capas de Seguridad

```
┌─────────────────────────────────────┐
│  1. Rate Limiting                   │  ◄── 100 req/15min
├─────────────────────────────────────┤
│  2. CORS                            │  ◄── Origen permitido
├─────────────────────────────────────┤
│  3. Helmet (Security Headers)       │  ◄── XSS, CSP, etc.
├─────────────────────────────────────┤
│  4. Input Validation                │  ◄── Express Validator
├─────────────────────────────────────┤
│  5. JWT Authentication              │  ◄── Token verification
├─────────────────────────────────────┤
│  6. Role Authorization              │  ◄── Permisos por rol
├─────────────────────────────────────┤
│  7. Biometric Verification          │  ◄── Acciones sensibles
├─────────────────────────────────────┤
│  8. Password Hashing (Bcrypt)       │  ◄── 10 rounds
└─────────────────────────────────────┘
```

---

## 🚀 Escalabilidad

### Horizontal Scaling

```
┌─────────────┐
│Load Balancer│
└──────┬──────┘
       │
   ┌───┴───┬───────┬───────┐
   ▼       ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│API 1│ │API 2│ │API 3│ │API N│
└──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘
   │       │       │       │
   └───────┴───┬───┴───────┘
               ▼
        ┌────────────┐
        │  Database  │
        │  (Shared)  │
        └────────────┘
               ▼
        ┌────────────┐
        │  RabbitMQ  │
        │  Cluster   │
        └────────────┘
```

---

## 📈 Mejoras Futuras

### Fase 2 - Base de Datos Real
- [ ] PostgreSQL para datos relacionales
- [ ] MongoDB para documentos
- [ ] Redis para caché y sesiones

### Fase 3 - Monitoreo
- [ ] Logs estructurados (Winston)
- [ ] Métricas (Prometheus)
- [ ] Alertas (Grafana)
- [ ] APM (Application Performance Monitoring)

### Fase 4 - Microservicios
- [ ] Separar en servicios independientes
- [ ] API Gateway
- [ ] Service Discovery
- [ ] Circuit Breaker

### Fase 5 - Cloud Native
- [ ] Containerización (Docker)
- [ ] Orquestación (Kubernetes)
- [ ] CI/CD Pipeline
- [ ] Auto-scaling

---

## 📝 Convenciones de Código

### Nombres de Archivos
- Controllers: `nombre.controller.js`
- Routes: `nombre.routes.js`
- Middleware: `nombre.middleware.js`
- Services: `nombre.service.js`

### Respuestas API
```javascript
// Success
{
  success: true,
  data: { ... },
  message: "Operación exitosa"
}

// Error
{
  error: "Tipo de error",
  message: "Descripción detallada",
  details: { ... }
}
```

### Códigos HTTP
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Error

---

Esta arquitectura está diseñada para ser escalable, mantenible y segura, siguiendo las mejores prácticas de desarrollo backend con Node.js y Express.
