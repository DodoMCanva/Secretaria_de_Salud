import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, User, Search, Plus, Trash2, Check, X, Fingerprint, UserCheck, Clock } from 'lucide-react';

interface AuthorizedUser {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'specialist' | 'admin';
  license: string;
  grantedDate: string;
  expiresDate?: string;
  status: 'active' | 'pending' | 'revoked';
  lastAccess?: string;
}

interface AccessManagementProps {
  userType: 'patient' | 'guardian' | 'medical_staff';
}

export function AccessManagement({ userType }: AccessManagementProps) {
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([
    {
      id: '1',
      name: 'Dr. Carlos Mendoza',
      role: 'doctor',
      license: 'CED-12345678',
      grantedDate: '2024-01-15',
      expiresDate: '2024-12-31',
      status: 'active',
      lastAccess: '2024-02-28'
    },
    {
      id: '2',
      name: 'Dra. Ana Ruiz',
      role: 'doctor',
      license: 'CED-87654321',
      grantedDate: '2024-02-01',
      status: 'active',
      lastAccess: '2024-02-25'
    },
    {
      id: '3',
      name: 'Enf. Luis García',
      role: 'nurse',
      license: 'ENF-11223344',
      grantedDate: '2024-02-10',
      expiresDate: '2024-06-30',
      status: 'pending',
      lastAccess: undefined
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingAccess, setIsAddingAccess] = useState(false);
  const [biometricVerification, setBiometricVerification] = useState(false);
  const [newAccess, setNewAccess] = useState({
    name: '',
    role: '' as AuthorizedUser['role'] | '',
    license: '',
    expiresDate: ''
  });

  const canManageAccess = userType === 'patient' || userType === 'guardian';

  const filteredUsers = authorizedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const simulateBiometricAuth = () => {
    setBiometricVerification(true);
  };

  const handleAddAccess = () => {
    const newUser: AuthorizedUser = {
      id: Date.now().toString(),
      ...newAccess,
      role: newAccess.role as AuthorizedUser['role'],
      grantedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    
    setAuthorizedUsers([...authorizedUsers, newUser]);
    setNewAccess({ name: '', role: '', license: '', expiresDate: '' });
    setIsAddingAccess(false);
    setBiometricVerification(false);
  };

  const handleRevokeAccess = (userId: string) => {
    setAuthorizedUsers(authorizedUsers.map(user =>
      user.id === userId ? { ...user, status: 'revoked' as const } : user
    ));
  };

  const handleApproveAccess = (userId: string) => {
    setAuthorizedUsers(authorizedUsers.map(user =>
      user.id === userId ? { ...user, status: 'active' as const } : user
    ));
  };

  const getRoleBadge = (role: AuthorizedUser['role']) => {
    const roleConfig = {
      doctor: { label: 'Médico', color: 'bg-blue-100 text-blue-800' },
      specialist: { label: 'Especialista', color: 'bg-purple-100 text-purple-800' },
      nurse: { label: 'Enfermero(a)', color: 'bg-green-100 text-green-800' },
      admin: { label: 'Administrador', color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: AuthorizedUser['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'revoked':
        return <Badge className="bg-red-100 text-red-800">Revocado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Administración de Accesos
              </CardTitle>
              <CardDescription>
                Gestione los permisos de acceso al expediente clínico
              </CardDescription>
            </div>
            {canManageAccess && (
              <Dialog open={isAddingAccess} onOpenChange={setIsAddingAccess}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Acceso
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Otorgar Nuevo Acceso</DialogTitle>
                    <DialogDescription>
                      Agregue un profesional de salud autorizado para acceder al expediente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={newAccess.name}
                        onChange={(e) => setNewAccess({...newAccess, name: e.target.value})}
                        placeholder="Nombre del profesional"
                      />
                    </div>

                    <div>
                      <Label>Rol</Label>
                      <Select onValueChange={(value) => setNewAccess({...newAccess, role: value as AuthorizedUser['role']})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Médico</SelectItem>
                          <SelectItem value="specialist">Especialista</SelectItem>
                          <SelectItem value="nurse">Enfermero(a)</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="license">Cédula Profesional</Label>
                      <Input
                        id="license"
                        value={newAccess.license}
                        onChange={(e) => setNewAccess({...newAccess, license: e.target.value})}
                        placeholder="Número de cédula profesional"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expires">Fecha de Expiración (Opcional)</Label>
                      <Input
                        id="expires"
                        type="date"
                        value={newAccess.expiresDate}
                        onChange={(e) => setNewAccess({...newAccess, expiresDate: e.target.value})}
                      />
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Fingerprint className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Verificación Biométrica Requerida</span>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        Su identidad debe ser verificada para otorgar permisos de acceso
                      </p>
                      
                      {!biometricVerification ? (
                        <Button 
                          onClick={simulateBiometricAuth}
                          variant="outline" 
                          className="w-full border-blue-300 text-blue-700"
                        >
                          Verificar Huella Digital
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-700">
                          <Check className="h-4 w-4" />
                          <span className="text-sm">Identidad verificada</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleAddAccess} 
                      className="w-full"
                      disabled={!newAccess.name || !newAccess.role || !newAccess.license || !biometricVerification}
                    >
                      Otorgar Acceso
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o cédula profesional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Activos</p>
                <p className="text-sm text-gray-500">
                  {authorizedUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Pendientes</p>
                <p className="text-sm text-gray-500">
                  {authorizedUsers.filter(u => u.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Revocados</p>
                <p className="text-sm text-gray-500">
                  {authorizedUsers.filter(u => u.status === 'revoked').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Total</p>
                <p className="text-sm text-gray-500">
                  {authorizedUsers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Autorizados</CardTitle>
          <CardDescription>
            Lista de profesionales con acceso al expediente clínico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profesional</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Expira</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          Autorizado: {new Date(user.grantedDate).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="font-mono text-sm">{user.license}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    {user.lastAccess 
                      ? new Date(user.lastAccess).toLocaleDateString('es-MX')
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    {user.expiresDate 
                      ? new Date(user.expiresDate).toLocaleDateString('es-MX')
                      : 'Sin límite'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === 'pending' && canManageAccess && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveAccess(user.id)}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {user.status === 'active' && canManageAccess && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Revocar acceso?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción revocará inmediatamente el acceso de {user.name} al expediente clínico.
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevokeAccess(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Revocar Acceso
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron usuarios autorizados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}