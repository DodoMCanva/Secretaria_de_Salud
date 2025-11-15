import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { User, Mail, Phone, MapPin, Camera, Fingerprint, Key, Shield, Bell, Save, Check } from 'lucide-react';

interface ProfileConfigProps {
  userType: 'patient' | 'guardian' | 'medical_staff';
  userName: string;
}

export function ProfileConfig({ userType, userName }: ProfileConfigProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName,
    email: 'maria.gonzalez@email.com',
    phone: '+52 55 1234 5678',
    address: 'Av. Reforma 123, Col. Centro, Ciudad de México',
    emergencyContact: 'Carlos González - +52 55 8765 4321',
    bio: userType === 'medical_staff' ? 'Cardióloga con 15 años de experiencia especializada en medicina preventiva.' : ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    biometricEnabled: true,
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginNotifications: true
  });

  const [fingerprintStatus, setFingerprintStatus] = useState<'registered' | 'registering' | 'none'>('registered');
  const [passwordChange, setPasswordChange] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Simulate save
  };

  const handleRegisterFingerprint = () => {
    setFingerprintStatus('registering');
    setTimeout(() => {
      setFingerprintStatus('registered');
    }, 3000);
  };

  const handleSecuritySettingChange = (setting: keyof typeof securitySettings, value: boolean | string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'patient':
        return 'Paciente';
      case 'guardian':
        return 'Tutor';
      case 'medical_staff':
        return 'Personal Médico';
      default:
        return 'Usuario';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/avatar-placeholder.jpg" />
                <AvatarFallback className="text-lg">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{userName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline">{getUserTypeLabel()}</Badge>
                  <span>•</span>
                  <span>Cuenta verificada</span>
                </CardDescription>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            >
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

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>
                Actualice su información personal y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency">Contacto de Emergencia</Label>
                  <Input
                    id="emergency"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              {userType === 'medical_staff' && (
                <div>
                  <Label htmlFor="bio">Biografía Profesional</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Especialidades, experiencia, certificaciones..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fotografía de Perfil</CardTitle>
              <CardDescription>
                Actualice su imagen de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/avatar-placeholder.jpg" />
                  <AvatarFallback className="text-xl">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" disabled={!isEditing}>
                    <Camera className="h-4 w-4 mr-2" />
                    Cambiar Foto
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, PNG o GIF. Máximo 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Autenticación Biométrica</CardTitle>
              <CardDescription>
                Configure su huella digital para acceso seguro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Fingerprint className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Huella Digital Principal</p>
                    <p className="text-sm text-gray-500">
                      {fingerprintStatus === 'registered' ? 'Registrada y activa' : 'No registrada'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {fingerprintStatus === 'registered' && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Activa
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegisterFingerprint}
                    disabled={fingerprintStatus === 'registering'}
                  >
                    {fingerprintStatus === 'registering' ? 'Registrando...' : 'Registrar Nueva'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticación Biométrica</Label>
                    <p className="text-sm text-gray-500">Usar huella digital para iniciar sesión</p>
                  </div>
                  <Switch
                    checked={securitySettings.biometricEnabled}
                    onCheckedChange={(checked) => handleSecuritySettingChange('biometricEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-gray-500">Seguridad adicional con código SMS</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contraseña de Respaldo</CardTitle>
              <CardDescription>
                Configure una contraseña de emergencia en caso de fallo biométrico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordChange.current}
                  onChange={(e) => setPasswordChange({...passwordChange, current: e.target.value})}
                  placeholder="Ingrese su contraseña actual"
                />
              </div>
              <div>
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordChange.new}
                  onChange={(e) => setPasswordChange({...passwordChange, new: e.target.value})}
                  placeholder="Ingrese nueva contraseña"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordChange.confirm}
                  onChange={(e) => setPasswordChange({...passwordChange, confirm: e.target.value})}
                  placeholder="Confirme la nueva contraseña"
                />
              </div>
              <Button className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Actualizar Contraseña
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de Sesión</CardTitle>
              <CardDescription>
                Configure el comportamiento de las sesiones de usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeout">Tiempo de Inactividad (minutos)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecuritySettingChange('sessionTimeout', e.target.value)}
                  min="5"
                  max="120"
                />
                <p className="text-sm text-gray-500 mt-1">
                  La sesión se cerrará automáticamente después del tiempo especificado sin actividad
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones de Inicio de Sesión</Label>
                  <p className="text-sm text-gray-500">Recibir alertas de nuevos accesos</p>
                </div>
                <Switch
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(checked) => handleSecuritySettingChange('loginNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configure qué notificaciones desea recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
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

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cambios en Permisos</Label>
                    <p className="text-sm text-gray-500">Cuando se modifiquen los accesos autorizados</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Alertas de Seguridad</Label>
                    <p className="text-sm text-gray-500">Accesos no autorizados y eventos críticos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacidad</CardTitle>
              <CardDescription>
                Configure sus preferencias de privacidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Perfil Público</Label>
                    <p className="text-sm text-gray-500">Permitir que otros usuarios vean su perfil básico</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compartir Datos Anónimos</Label>
                    <p className="text-sm text-gray-500">Para investigación médica y mejoras del sistema</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Historial de Actividad</Label>
                    <p className="text-sm text-gray-500">Mantener registro de acciones en el sistema</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soporte y Ayuda</CardTitle>
              <CardDescription>
                Acceso a recursos de ayuda y contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Centro de Ayuda
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Política de Privacidad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}