const { verifyToken } = require('../App_Server/config/jwt.config');

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y añade los datos del usuario al request
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Acceso denegado',
        message: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar token
    const decoded = verifyToken(token);
    
    // Añadir datos del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };

    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Token inválido',
      message: error.message
    });
  }
};

/**
 * Middleware opcional de autenticación
 * Añade datos del usuario si el token existe, pero no rechaza la request si no hay token
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
    }

    next();
  } catch (error) {
    // Si el token es inválido, continuar sin usuario autenticado
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
