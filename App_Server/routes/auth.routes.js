const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../../Middleware/validation.middleware');
const { authenticateToken } = require('../../Middleware/auth.middleware');
const {
  login,
  register,
  initBiometric,
  verifyBiometricAuth,
  enableBiometric,
  refreshToken,
  logout
} = require('../controllers/auth.controller');

/**
 * @route   POST /api/auth/login
 * @desc    Login con email y password
 * @access  Public
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Password requerido'),
    validate
  ],
  login
);

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('Password debe tener mínimo 8 caracteres'),
    body('name').notEmpty().withMessage('Nombre requerido'),
    body('phone').optional().isMobilePhone('es-MX').withMessage('Teléfono inválido'),
    validate
  ],
  register
);

/**
 * @route   POST /api/auth/biometric/init
 * @desc    Iniciar sesión de autenticación biométrica
 * @access  Public
 */
router.post('/biometric/init',
  [
    body('email').isEmail().withMessage('Email inválido'),
    validate
  ],
  initBiometric
);

/**
 * @route   POST /api/auth/biometric/verify
 * @desc    Verificar autenticación biométrica
 * @access  Public
 */
router.post('/biometric/verify',
  [
    body('sessionId').notEmpty().withMessage('Session ID requerido'),
    body('biometricData').notEmpty().withMessage('Datos biométricos requeridos'),
    body('email').isEmail().withMessage('Email inválido'),
    validate
  ],
  verifyBiometricAuth
);

/**
 * @route   POST /api/auth/biometric/enable
 * @desc    Habilitar autenticación biométrica
 * @access  Private
 */
router.post('/biometric/enable',
  authenticateToken,
  [
    body('biometricData').notEmpty().withMessage('Datos biométricos requeridos'),
    validate
  ],
  enableBiometric
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refrescar access token
 * @access  Public
 */
router.post('/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token requerido'),
    validate
  ],
  refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout
 * @access  Private
 */
router.post('/logout',
  authenticateToken,
  logout
);

module.exports = router;
