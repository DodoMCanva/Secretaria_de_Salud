const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, param } = require('express-validator');
const { validate } = require('../../Middleware/validation.middleware');
const { authenticateToken } = require('../../Middleware/auth.middleware');
const {
  getPatientDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentCategories
} = require('../controllers/document.controller');

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Tipos de archivo permitidos
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB por defecto
  }
});

// Todas las rutas requieren autenticación
router.use(authenticateToken);

/**
 * @route   GET /api/documents/categories
 * @desc    Obtener categorías de documentos
 * @access  Private
 */
router.get('/categories',
  getDocumentCategories
);

/**
 * @route   GET /api/documents/patient/:patientId
 * @desc    Obtener documentos de un paciente
 * @access  Private
 */
router.get('/patient/:patientId',
  param('patientId').notEmpty().withMessage('Patient ID requerido'),
  validate,
  getPatientDocuments
);

/**
 * @route   GET /api/documents/:documentId
 * @desc    Obtener un documento específico
 * @access  Private
 */
router.get('/:documentId',
  param('documentId').notEmpty().withMessage('Document ID requerido'),
  validate,
  getDocumentById
);

/**
 * @route   POST /api/documents/patient/:patientId
 * @desc    Subir nuevo documento
 * @access  Private (Doctor, Admin)
 */
router.post('/patient/:patientId',
  upload.single('file'),
  [
    param('patientId').notEmpty().withMessage('Patient ID requerido'),
    body('type').optional().isString(),
    body('name').optional().isString(),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('tags').optional().isString(),
    validate
  ],
  uploadDocument
);

/**
 * @route   PATCH /api/documents/:documentId
 * @desc    Actualizar metadatos de documento
 * @access  Private
 */
router.patch('/:documentId',
  param('documentId').notEmpty().withMessage('Document ID requerido'),
  validate,
  updateDocument
);

/**
 * @route   DELETE /api/documents/:documentId
 * @desc    Eliminar documento
 * @access  Private (Admin, quien lo subió)
 */
router.delete('/:documentId',
  param('documentId').notEmpty().withMessage('Document ID requerido'),
  validate,
  deleteDocument
);

module.exports = router;
