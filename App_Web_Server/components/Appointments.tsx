import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Calendar, Clock, User, Plus, Check, X, Fingerprint } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  specialty: string;
  doctor: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  remoteAccess: boolean;
}

interface AppointmentsProps {
  userType: 'patient' | 'guardian' | 'medical_staff';
}

export function Appointments({ userType }: AppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([
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
  ]);

  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    specialty: '',
    doctor: '',
    remoteAccess: false
  });

  const [biometricVerification, setBiometricVerification] = useState(false);

  const specialties = [
    'Medicina General',
    'Cardiología',
    'Neurología',
    'Dermatología',
    'Pediatría',
    'Ginecología',
    'Traumatología',
    'Psiquiatría'
  ];

  const doctors = [
    'Dr. Carlos Mendoza',
    'Dra. Ana Ruiz',
    'Dr. Luis García',
    'Dra. María Fernández',
    'Dr. Roberto López',
    'Dra. Carmen Morales'
  ];

  const canSchedule = userType === 'patient' || userType === 'guardian';

  const handleCreateAppointment = () => {
    const appointment: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: 'scheduled'
    };
    
    setAppointments([...appointments, appointment]);
    setNewAppointment({
      date: '',
      time: '',
      specialty: '',
      doctor: '',
      remoteAccess: false
    });
    setIsCreatingAppointment(false);
    setBiometricVerification(false);
  };

  const toggleRemoteAccess = (appointmentId: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, remoteAccess: !apt.remoteAccess }
        : apt
    ));
  };

  const simulateBiometricAuth = () => {
    setBiometricVerification(true);
    setTimeout(() => {
      // Simulate successful verification after 2 seconds
    }, 2000);
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Programada</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
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
                <Calendar className="h-5 w-5" />
                Gestión de Citas Médicas
              </CardTitle>
              <CardDescription>
                Agende citas y gestione el acceso remoto al expediente clínico
              </CardDescription>
            </div>
            {canSchedule && (
              <Dialog open={isCreatingAppointment} onOpenChange={setIsCreatingAppointment}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agendar Nueva Cita</DialogTitle>
                    <DialogDescription>
                      Complete los datos de la cita médica
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Fecha</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newAppointment.date}
                          onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Hora</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newAppointment.time}
                          onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Especialidad</Label>
                      <Select onValueChange={(value) => setNewAppointment({...newAppointment, specialty: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Médico</Label>
                      <Select onValueChange={(value) => setNewAppointment({...newAppointment, doctor: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione médico" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor} value={doctor}>
                              {doctor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label>Acceso Remoto al Expediente</Label>
                        <p className="text-sm text-gray-500">
                          Permitir al médico acceder a su expediente antes de la consulta
                        </p>
                      </div>
                      <Switch
                        checked={newAppointment.remoteAccess}
                        onCheckedChange={(checked) => setNewAppointment({...newAppointment, remoteAccess: checked})}
                      />
                    </div>

                    {newAppointment.remoteAccess && (
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center gap-2 mb-3">
                          <Fingerprint className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Verificación Biométrica Requerida</span>
                        </div>
                        
                        {!biometricVerification ? (
                          <Button 
                            onClick={simulateBiometricAuth}
                            variant="outline" 
                            className="w-full border-blue-300 text-blue-700"
                          >
                            Verificar Identidad
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-700">
                            <Check className="h-4 w-4" />
                            <span className="text-sm">Identidad verificada</span>
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      onClick={handleCreateAppointment} 
                      className="w-full"
                      disabled={!newAppointment.date || !newAppointment.time || !newAppointment.specialty || !newAppointment.doctor || (newAppointment.remoteAccess && !biometricVerification)}
                    >
                      Confirmar Cita
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Citas Programadas</CardTitle>
          <CardDescription>
            Lista de citas médicas y configuración de accesos
          </CardDescription>
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
                <TableHead className="text-right">Acciones</TableHead>
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
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={appointment.remoteAccess}
                        onCheckedChange={() => canSchedule && toggleRemoteAccess(appointment.id)}
                        disabled={!canSchedule}
                      />
                      {appointment.remoteAccess && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          <Fingerprint className="h-3 w-3 mr-1" />
                          Autorizado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                      {canSchedule && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Próxima Cita</p>
                <p className="text-sm text-gray-500">
                  {appointments.find(apt => apt.status === 'confirmed')?.date 
                    ? new Date(appointments.find(apt => apt.status === 'confirmed')!.date).toLocaleDateString('es-MX')
                    : 'No programada'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Citas Confirmadas</p>
                <p className="text-sm text-gray-500">
                  {appointments.filter(apt => apt.status === 'confirmed').length} de {appointments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Accesos Remotos</p>
                <p className="text-sm text-gray-500">
                  {appointments.filter(apt => apt.remoteAccess).length} autorizados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}