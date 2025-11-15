const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../../Middleware/validation.middleware');
const { authenticateToken } = require('../../Middleware/auth.middleware');
const { requireBiometric } = require('../../Middleware/authorization.middleware');
const {
  getAccessPermissions,
  grantAccess,
  revokeAccess,
  updateAccessPermissions,
  checkAccess
} = require('../controllers/access.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/access/patient/:patientId
 * @desc    Obtener permisos de acceso de un paciente
 * @access  Private
 */
router.get('/patient/:patientId',
  param('patientId').notEmpty().withMessage('Patient ID requerido'),
  validate,
  getAccessPermissions
);

/**
 * @route   POST /api/access/patient/:patientId/grant
 * @desc    Otorgar permiso de acceso
 * @access  Private (requiere autenticación biométrica)
 */
router.post('/patient/:patientId/grant',
  requireBiometric,
  [
    param('patientId').notEmpty().withMessage('Patient ID requerido'),
    body('grantedTo').notEmpty().withMessage('Usuario destino requerido'),
    body('permissions').isArray().withMessage('Permisos debe ser un array'),
    body('expiresAt').optional().isISO8601().withMessage('Fecha de expiración inválida'),
    validate
  ],
  grantAccess
);

/**
 * @route   POST /api/access/:permissionId/revoke
 * @desc    Revocar permiso de acceso
 * @access  Private (requiere autenticación biométrica)
 */
router.post('/:permissionId/revoke',
  requireBiometric,
  param('permissionId').notEmpty().withMessage('Permission ID requerido'),
  validate,
  revokeAccess
);

/**
 * @route   PATCH /api/access/:permissionId
 * @desc    Actualizar permisos de acceso
 * @access  Private
 */
router.patch('/:permissionId',
  [
    param('permissionId').notEmpty().withMessage('Permission ID requerido'),
    body('permissions').optional().isArray(),
    body('expiresAt').optional().isISO8601(),
    validate
  ],
  updateAccessPermissions
);

/**
 * @route   GET /api/access/check/:patientId/:userId
 * @desc    Verificar si un usuario tiene acceso a un paciente
 * @access  Private
 */
router.get('/check/:patientId/:userId',
  [
    param('patientId').notEmpty().withMessage('Patient ID requerido'),
    param('userId').notEmpty().withMessage('User ID requerido'),
    validate
  ],
  checkAccess
);

module.exports = router;
