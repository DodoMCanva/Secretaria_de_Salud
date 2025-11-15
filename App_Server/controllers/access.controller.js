const { accessPermissions, patients, users } = require('../data/mockData');
const { ROLES } = require('../config/roles.config');
const { publishMessage } = require('../services/rabbitmq.service');

/**
 * Obtener permisos de acceso de un paciente
 */
const getAccessPermissions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Solo el paciente, tutor o admin pueden ver permisos
    if (user.role !== ROLES.ADMIN && 
        patient.userId !== user.id &&
        patient.tutorId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    const permissions = accessPermissions.filter(p => p.patientId === patientId);

    res.json({
      success: true,
      data: permissions,
      total: permissions.length
    });

  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener permisos de acceso'
    });
  }
};

/**
 * Otorgar permiso de acceso
 */
const grantAccess = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { grantedTo, permissions, expiresAt } = req.body;
    const user = req.user;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Solo el paciente, tutor o admin pueden otorgar acceso
    if (user.role !== ROLES.ADMIN && 
        patient.userId !== user.id &&
        patient.tutorId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo el paciente o tutor pueden otorgar acceso'
      });
    }

    // Verificar que el usuario a quien se otorga exista
    const grantedToUser = users.find(u => u.id === grantedTo);
    if (!grantedToUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Verificar si ya existe un permiso activo para este usuario
    const existingPermission = accessPermissions.find(p => 
      p.patientId === patientId && 
      p.grantedTo === grantedTo &&
      p.status === 'active'
    );

    if (existingPermission) {
      return res.status(409).json({ 
        error: 'Permiso ya existe',
        message: 'Ya existe un permiso activo para este usuario',
        data: existingPermission
      });
    }

    const newPermission = {
      id: require('uuid').v4(),
      patientId,
      grantedTo,
      grantedToName: grantedToUser.name,
      grantedToRole: grantedToUser.role,
      permissions: permissions || ['read'],
      grantedBy: user.id,
      status: 'active',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date()
    };

    accessPermissions.push(newPermission);

    // Publicar notificación
    await publishMessage('notification.access', {
      type: 'access_granted',
      patientId,
      grantedTo,
      grantedBy: user.id,
      message: `Se le ha otorgado acceso al expediente de ${patient.name}`
    });

    res.status(201).json({
      success: true,
      message: 'Acceso otorgado exitosamente',
      data: newPermission
    });

  } catch (error) {
    console.error('Error al otorgar acceso:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al otorgar acceso'
    });
  }
};

/**
 * Revocar permiso de acceso
 */
const revokeAccess = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const user = req.user;

    const permission = accessPermissions.find(p => p.id === permissionId);
    if (!permission) {
      return res.status(404).json({ 
        error: 'Permiso no encontrado'
      });
    }

    const patient = patients.find(p => p.id === permission.patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Solo quien lo otorgó, el paciente, tutor o admin pueden revocar
    if (user.role !== ROLES.ADMIN && 
        permission.grantedBy !== user.id &&
        patient.userId !== user.id &&
        patient.tutorId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    permission.status = 'revoked';
    permission.revokedAt = new Date();
    permission.revokedBy = user.id;

    res.json({
      success: true,
      message: 'Acceso revocado exitosamente',
      data: permission
    });

  } catch (error) {
    console.error('Error al revocar acceso:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al revocar acceso'
    });
  }
};

/**
 * Actualizar permisos de acceso
 */
const updateAccessPermissions = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { permissions, expiresAt } = req.body;
    const user = req.user;

    const permission = accessPermissions.find(p => p.id === permissionId);
    if (!permission) {
      return res.status(404).json({ 
        error: 'Permiso no encontrado'
      });
    }

    const patient = patients.find(p => p.id === permission.patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Solo quien lo otorgó, el paciente, tutor o admin pueden actualizar
    if (user.role !== ROLES.ADMIN && 
        permission.grantedBy !== user.id &&
        patient.userId !== user.id &&
        patient.tutorId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    if (permissions) {
      permission.permissions = permissions;
    }

    if (expiresAt) {
      permission.expiresAt = new Date(expiresAt);
    }

    permission.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Permisos actualizados exitosamente',
      data: permission
    });

  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al actualizar permisos'
    });
  }
};

/**
 * Verificar si un usuario tiene acceso a un paciente
 */
const checkAccess = async (req, res) => {
  try {
    const { patientId, userId } = req.params;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado'
      });
    }

    // Verificar acceso directo
    let hasAccess = false;
    let accessType = 'none';
    let permissions = [];

    // Admin siempre tiene acceso
    if (targetUser.role === ROLES.ADMIN) {
      hasAccess = true;
      accessType = 'admin';
      permissions = ['read', 'write', 'upload', 'delete'];
    }
    // Doctor siempre tiene acceso
    else if (targetUser.role === ROLES.DOCTOR) {
      hasAccess = true;
      accessType = 'doctor';
      permissions = ['read', 'write', 'upload'];
    }
    // Paciente a su propio expediente
    else if (patient.userId === userId) {
      hasAccess = true;
      accessType = 'owner';
      permissions = ['read', 'write'];
    }
    // Tutor a dependientes
    else if (patient.tutorId === userId) {
      hasAccess = true;
      accessType = 'tutor';
      permissions = ['read', 'write'];
    }
    // Verificar permisos otorgados
    else {
      const permission = accessPermissions.find(p => 
        p.patientId === patientId && 
        p.grantedTo === userId &&
        p.status === 'active' &&
        (!p.expiresAt || new Date(p.expiresAt) > new Date())
      );

      if (permission) {
        hasAccess = true;
        accessType = 'granted';
        permissions = permission.permissions;
      }
    }

    res.json({
      success: true,
      hasAccess,
      accessType,
      permissions
    });

  } catch (error) {
    console.error('Error al verificar acceso:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al verificar acceso'
    });
  }
};

module.exports = {
  getAccessPermissions,
  grantAccess,
  revokeAccess,
  updateAccessPermissions,
  checkAccess
};
