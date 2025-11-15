const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Genera un token JWT para un usuario
 * @param {Object} payload - Datos del usuario (id, email, role)
 * @param {String} expiresIn - Tiempo de expiración (opcional)
 * @returns {String} Token JWT
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Genera tokens de acceso y refresh
 * @param {Object} user - Datos del usuario
 * @returns {Object} Objeto con accessToken y refreshToken
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return {
    accessToken: generateToken(payload, JWT_EXPIRES_IN),
    refreshToken: generateToken({ id: user.id }, JWT_REFRESH_EXPIRES_IN)
  };
};

/**
 * Verifica un token JWT
 * @param {String} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Decodifica un token sin verificar (para inspección)
 * @param {String} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateTokenPair,
  verifyToken,
  decodeToken,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
};
