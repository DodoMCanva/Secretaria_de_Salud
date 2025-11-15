const { ROLES, hasPermission, hasAnyPermission } = require('../App_Server/config/roles.config');

/**
 * Middleware para verificar roles de usuario
 * @param {Array|String} allowedRoles - Rol o roles permitidos
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'No tiene permisos suficientes para realizar esta acción',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware para verificar permisos específicos
 * @param {String} permission - Permiso requerido
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: `Requiere permiso: ${permission}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware para verificar múltiples permisos (requiere al menos uno)
 * @param {Array} permissions - Array de permisos
 */
const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: `Requiere al menos uno de los permisos: ${permissions.join(', ')}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el usuario acceda solo a sus propios recursos
 * @param {String} paramName - Nombre del parámetro que contiene el ID del recurso
 */
const requireOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    // Admin puede acceder a todo
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    const resourceId = req.params[paramName];
    
    if (req.user.id !== resourceId) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puede acceder a sus propios recursos'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar autenticación biométrica en acciones sensibles
 * Verifica que se haya proporcionado confirmación biométrica
 */
const requireBiometric = (req, res, next) => {
  const biometricToken = req.headers['x-biometric-token'];
  
  if (!biometricToken) {
    return res.status(403).json({ 
      error: 'Autenticación biométrica requerida',
      message: 'Esta acción requiere confirmación biométrica',
      biometricRequired: true
    });
  }

  // Aquí se verificaría el token biométrico
  // Por ahora, simplemente verificamos que exista
  req.biometricVerified = true;
  next();
};

module.exports = {
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireOwnership,
  requireBiometric,
  ROLES
};
