import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Fingerprint, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface BiometricAuthProps {
  onAuthenticated: (userType: 'patient' | 'guardian' | 'medical_staff', userId: string) => void;
}

export function BiometricAuth({ onAuthenticated }: BiometricAuthProps) {
  const [authStatus, setAuthStatus] = useState<'idle' | 'authenticating' | 'success' | 'failed' | 'invalid'>('idle');

  const simulateAuth = () => {
    setAuthStatus('authenticating');
    
    setTimeout(() => {
      // Simulate random authentication results
      const outcomes = [
        { status: 'success' as const, userType: 'medical_staff' as const, userId: 'med_001' },
        { status: 'success' as const, userType: 'patient' as const, userId: 'pat_001' },
        { status: 'success' as const, userType: 'guardian' as const, userId: 'gua_001' },
        { status: 'failed' as const, userType: null, userId: null },
        { status: 'invalid' as const, userType: null, userId: null }
      ];
      
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setAuthStatus(outcome.status);
      
      if (outcome.status === 'success' && outcome.userType && outcome.userId) {
        setTimeout(() => {
          onAuthenticated(outcome.userType, outcome.userId);
        }, 1000);
      } else {
        setTimeout(() => {
          setAuthStatus('idle');
        }, 2000);
      }
    }, 2000);
  };

  const getStatusMessage = () => {
    switch (authStatus) {
      case 'authenticating':
        return { text: 'Autenticando...', icon: <Loader2 className="h-6 w-6 animate-spin text-blue-500" />, color: 'text-blue-600' };
      case 'success':
        return { text: 'Acceso autorizado', icon: <CheckCircle className="h-6 w-6 text-green-500" />, color: 'text-green-600' };
      case 'failed':
        return { text: 'Acceso denegado', icon: <XCircle className="h-6 w-6 text-red-500" />, color: 'text-red-600' };
      case 'invalid':
        return { text: 'Huella no válida', icon: <XCircle className="h-6 w-6 text-red-500" />, color: 'text-red-600' };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Fingerprint className="h-8 w-8 text-blue-600" />
            Sistema Médico Integrado
          </CardTitle>
          <CardDescription>
            Autenticación biométrica requerida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-blue-300">
                <Fingerprint className="h-16 w-16 text-blue-600" />
              </div>
              {authStatus === 'authenticating' && (
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse" />
              )}
            </div>
            
            <Button 
              onClick={simulateAuth}
              disabled={authStatus === 'authenticating'}
              className="w-full"
              size="lg"
            >
              {authStatus === 'authenticating' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                'Validar Huella Digital'
              )}
            </Button>
          </div>

          {statusMessage && (
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 ${statusMessage.color}`}>
              {statusMessage.icon}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Coloque su dedo en el sensor biométrico
            </p>
            <div className="text-xs text-gray-500">
              <p>• Pacientes y tutores: Acceso a expediente personal</p>
              <p>• Personal médico: Acceso según permisos asignados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}