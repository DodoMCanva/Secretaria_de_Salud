# Guía de Configuración del Backend

Esta guía te ayudará a configurar y ejecutar el backend de la aplicación médica.

## 📋 Prerequisitos

1. **Node.js** v16 o superior
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

2. **npm** (incluido con Node.js)
   - Verificar: `npm --version`

3. **RabbitMQ** (opcional para desarrollo)
   - Instrucciones más abajo

---

## 🚀 Instalación Rápida

### Paso 1: Instalar dependencias

```bash
cd App_Server
npm install
```

### Paso 2: Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus configuraciones
# Puedes usar cualquier editor de texto
```

Contenido mínimo del `.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=mi-clave-secreta-super-segura-cambiar-en-produccion
CORS_ORIGIN=http://localhost:5173
```

### Paso 3: Crear directorio de uploads

```bash
mkdir -p uploads/documents
```

### Paso 4: Iniciar el servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# O producción
npm start
```

✅ El servidor estará corriendo en `http://localhost:3000`

---

## 🐰 Instalación de RabbitMQ (Opcional)

RabbitMQ no es obligatorio para desarrollo inicial. El servidor funcionará sin él, pero no procesará mensajes asíncronos.

### Opción 1: Docker (Recomendado)

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:management
```

Interfaz web: http://localhost:15672
- Usuario: guest
- Password: guest

### Opción 2: Instalación local

**macOS (con Homebrew):**
```bash
brew install rabbitmq
brew services start rabbitmq
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

**Windows:**
1. Descargar desde: https://www.rabbitmq.com/download.html
2. Ejecutar el instalador
3. Iniciar servicio desde Services

### Configurar URL de RabbitMQ

Agregar en `.env`:
```env
RABBITMQ_URL=amqp://localhost:5672
```

---

## 🧪 Probar la API

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-11-15T...",
  "service": "Medical App Backend"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "paciente@email.com",
    "password": "password123"
  }'
```

### 3. Obtener perfil (con token)

```bash
# Reemplazar YOUR_TOKEN con el token obtenido del login
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👥 Usuarios de Prueba

El sistema viene con usuarios de prueba pre-cargados:

### Administrador
- **Email:** admin@medical.com
- **Password:** password123
- **Rol:** admin

### Doctores
- **Email:** dra.garcia@medical.com (Cardiología)
- **Password:** password123
- **Rol:** doctor

- **Email:** dr.martinez@medical.com (Pediatría)
- **Password:** password123
- **Rol:** doctor

### Paciente
- **Email:** paciente@email.com
- **Password:** password123
- **Rol:** patient

### Tutor
- **Email:** tutor@email.com
- **Password:** password123
- **Rol:** tutor

---

## 📁 Estructura de Archivos

```
medical-app/
├── App_Server/              # Backend
│   ├── config/             # Configuraciones
│   ├── controllers/        # Lógica de negocio
│   ├── routes/            # Rutas API
│   ├── services/          # Servicios externos
│   ├── data/              # Datos mock
│   ├── uploads/           # Archivos subidos
│   ├── server.js          # Servidor principal
│   ├── package.json       # Dependencias
│   └── .env               # Variables de entorno
│
├── Middleware/            # Middlewares compartidos
│   ├── auth.middleware.js
│   ├── authorization.middleware.js
│   └── validation.middleware.js
│
└── App_Web/               # Frontend (HTML/JS vanilla)
```

---

## 🔧 Scripts Disponibles

En el directorio `App_Server/`:

```bash
# Iniciar en modo desarrollo (auto-reload con nodemon)
npm run dev

# Iniciar en modo producción
npm start

# Ejecutar tests (cuando se implementen)
npm test
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module..."
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001
```

O matar el proceso que usa el puerto:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Error: "ENOENT: no such file or directory, scandir 'uploads'"
```bash
# Crear directorio
mkdir -p uploads/documents
```

### RabbitMQ no conecta
El servidor funcionará sin RabbitMQ. Verás una advertencia pero no es crítico:
```
⚠ Continuando sin RabbitMQ (modo desarrollo)
```

---

## 📊 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/biometric/init` - Iniciar biométrico
- `POST /api/auth/biometric/verify` - Verificar biométrico

### Pacientes
- `GET /api/patients` - Lista de pacientes
- `GET /api/patients/:id` - Expediente completo
- `POST /api/patients/:id/consultations` - Nueva consulta

### Citas
- `GET /api/appointments` - Mis citas
- `POST /api/appointments` - Crear cita
- `POST /api/appointments/:id/cancel` - Cancelar cita

### Documentos
- `GET /api/documents/patient/:id` - Documentos del paciente
- `POST /api/documents/patient/:id` - Subir documento
- `DELETE /api/documents/:id` - Eliminar documento

### Accesos
- `GET /api/access/patient/:id` - Ver permisos
- `POST /api/access/patient/:id/grant` - Otorgar acceso
- `POST /api/access/:id/revoke` - Revocar acceso

### Perfil
- `GET /api/profile` - Mi perfil
- `PATCH /api/profile` - Actualizar perfil
- `POST /api/profile/change-password` - Cambiar contraseña

Ver documentación completa en `/App_Server/README.md`

---

## 🔐 Seguridad

### Características implementadas:
- ✅ JWT con expiración
- ✅ Bcrypt para passwords
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ CORS configurado
- ✅ Helmet para headers seguros
- ✅ Control de roles y permisos
- ✅ Autenticación biométrica

### Para producción:
1. Cambiar `JWT_SECRET` a algo muy seguro
2. Configurar `NODE_ENV=production`
3. Usar HTTPS
4. Configurar base de datos real
5. Configurar backup automático

---

## 📞 Siguiente Paso: Conectar Frontend

Una vez que el backend esté corriendo:

1. El frontend debe hacer requests a: `http://localhost:3000/api`
2. Incluir token JWT en header: `Authorization: Bearer {token}`
3. Ver ejemplos de integración en la documentación

---

## 💡 Tips

- El servidor usa datos mock en memoria (se resetean al reiniciar)
- Los archivos subidos se guardan en `uploads/documents/`
- Los logs se muestran en la consola
- RabbitMQ es opcional para desarrollo
- Todos los passwords de prueba son: `password123`

---

¿Listo para empezar? 🚀

```bash
cd App_Server
npm install
npm run dev
```

¡El backend estará corriendo en http://localhost:3000!
