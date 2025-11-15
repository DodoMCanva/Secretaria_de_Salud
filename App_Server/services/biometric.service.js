const { v4: uuidv4 } = require('uuid');
const { generateToken } = require('../config/jwt.config');

// Almacén temporal de sesiones biométricas (en producción usar Redis)
const biometricSessions = new Map();

const BIOMETRIC_TIMEOUT = parseInt(process.env.BIOMETRIC_TIMEOUT) || 30000; // 30 segundos
const MAX_ATTEMPTS = parseInt(process.env.BIOMETRIC_MAX_ATTEMPTS) || 3;

/**
 * Inicia una sesión de autenticación biométrica
 * @param {String} userId - ID del usuario
 * @returns {Object} Datos de la sesión biométrica
 */
const initiateBiometricAuth = (userId) => {
  const sessionId = uuidv4();
  const challenge = generateChallenge();
  
  const session = {
    sessionId,
    userId,
    challenge,
    attempts: 0,
    createdAt: Date.now(),
    expiresAt: Date.now() + BIOMETRIC_TIMEOUT
  };

  biometricSessions.set(sessionId, session);

  // Auto-eliminar sesión después del timeout
  setTimeout(() => {
    biometricSessions.delete(sessionId);
  }, BIOMETRIC_TIMEOUT);

  return {
    sessionId,
    challenge,
    expiresIn: BIOMETRIC_TIMEOUT
  };
};

/**
 * Verifica la autenticación biométrica
 * @param {String} sessionId - ID de la sesión
 * @param {String} biometricData - Datos biométricos del usuario
 * @param {Object} user - Datos del usuario
 * @returns {Object} Resultado de la verificación
 */
const verifyBiometric = async (sessionId, biometricData, user) => {
  const session = biometricSessions.get(sessionId);

  if (!session) {
    return {
      success: false,
      error: 'Sesión biométrica no encontrada o expirada'
    };
  }

  // Verificar que no haya expirado
  if (Date.now() > session.expiresAt) {
    biometricSessions.delete(sessionId);
    return {
      success: false,
      error: 'Sesión biométrica expirada'
    };
  }

  // Verificar intentos
  session.attempts++;
  if (session.attempts > MAX_ATTEMPTS) {
    biometricSessions.delete(sessionId);
    return {
      success: false,
      error: 'Máximo número de intentos excedido'
    };
  }

  // Verificar usuario
  if (session.userId !== user.id) {
    return {
      success: false,
      error: 'Usuario no coincide con la sesión'
    };
  }

  // Simular verificación biométrica
  // En producción aquí se verificaría contra el sistema biométrico real
  const isValid = await simulateBiometricVerification(biometricData, user.biometricId);

  if (!isValid) {
    return {
      success: false,
      error: 'Verificación biométrica fallida',
      attemptsRemaining: MAX_ATTEMPTS - session.attempts
    };
  }

  // Generar token biométrico temporal
  const biometricToken = generateBiometricToken(user.id, sessionId);
  
  // Limpiar sesión
  biometricSessions.delete(sessionId);

  return {
    success: true,
    biometricToken,
    expiresIn: 300000 // 5 minutos
  };
};

/**
 * Verifica un token biométrico
 * @param {String} token - Token biométrico
 * @returns {Boolean}
 */
const verifyBiometricToken = (token) => {
  try {
    // Aquí verificarías el token contra tu sistema
    // Por ahora simulamos la verificación
    return token && token.startsWith('BIO_');
  } catch (error) {
    return false;
  }
};

/**
 * Registra datos biométricos para un usuario
 * @param {String} userId - ID del usuario
 * @param {String} biometricData - Datos biométricos a registrar
 * @returns {Object} Resultado del registro
 */
const registerBiometric = async (userId, biometricData) => {
  try {
    // En producción aquí registrarías los datos en el sistema biométrico
    const biometricId = `bio_${userId}_${uuidv4().slice(0, 8)}`;
    
    // Simular almacenamiento
    await simulateBiometricStorage(biometricId, biometricData);

    return {
      success: true,
      biometricId,
      message: 'Datos biométricos registrados exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al registrar datos biométricos',
      details: error.message
    };
  }
};

/**
 * Elimina datos biométricos de un usuario
 * @param {String} biometricId - ID biométrico a eliminar
 * @returns {Object} Resultado de la eliminación
 */
const removeBiometric = async (biometricId) => {
  try {
    // En producción eliminarías del sistema biométrico
    await simulateBiometricDeletion(biometricId);

    return {
      success: true,
      message: 'Datos biométricos eliminados exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al eliminar datos biométricos',
      details: error.message
    };
  }
};

// Funciones auxiliares (simulación)

/**
 * Genera un challenge único para la autenticación biométrica
 */
const generateChallenge = () => {
  return Buffer.from(uuidv4()).toString('base64');
};

/**
 * Genera un token biométrico temporal
 */
const generateBiometricToken = (userId, sessionId) => {
  return `BIO_${userId}_${sessionId}_${Date.now()}`;
};

/**
 * Simula la verificación biométrica
 */
const simulateBiometricVerification = async (biometricData, storedBiometricId) => {
  // Simular delay de verificación
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: comparar biometricData con datos almacenados
  // Por ahora retornar true si ambos existen
  return biometricData && storedBiometricId;
};

/**
 * Simula almacenamiento de datos biométricos
 */
const simulateBiometricStorage = async (biometricId, biometricData) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Datos biométricos almacenados: ${biometricId}`);
  return true;
};

/**
 * Simula eliminación de datos biométricos
 */
const simulateBiometricDeletion = async (biometricId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log(`Datos biométricos eliminados: ${biometricId}`);
  return true;
};

/**
 * Limpia sesiones expiradas (ejecutar periódicamente)
 */
const cleanExpiredSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of biometricSessions.entries()) {
    if (now > session.expiresAt) {
      biometricSessions.delete(sessionId);
    }
  }
};

// Limpiar sesiones expiradas cada minuto
setInterval(cleanExpiredSessions, 60000);

module.exports = {
  initiateBiometricAuth,
  verifyBiometric,
  verifyBiometricToken,
  registerBiometric,
  removeBiometric
};
