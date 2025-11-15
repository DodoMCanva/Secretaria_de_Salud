const { validationResult } = require('express-validator');

/**
 * Middleware para validar resultados de express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Datos de entrada inválidos',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

/**
 * Sanitiza datos de entrada eliminando campos no permitidos
 * @param {Array} allowedFields - Campos permitidos
 */
const sanitizeInput = (allowedFields) => {
  return (req, res, next) => {
    const sanitized = {};
    
    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        sanitized[field] = req.body[field];
      }
    });
    
    req.body = sanitized;
    next();
  };
};

/**
 * Valida que ciertos campos estén presentes
 * @param {Array} requiredFields - Campos requeridos
 */
const requireFields = (requiredFields) => {
  return (req, res, next) => {
    const missing = [];
    
    requiredFields.forEach(field => {
      if (!req.body.hasOwnProperty(field) || req.body[field] === null || req.body[field] === undefined || req.body[field] === '') {
        missing.push(field);
      }
    });
    
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: 'Campos requeridos faltantes',
        missingFields: missing
      });
    }
    
    next();
  };
};

/**
 * Valida formato de email
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de teléfono (formato mexicano)
 */
const validatePhone = (phone) => {
  const phoneRegex = /^\+?52?\s?[0-9]{2}\s?[0-9]{4}\s?[0-9]{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Valida formato de fecha (YYYY-MM-DD)
 */
const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

module.exports = {
  validate,
  sanitizeInput,
  requireFields,
  validateEmail,
  validatePhone,
  validateDate
};
