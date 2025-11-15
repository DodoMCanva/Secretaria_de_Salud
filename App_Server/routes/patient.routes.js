const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../../Middleware/validation.middleware');
const { authenticateToken } = require('../../Middleware/auth.middleware');
const { requireRole, requirePermission } = require('../../Middleware/authorization.middleware');
const {
  getAllPatients,
  getPatientRecord,
  getClinicalHistory,
  createConsultation,
  updatePatient
} = require('../controllers/patient.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/patients
 * @desc    Obtener lista de pacientes
 * @access  Private (Admin, Doctor)
 */
router.get('/',
  requirePermission('patients:read'),
  getAllPatients
);

/**
 * @route   GET /api/patients/:patientId
 * @desc    Obtener expediente completo de un paciente
 * @access  Private
 */
router.get('/:patientId',
  param('patientId').notEmpty().withMessage('Patient ID requerido'),
  validate,
  getPatientRecord
);

/**
 * @route   GET /api/patients/:patientId/history
 * @desc    Obtener historial clínico (consultas)
 * @access  Private
 */
router.get('/:patientId/history',
  param('patientId').notEmpty().withMessage('Patient ID requerido'),
  validate,
  getClinicalHistory
);

/**
 * @route   POST /api/patients/:patientId/consultations
 * @desc    Crear nueva consulta médica
 * @access  Private (Doctor, Admin)
 */
router.post('/:patientId/consultations',
  requirePermission('consultations:create'),
  [
    param('patientId').notEmpty().withMessage('Patient ID requerido'),
    body('chiefComplaint').notEmpty().withMessage('Motivo de consulta requerido'),
    body('diagnosis').notEmpty().withMessage('Diagnóstico requerido'),
    validate
  ],
  createConsultation
);

/**
 * @route   PATCH /api/patients/:patientId
 * @desc    Actualizar información del paciente
 * @access  Private
 */
router.patch('/:patientId',
  param('patientId').notEmpty().withMessage('Patient ID requerido'),
  validate,
  updatePatient
);

module.exports = router;
