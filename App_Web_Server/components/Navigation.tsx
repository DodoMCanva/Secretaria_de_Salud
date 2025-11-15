import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Calendar, Shield, User, LogOut, Fingerprint } from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userType: 'patient' | 'guardian' | 'medical_staff';
  userName: string;
  onLogout: () => void;
}

export function Navigation({ activeView, onViewChange, userType, userName, onLogout }: NavigationProps) {
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

  const getUserTypeBadgeColor = () => {
    switch (userType) {
      case 'patient':
        return 'bg-blue-100 text-blue-800';
      case 'guardian':
        return 'bg-green-100 text-green-800';
      case 'medical_staff':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigationItems = [
    {
      id: 'clinical-record',
      label: 'Expediente Clínico',
      icon: FileText,
      description: 'Historial médico y documentos'
    },
    {
      id: 'appointments',
      label: 'Citas Médicas',
      icon: Calendar,
      description: 'Agendar y gestionar citas'
    },
    {
      id: 'access-management',
      label: 'Gestión de Accesos',
      icon: Shield,
      description: 'Permisos y autorizaciones'
    },
    {
      id: 'profile',
      label: 'Configuración',
      icon: User,
      description: 'Perfil y preferencias'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
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
          <Badge className={getUserTypeBadgeColor()}>
            {getUserTypeLabel()}
          </Badge>
        </div>
      </div>

      {/* Navigation */}
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
              onClick={() => onViewChange(item.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${
                    isActive ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}