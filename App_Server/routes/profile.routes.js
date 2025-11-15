const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../Middleware/validation.middleware');
const { authenticateToken } = require('../../Middleware/auth.middleware');
const {
  getProfile,
  updateProfile,
  changePassword,
  configureBiometric,
  getNotificationSettings,
  updateNotificationSettings,
  deleteAccount
} = require('../controllers/profile.controller');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/profile
 * @desc    Obtener perfil del usuario actual
 * @access  Private
 */
router.get('/',
  getProfile
);

/**
 * @route   PATCH /api/profile
 * @desc    Actualizar perfil del usuario
 * @access  Private
 */
router.patch('/',
  [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('phone').optional().isMobilePhone('es-MX').withMessage('Teléfono inválido'),
    body('name').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
    validate
  ],
  updateProfile
);

/**
 * @route   POST /api/profile/change-password
 * @desc    Cambiar contraseña
 * @access  Private
 */
router.post('/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Contraseña actual requerida'),
    body('newPassword').isLength({ min: 8 }).withMessage('Nueva contraseña debe tener mínimo 8 caracteres'),
    validate
  ],
  changePassword
);

/**
 * @route   POST /api/profile/biometric
 * @desc    Configurar autenticación biométrica
 * @access  Private
 */
router.post('/biometric',
  [
    body('enabled').isBoolean().withMessage('Enabled debe ser booleano'),
    body('biometricData').optional().notEmpty(),
    validate
  ],
  configureBiometric
);

/**
 * @route   GET /api/profile/notifications
 * @desc    Obtener configuración de notificaciones
 * @access  Private
 */
router.get('/notifications',
  getNotificationSettings
);

/**
 * @route   PATCH /api/profile/notifications
 * @desc    Actualizar configuración de notificaciones
 * @access  Private
 */
router.patch('/notifications',
  updateNotificationSettings
);

/**
 * @route   DELETE /api/profile
 * @desc    Eliminar cuenta
 * @access  Private
 */
router.delete('/',
  [
    body('password').notEmpty().withMessage('Contraseña requerida'),
    body('confirmation').equals('DELETE').withMessage('Debe escribir DELETE para confirmar'),
    validate
  ],
  deleteAccount
);

module.exports = router;
