import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Switch } from './components/ui/switch';
import { 
  User, 
  Calendar, 
  FileText, 
  Image, 
  Download, 
  Plus, 
  Upload, 
  Clock, 
  Shield, 
  Fingerprint, 
  Check, 
  X,
  Search,
  UserCheck,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Camera,
  Key,
  Bell,
  Save,
  LogOut
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('clinical-record');
  const [isEditing, setIsEditing] = useState(false);
  
  const userName = 'Dra. Ana Ruiz Fernández';
  const userType = 'medical_staff';

  // Sample data
  const patient = {
    name: 'María Elena González López',
    age: 34,
    curp: 'GOLM890515MDFNLR08',
    nss: '12345678901',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Mariscos'],
    emergency_contact: '+52 55 1234 5678'
  };

  const medicalHistory = [
    {
      id: '1',
      date: '2024-01-15',
      doctor: 'Dr. Carlos Mendoza',
      diagnosis: 'Hipertensión arterial',
      treatment: 'Losartán 50mg diario',
      notes: 'Control en 3 meses. Dieta baja en sodio.'
    },
    {
      id: '2',
      date: '2024-02-20',
      doctor: 'Dra. Ana Ruiz',
      diagnosis: 'Control rutinario',
      treatment: 'Continuar medicación actual',
      notes: 'Presión arterial controlada. Excelente adherencia al tratamiento.'
    }
  ];

  const appointments = [
    {
      id: '1',
      date: '2024-03-15',
      time: '10:00',
      specialty: 'Cardiología',
      doctor: 'Dr. Carlos Mendoza',
      status: 'confirmed',
      remoteAccess: true
    },
    {
      id: '2',
      date: '2024-03-22',
      time: '14:30',
      specialty: 'Medicina General',
      doctor: 'Dra. Ana Ruiz',
      status: 'scheduled',
      remoteAccess: false
    }
  ];

  const authorizedUsers = [
    {
      id: '1',
      name: 'Dr. Carlos Mendoza',
      role: 'doctor',
      license: 'CED-12345678',
      grantedDate: '2024-01-15',
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
    }
  ];

  const navigationItems = [
    { id: 'clinical-record', label: 'Expediente Clínico', icon: FileText },
    { id: 'appointments', label: 'Citas Médicas', icon: Calendar },
    { id: 'access-management', label: 'Gestión de Accesos', icon: Shield },
    { id: 'profile', label: 'Configuración', icon: User }
  ];

  const renderClinicalRecord = () => (
    <div className="space-y-6">
      {/* Patient Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>{patient.name}</CardTitle>
                <CardDescription>Expediente Clínico - ID: pat_001</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">Activo</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Edad</Label>
              <p>{patient.age} años</p>
            </div>
            <div>
              <Label>CURP</Label>
              <p className="font-mono text-sm">{patient.curp}</p>
            </div>
            <div>
              <Label>NSS</Label>
              <p className="font-mono text-sm">{patient.nss}</p>
            </div>
            <div>
              <Label>Tipo de Sangre</Label>
              <p>{patient.bloodType}</p>
            </div>
            <div>
              <Label>Alergias</Label>
              <div className="flex gap-1 flex-wrap">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">{allergy}</Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Contacto de Emergencia</Label>
              <p>{patient.emergency_contact}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Consultas</CardTitle>
              <CardDescription>Registro completo de consultas médicas</CardDescription>
            </div>
            <div className="space-x-2">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Consulta
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Descargar Expediente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Tratamiento</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.date).toLocaleDateString('es-MX')}</TableCell>
                  <TableCell>{record.doctor}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gestión de Citas Médicas
              </CardTitle>
              <CardDescription>Agende citas y gestione el acceso remoto al expediente clínico</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Citas Programadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acceso Remoto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p>{new Date(appointment.date).toLocaleDateString('es-MX')}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {appointment.doctor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {appointment.status === 'confirmed' ? 'Confirmada' : 'Programada'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={appointment.remoteAccess} />
                      {appointment.remoteAccess && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          <Fingerprint className="h-3 w-3 mr-1" />
                          Autorizado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccessManagement = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Administración de Accesos
              </CardTitle>
              <CardDescription>Gestione los permisos de acceso al expediente clínico</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Acceso
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar por nombre o cédula profesional..." className="pl-10" />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Activos</p>
                <p className="text-sm text-gray-500">2</p>
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
                <p className="text-sm text-gray-500">0</p>
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
                <p className="text-sm text-gray-500">0</p>
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
                <p className="text-sm text-gray-500">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Autorizados</CardTitle>
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorizedUsers.map((user) => (
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
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">Médico</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{user.license}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.lastAccess).toLocaleDateString('es-MX')}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">AR</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{userName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline">Personal Médico</Badge>
                  <span>•</span>
                  <span>Cuenta verificada</span>
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              ) : (
                'Editar Perfil'
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre Completo</Label>
                  <Input value={userName} disabled={!isEditing} />
                </div>
                <div>
                  <Label>Correo Electrónico</Label>
                  <Input value="ana.ruiz@hospital.com" disabled={!isEditing} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value="+52 55 1234 5678" disabled={!isEditing} />
                </div>
                <div>
                  <Label>Contacto de Emergencia</Label>
                  <Input value="Carlos Ruiz - +52 55 8765 4321" disabled={!isEditing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Autenticación Biométrica</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Fingerprint className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Huella Digital Principal</p>
                    <p className="text-sm text-gray-500">Registrada y activa</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Activa
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Recordatorios de Citas</Label>
                  <p className="text-sm text-gray-500">Notificaciones antes de sus citas médicas</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Actualizaciones del Expediente</Label>
                  <p className="text-sm text-gray-500">Cuando se agregue nueva información</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'clinical-record':
        return renderClinicalRecord();
      case 'appointments':
        return renderAppointments();
      case 'access-management':
        return renderAccessManagement();
      case 'profile':
        return renderProfile();
      default:
        return renderClinicalRecord();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Fingerprint className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-medium text-gray-900">Sistema Médico</h1>
              <p className="text-sm text-gray-500">Integrado</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-gray-900 truncate">{userName}</p>
            <Badge className="bg-purple-100 text-purple-800">Personal Médico</Badge>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView(item.id)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}