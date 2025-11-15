const bcrypt = require('bcryptjs');
const { users } = require('../data/mockData');
const { registerBiometric, removeBiometric } = require('../services/biometric.service');

/**
 * Obtener perfil del usuario actual
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // No enviar el password
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener perfil'
    });
  }
};

/**
 * Actualizar perfil del usuario
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Campos permitidos para actualizar
    const allowedUpdates = ['name', 'phone', 'email'];
    
    // Verificar que solo se actualicen campos permitidos
    const requestedUpdates = Object.keys(updates);
    const isValidUpdate = requestedUpdates.every(update => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).json({ 
        error: 'Actualización inválida',
        message: 'Algunos campos no pueden ser actualizados'
      });
    }

    // Si se intenta cambiar el email, verificar que no exista
    if (updates.email && updates.email !== user.email) {
      const emailExists = users.find(u => u.email === updates.email && u.id !== userId);
      if (emailExists) {
        return res.status(409).json({ 
          error: 'Email ya existe',
          message: 'Ya existe un usuario con ese email'
        });
      }
    }

    // Actualizar campos
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    });

    user.updatedAt = new Date();

    const { password, ...userProfile } = user;

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: userProfile
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al actualizar perfil'
    });
  }
};

/**
 * Cambiar contraseña
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Datos incompletos',
        message: 'Debe proporcionar la contraseña actual y la nueva'
      });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Contraseña incorrecta',
        message: 'La contraseña actual no es correcta'
      });
    }

    // Validar nueva contraseña
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al cambiar contraseña'
    });
  }
};

/**
 * Configurar autenticación biométrica
 */
const configureBiometric = async (req, res) => {
  try {
    const userId = req.user.id;
    const { enabled, biometricData } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    if (enabled) {
      // Habilitar biométrico
      if (!biometricData) {
        return res.status(400).json({ 
          error: 'Datos biométricos requeridos',
          message: 'Debe proporcionar datos biométricos para habilitar'
        });
      }

      const result = await registerBiometric(userId, biometricData);
      
      if (!result.success) {
        return res.status(500).json({
          error: result.error,
          details: result.details
        });
      }

      user.biometricEnabled = true;
      user.biometricId = result.biometricId;

      res.json({
        success: true,
        message: 'Autenticación biométrica habilitada',
        biometricId: result.biometricId
      });

    } else {
      // Deshabilitar biométrico
      if (user.biometricId) {
        await removeBiometric(user.biometricId);
      }

      user.biometricEnabled = false;
      user.biometricId = null;

      res.json({
        success: true,
        message: 'Autenticación biométrica deshabilitada'
      });
    }

  } catch (error) {
    console.error('Error al configurar biométrico:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al configurar autenticación biométrica'
    });
  }
};

/**
 * Obtener configuración de notificaciones
 */
const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Configuración por defecto
    const settings = user.notificationSettings || {
      email: true,
      sms: false,
      push: true,
      appointments: true,
      documents: true,
      results: true
    };

    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener configuración de notificaciones'
    });
  }
};

/**
 * Actualizar configuración de notificaciones
 */
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    user.notificationSettings = {
      ...user.notificationSettings,
      ...settings
    };

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: user.notificationSettings
    });

  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al actualizar configuración'
    });
  }
};

/**
 * Eliminar cuenta
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({ 
        error: 'Confirmación requerida',
        message: 'Debe escribir DELETE para confirmar'
      });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Contraseña incorrecta'
      });
    }

    // Marcar como inactivo en lugar de eliminar
    user.active = false;
    user.deletedAt = new Date();

    res.json({
      success: true,
      message: 'Cuenta desactivada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al eliminar cuenta'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  configureBiometric,
  getNotificationSettings,
  updateNotificationSettings,
  deleteAccount
};
