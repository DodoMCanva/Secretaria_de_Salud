import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { User, Calendar, FileText, Image, Download, Plus, Upload } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  curp: string;
  nss: string;
  bloodType: string;
  allergies: string[];
  emergency_contact: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

interface ClinicalRecordProps {
  userType: 'patient' | 'guardian' | 'medical_staff';
}

export function ClinicalRecord({ userType }: ClinicalRecordProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient>({
    id: 'pat_001',
    name: 'María Elena González López',
    age: 34,
    curp: 'GOLM890515MDFNLR08',
    nss: '12345678901',
    bloodType: 'O+',
    allergies: ['Penicilina', 'Mariscos'],
    emergency_contact: '+52 55 1234 5678'
  });

  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([
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
  ]);

  const [isAddingConsultation, setIsAddingConsultation] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    doctor: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  const canEdit = userType === 'medical_staff';

  const handleAddConsultation = () => {
    const consultation: MedicalRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newConsultation
    };
    
    setMedicalHistory([consultation, ...medicalHistory]);
    setNewConsultation({ doctor: '', diagnosis: '', treatment: '', notes: '' });
    setIsAddingConsultation(false);
  };

  return (
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
                <CardTitle>{selectedPatient.name}</CardTitle>
                <CardDescription>Expediente Clínico - ID: {selectedPatient.id}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Activo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Edad</Label>
              <p>{selectedPatient.age} años</p>
            </div>
            <div>
              <Label>CURP</Label>
              <p className="font-mono text-sm">{selectedPatient.curp}</p>
            </div>
            <div>
              <Label>NSS</Label>
              <p className="font-mono text-sm">{selectedPatient.nss}</p>
            </div>
            <div>
              <Label>Tipo de Sangre</Label>
              <p>{selectedPatient.bloodType}</p>
            </div>
            <div>
              <Label>Alergias</Label>
              <div className="flex gap-1 flex-wrap">
                {selectedPatient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Contacto de Emergencia</Label>
              <p>{selectedPatient.emergency_contact}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Historial Clínico</TabsTrigger>
          <TabsTrigger value="images">Imágenes Médicas</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historial de Consultas</CardTitle>
                  <CardDescription>Registro completo de consultas médicas</CardDescription>
                </div>
                <div className="space-x-2">
                  {canEdit && (
                    <Dialog open={isAddingConsultation} onOpenChange={setIsAddingConsultation}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Consulta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nueva Consulta</DialogTitle>
                          <DialogDescription>
                            Registrar nueva consulta médica
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="doctor">Médico</Label>
                            <Input
                              id="doctor"
                              value={newConsultation.doctor}
                              onChange={(e) => setNewConsultation({...newConsultation, doctor: e.target.value})}
                              placeholder="Nombre del médico"
                            />
                          </div>
                          <div>
                            <Label htmlFor="diagnosis">Diagnóstico</Label>
                            <Input
                              id="diagnosis"
                              value={newConsultation.diagnosis}
                              onChange={(e) => setNewConsultation({...newConsultation, diagnosis: e.target.value})}
                              placeholder="Diagnóstico principal"
                            />
                          </div>
                          <div>
                            <Label htmlFor="treatment">Tratamiento</Label>
                            <Input
                              id="treatment"
                              value={newConsultation.treatment}
                              onChange={(e) => setNewConsultation({...newConsultation, treatment: e.target.value})}
                              placeholder="Medicación y tratamiento"
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                              id="notes"
                              value={newConsultation.notes}
                              onChange={(e) => setNewConsultation({...newConsultation, notes: e.target.value})}
                              placeholder="Observaciones adicionales"
                            />
                          </div>
                          <Button onClick={handleAddConsultation} className="w-full">
                            Guardar Consulta
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
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
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Imágenes Médicas</CardTitle>
                  <CardDescription>Radiografías, resonancias y estudios de imagen</CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Imagen
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: 'Radiografía de Tórax', date: '2024-01-15', url: 'chest-xray.jpg' },
                  { type: 'Resonancia Cerebral', date: '2024-02-10', url: 'brain-mri.jpg' },
                  { type: 'Ultrasonido Abdominal', date: '2024-02-20', url: 'abdominal-us.jpg' }
                ].map((image, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium">{image.type}</h4>
                      <p className="text-sm text-gray-500">{new Date(image.date).toLocaleDateString('es-MX')}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documentos</CardTitle>
                  <CardDescription>Resultados de laboratorio, recetas y documentos PDF</CardDescription>
                </div>
                {canEdit && (
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documento
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Análisis de Sangre - Enero 2024', type: 'PDF', date: '2024-01-15', size: '2.3 MB' },
                  { name: 'Receta Médica - Control HTA', type: 'PDF', date: '2024-02-20', size: '1.1 MB' },
                  { name: 'Estudios de Laboratorio', type: 'PDF', date: '2024-02-25', size: '3.7 MB' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString('es-MX')} • {doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}