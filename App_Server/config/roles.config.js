/**
 * Definición de roles del sistema
 */
const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  TUTOR: 'tutor'
};

/**
 * Permisos por rol
 */
const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'patients:read',
    'patients:create',
    'patients:update',
    'patients:delete',
    'appointments:read',
    'appointments:create',
    'appointments:update',
    'appointments:delete',
    'documents:read',
    'documents:upload',
    'documents:delete',
    'access:manage',
    'system:configure'
  ],
  [ROLES.DOCTOR]: [
    'patients:read',
    'patients:update',
    'appointments:read',
    'appointments:create',
    'appointments:update',
    'documents:read',
    'documents:upload',
    'consultations:create',
    'consultations:update',
    'prescriptions:create'
  ],
  [ROLES.PATIENT]: [
    'profile:read',
    'profile:update',
    'appointments:read',
    'appointments:create',
    'appointments:cancel',
    'documents:read',
    'access:manage-own',
    'medical-record:read-own'
  ],
  [ROLES.TUTOR]: [
    'profile:read',
    'profile:update',
    'appointments:read',
    'appointments:create',
    'appointments:cancel',
    'documents:read',
    'access:manage-dependents',
    'medical-record:read-dependents'
  ]
};

/**
 * Verifica si un rol tiene un permiso específico
 * @param {String} role - Rol del usuario
 * @param {String} permission - Permiso a verificar
 * @returns {Boolean}
 */
const hasPermission = (role, permission) => {
  const rolePermissions = PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Verifica si un rol tiene al menos uno de los permisos especificados
 * @param {String} role - Rol del usuario
 * @param {Array} permissions - Array de permisos
 * @returns {Boolean}
 */
const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Verifica si un rol tiene todos los permisos especificados
 * @param {String} role - Rol del usuario
 * @param {Array} permissions - Array de permisos
 * @returns {Boolean}
 */
const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Obtiene todos los permisos de un rol
 * @param {String} role - Rol del usuario
 * @returns {Array}
 */
const getRolePermissions = (role) => {
  return PERMISSIONS[role] || [];
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions
};
