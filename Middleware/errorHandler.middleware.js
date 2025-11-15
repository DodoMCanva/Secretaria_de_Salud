/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message,
      details: err.errors
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token de autenticación no es válido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'El token de autenticación ha expirado'
    });
  }

  // Error de archivo muy grande
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Archivo demasiado grande',
      message: 'El archivo excede el tamaño máximo permitido'
    });
  }

  // Error de tipo de archivo no permitido
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(415).json({
      error: 'Tipo de archivo no permitido',
      message: err.message
    });
  }

  // Error de recurso no encontrado
  if (err.status === 404) {
    return res.status(404).json({
      error: 'Recurso no encontrado',
      message: err.message
    });
  }

  // Error de duplicado (por ejemplo, email ya registrado)
  if (err.code === 'DUPLICATE_ENTRY') {
    return res.status(409).json({
      error: 'Recurso duplicado',
      message: err.message
    });
  }

  // Error genérico del servidor
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Error interno del servidor' 
    : err.message;

  res.status(statusCode).json({
    error: 'Error del servidor',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware para manejar rutas no encontradas
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Wrapper para funciones async en rutas
 * Captura errores y los pasa al error handler
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};
