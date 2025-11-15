const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/**
 * Usuarios mock del sistema
 * Contraseñas: todos usan "password123" (hasheado)
 */
const users = [
  {
    id: uuidv4(),
    email: 'admin@medical.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    name: 'Administrador Sistema',
    phone: '+52 55 1234 5678',
    biometricEnabled: true,
    biometricId: 'bio_admin_001',
    createdAt: new Date('2024-01-01'),
    active: true
  },
  {
    id: uuidv4(),
    email: 'dra.garcia@medical.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'doctor',
    name: 'Dra. María García',
    specialty: 'Cardiología',
    license: 'MED-12345',
    phone: '+52 55 2345 6789',
    biometricEnabled: true,
    biometricId: 'bio_doctor_001',
    createdAt: new Date('2024-01-15'),
    active: true
  },
  {
    id: uuidv4(),
    email: 'dr.martinez@medical.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'doctor',
    name: 'Dr. Juan Martínez',
    specialty: 'Pediatría',
    license: 'MED-67890',
    phone: '+52 55 3456 7890',
    biometricEnabled: true,
    biometricId: 'bio_doctor_002',
    createdAt: new Date('2024-02-01'),
    active: true
  },
  {
    id: uuidv4(),
    email: 'paciente@email.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'patient',
    name: 'Carlos López',
    phone: '+52 55 4567 8901',
    biometricEnabled: true,
    biometricId: 'bio_patient_001',
    patientId: 'PAT-001',
    createdAt: new Date('2024-03-01'),
    active: true
  },
  {
    id: uuidv4(),
    email: 'tutor@email.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'tutor',
    name: 'Ana Rodríguez',
    phone: '+52 55 5678 9012',
    biometricEnabled: true,
    biometricId: 'bio_tutor_001',
    dependents: ['PAT-002'],
    createdAt: new Date('2024-03-15'),
    active: true
  }
];

/**
 * Pacientes mock
 */
const patients = [
  {
    id: 'PAT-001',
    userId: users.find(u => u.email === 'paciente@email.com')?.id,
    name: 'Carlos López',
    dateOfBirth: '1985-05-15',
    gender: 'Masculino',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Polen'],
    chronicConditions: ['Hipertensión'],
    emergencyContact: {
      name: 'María López',
      relationship: 'Esposa',
      phone: '+52 55 9876 5432'
    },
    insurance: {
      provider: 'Seguros Médicos SA',
      policyNumber: 'POL-123456',
      validUntil: '2025-12-31'
    },
    createdAt: new Date('2024-03-01'),
    lastVisit: new Date('2024-11-10')
  },
  {
    id: 'PAT-002',
    tutorId: users.find(u => u.email === 'tutor@email.com')?.id,
    name: 'Pedro Rodríguez',
    dateOfBirth: '2015-08-20',
    gender: 'Masculino',
    bloodType: 'A+',
    allergies: ['Lactosa'],
    chronicConditions: [],
    emergencyContact: {
      name: 'Ana Rodríguez',
      relationship: 'Madre',
      phone: '+52 55 5678 9012'
    },
    insurance: {
      provider: 'Seguros Médicos SA',
      policyNumber: 'POL-789012',
      validUntil: '2025-12-31'
    },
    createdAt: new Date('2024-03-15'),
    lastVisit: new Date('2024-11-05')
  }
];

/**
 * Citas médicas mock
 */
const appointments = [
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    doctorId: users.find(u => u.specialty === 'Cardiología')?.id,
    doctorName: 'Dra. María García',
    specialty: 'Cardiología',
    date: '2024-11-20',
    time: '10:00',
    duration: 30,
    type: 'Consulta',
    status: 'programada',
    reason: 'Control de presión arterial',
    notes: 'Traer estudios recientes',
    location: 'Consultorio 301',
    createdAt: new Date('2024-11-01')
  },
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    doctorId: users.find(u => u.specialty === 'Cardiología')?.id,
    doctorName: 'Dra. María García',
    specialty: 'Cardiología',
    date: '2024-11-10',
    time: '15:30',
    duration: 30,
    type: 'Consulta',
    status: 'completada',
    reason: 'Revisión anual',
    notes: 'Paciente estable',
    diagnosis: 'Hipertensión controlada',
    prescription: 'Losartán 50mg 1-0-0',
    location: 'Consultorio 301',
    createdAt: new Date('2024-10-15'),
    completedAt: new Date('2024-11-10')
  },
  {
    id: uuidv4(),
    patientId: 'PAT-002',
    doctorId: users.find(u => u.specialty === 'Pediatría')?.id,
    doctorName: 'Dr. Juan Martínez',
    specialty: 'Pediatría',
    date: '2024-11-25',
    time: '11:00',
    duration: 30,
    type: 'Vacunación',
    status: 'programada',
    reason: 'Vacuna contra influenza',
    notes: '',
    location: 'Consultorio 205',
    createdAt: new Date('2024-11-05')
  }
];

/**
 * Documentos médicos mock
 */
const documents = [
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    type: 'laboratorio',
    name: 'Análisis de Sangre Completo',
    description: 'Resultados de biometría hemática',
    date: '2024-11-08',
    uploadedBy: users.find(u => u.specialty === 'Cardiología')?.id,
    uploadedByName: 'Dra. María García',
    fileType: 'application/pdf',
    fileSize: 245678,
    fileUrl: '/uploads/documents/lab-results-001.pdf',
    category: 'Laboratorio',
    tags: ['sangre', 'biometría', 'hemática'],
    createdAt: new Date('2024-11-08')
  },
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    type: 'imagen',
    name: 'Radiografía de Tórax',
    description: 'Estudio de rayos X del tórax',
    date: '2024-10-15',
    uploadedBy: users.find(u => u.specialty === 'Cardiología')?.id,
    uploadedByName: 'Dra. María García',
    fileType: 'image/jpeg',
    fileSize: 1024000,
    fileUrl: '/uploads/images/xray-chest-001.jpg',
    category: 'Imagenología',
    tags: ['rayos-x', 'tórax', 'cardiología'],
    createdAt: new Date('2024-10-15')
  },
  {
    id: uuidv4(),
    patientId: 'PAT-002',
    type: 'vacuna',
    name: 'Cartilla de Vacunación',
    description: 'Registro completo de vacunas',
    date: '2024-11-05',
    uploadedBy: users.find(u => u.specialty === 'Pediatría')?.id,
    uploadedByName: 'Dr. Juan Martínez',
    fileType: 'application/pdf',
    fileSize: 156789,
    fileUrl: '/uploads/documents/vaccination-record-002.pdf',
    category: 'Vacunación',
    tags: ['vacunas', 'pediatría'],
    createdAt: new Date('2024-11-05')
  }
];

/**
 * Permisos de acceso mock
 */
const accessPermissions = [
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    grantedTo: users.find(u => u.specialty === 'Cardiología')?.id,
    grantedToName: 'Dra. María García',
    grantedToRole: 'doctor',
    permissions: ['read', 'write', 'upload'],
    grantedBy: users.find(u => u.email === 'paciente@email.com')?.id,
    status: 'active',
    expiresAt: new Date('2025-12-31'),
    createdAt: new Date('2024-03-01')
  },
  {
    id: uuidv4(),
    patientId: 'PAT-002',
    grantedTo: users.find(u => u.specialty === 'Pediatría')?.id,
    grantedToName: 'Dr. Juan Martínez',
    grantedToRole: 'doctor',
    permissions: ['read', 'write', 'upload'],
    grantedBy: users.find(u => u.email === 'tutor@email.com')?.id,
    status: 'active',
    expiresAt: new Date('2025-12-31'),
    createdAt: new Date('2024-03-15')
  }
];

/**
 * Consultas médicas (historial clínico)
 */
const consultations = [
  {
    id: uuidv4(),
    patientId: 'PAT-001',
    appointmentId: appointments[1].id,
    doctorId: users.find(u => u.specialty === 'Cardiología')?.id,
    doctorName: 'Dra. María García',
    date: '2024-11-10',
    chiefComplaint: 'Control de presión arterial',
    symptoms: ['Ninguno reportado'],
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.5,
      weight: 75,
      height: 175
    },
    physicalExam: 'Exploración física sin alteraciones',
    diagnosis: 'Hipertensión arterial controlada',
    treatment: 'Continuar con Losartán 50mg 1-0-0',
    prescription: [
      {
        medication: 'Losartán',
        dose: '50mg',
        frequency: '1 vez al día',
        duration: '30 días'
      }
    ],
    followUp: '3 meses',
    notes: 'Paciente con buena adherencia al tratamiento',
    createdAt: new Date('2024-11-10')
  }
];

module.exports = {
  users,
  patients,
  appointments,
  documents,
  accessPermissions,
  consultations
};
