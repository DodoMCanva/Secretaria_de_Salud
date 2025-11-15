const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../../Middleware/validation.middleware');
const { authenticateToken } = require('../../Middleware/auth.middleware');
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getDoctorAvailability
} = require('../controllers/appointment.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/appointments
 * @desc    Obtener citas (filtradas por usuario)
 * @access  Private
 */
router.get('/',
  getAppointments
);

/**
 * @route   GET /api/appointments/:appointmentId
 * @desc    Obtener una cita específica
 * @access  Private
 */
router.get('/:appointmentId',
  param('appointmentId').notEmpty().withMessage('Appointment ID requerido'),
  validate,
  getAppointmentById
);

/**
 * @route   POST /api/appointments
 * @desc    Crear nueva cita
 * @access  Private
 */
router.post('/',
  [
    body('patientId').notEmpty().withMessage('Patient ID requerido'),
    body('doctorId').notEmpty().withMessage('Doctor ID requerido'),
    body('date').isDate().withMessage('Fecha inválida'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora inválida'),
    body('reason').notEmpty().withMessage('Motivo requerido'),
    validate
  ],
  createAppointment
);

/**
 * @route   PATCH /api/appointments/:appointmentId
 * @desc    Actualizar cita
 * @access  Private
 */
router.patch('/:appointmentId',
  param('appointmentId').notEmpty().withMessage('Appointment ID requerido'),
  validate,
  updateAppointment
);

/**
 * @route   POST /api/appointments/:appointmentId/cancel
 * @desc    Cancelar cita
 * @access  Private
 */
router.post('/:appointmentId/cancel',
  [
    param('appointmentId').notEmpty().withMessage('Appointment ID requerido'),
    body('reason').optional().isString(),
    validate
  ],
  cancelAppointment
);

/**
 * @route   GET /api/appointments/doctor/:doctorId/availability
 * @desc    Obtener disponibilidad de un doctor
 * @access  Private
 */
router.get('/doctor/:doctorId/availability',
  [
    param('doctorId').notEmpty().withMessage('Doctor ID requerido'),
    validate
  ],
  getDoctorAvailability
);

module.exports = router;
