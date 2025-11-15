const bcrypt = require('bcryptjs');
const { generateTokenPair } = require('../config/jwt.config');
const { users } = require('../data/mockData');
const { 
  initiateBiometricAuth, 
  verifyBiometric,
  registerBiometric 
} = require('../services/biometric.service');

/**
 * Login con email y password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar que esté activo
    if (!user.active) {
      return res.status(403).json({ 
        error: 'Cuenta inactiva',
        message: 'Su cuenta ha sido desactivada. Contacte al administrador.'
      });
    }

    // Generar tokens
    const tokens = generateTokenPair(user);

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        biometricEnabled: user.biometricEnabled
      },
      tokens
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al procesar la solicitud de login'
    });
  }
};

/**
 * Iniciar autenticación biométrica
 */
const initBiometric = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        message: 'No existe un usuario con ese email'
      });
    }

    // Verificar que tenga biométrico habilitado
    if (!user.biometricEnabled) {
      return res.status(400).json({ 
        error: 'Biométrico no habilitado',
        message: 'Este usuario no tiene autenticación biométrica habilitada'
      });
    }

    // Iniciar sesión biométrica
    const biometricSession = initiateBiometricAuth(user.id);

    res.json({
      success: true,
      message: 'Sesión biométrica iniciada',
      ...biometricSession,
      biometricId: user.biometricId
    });

  } catch (error) {
    console.error('Error al iniciar biométrico:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al iniciar autenticación biométrica'
    });
  }
};

/**
 * Verificar autenticación biométrica
 */
const verifyBiometricAuth = async (req, res) => {
  try {
    const { sessionId, biometricData, email } = req.body;

    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Verificar biométrico
    const result = await verifyBiometric(sessionId, biometricData, user);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
        attemptsRemaining: result.attemptsRemaining
      });
    }

    // Generar tokens de autenticación
    const tokens = generateTokenPair(user);

    res.json({
      success: true,
      message: 'Autenticación biométrica exitosa',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      tokens,
      biometricToken: result.biometricToken
    });

  } catch (error) {
    console.error('Error al verificar biométrico:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al verificar autenticación biométrica'
    });
  }
};

/**
 * Registro de nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Usuario ya existe',
        message: 'Ya existe un usuario con ese email'
      });
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: require('uuid').v4(),
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'patient', // Por defecto patient
      biometricEnabled: false,
      createdAt: new Date(),
      active: true
    };

    users.push(newUser);

    // Generar tokens
    const tokens = generateTokenPair(newUser);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      tokens
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al registrar usuario'
    });
  }
};

/**
 * Habilitar autenticación biométrica
 */
const enableBiometric = async (req, res) => {
  try {
    const { biometricData } = req.body;
    const userId = req.user.id;

    // Buscar usuario
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Registrar datos biométricos
    const result = await registerBiometric(userId, biometricData);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        details: result.details
      });
    }

    // Actualizar usuario
    user.biometricEnabled = true;
    user.biometricId = result.biometricId;

    res.json({
      success: true,
      message: 'Autenticación biométrica habilitada',
      biometricId: result.biometricId
    });

  } catch (error) {
    console.error('Error al habilitar biométrico:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al habilitar autenticación biométrica'
    });
  }
};

/**
 * Refresh token
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        error: 'Token requerido',
        message: 'Debe proporcionar un refresh token'
      });
    }

    // Verificar refresh token
    const { verifyToken } = require('../config/jwt.config');
    const decoded = verifyToken(refreshToken);

    // Buscar usuario
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Generar nuevos tokens
    const tokens = generateTokenPair(user);

    res.json({
      success: true,
      tokens
    });

  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(401).json({ 
      error: 'Token inválido',
      message: 'El refresh token no es válido'
    });
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  try {
    // En un sistema real, aquí invalidarías el token (lista negra, etc.)
    
    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al procesar logout'
    });
  }
};

module.exports = {
  login,
  register,
  initBiometric,
  verifyBiometricAuth,
  enableBiometric,
  refreshToken,
  logout
};
