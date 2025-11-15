const { patients, consultations, documents } = require('../data/mockData');
const { ROLES } = require('../config/roles.config');

/**
 * Obtener todos los pacientes (solo admin/doctor)
 */
const getAllPatients = async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let filteredPatients = [...patients];

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = filteredPatients.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower)
      );
    }

    // Paginación
    const total = filteredPatients.length;
    const paginatedPatients = filteredPatients.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      success: true,
      data: paginatedPatients,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener lista de pacientes'
    });
  }
};

/**
 * Obtener expediente de un paciente específico
 */
const getPatientRecord = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    // Buscar paciente
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos de acceso
    const hasAccess = checkPatientAccess(user, patient);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'No tiene permisos para ver este expediente'
      });
    }

    // Obtener consultas del paciente
    const patientConsultations = consultations.filter(c => c.patientId === patientId);

    // Obtener documentos del paciente
    const patientDocuments = documents.filter(d => d.patientId === patientId);

    res.json({
      success: true,
      data: {
        patient,
        consultations: patientConsultations,
        documents: patientDocuments,
        summary: {
          totalConsultations: patientConsultations.length,
          totalDocuments: patientDocuments.length,
          lastVisit: patient.lastVisit
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener expediente:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener expediente del paciente'
    });
  }
};

/**
 * Obtener historial clínico (consultas)
 */
const getClinicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    const hasAccess = checkPatientAccess(user, patient);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    const patientConsultations = consultations
      .filter(c => c.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: patientConsultations
    });

  } catch (error) {
    console.error('Error al obtener historial clínico:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener historial clínico'
    });
  }
};

/**
 * Crear nueva consulta médica
 */
const createConsultation = async (req, res) => {
  try {
    const { patientId } = req.params;
    const consultationData = req.body;
    const user = req.user;

    // Solo doctores pueden crear consultas
    if (user.role !== ROLES.DOCTOR && user.role !== ROLES.ADMIN) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo el personal médico puede crear consultas'
      });
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    const newConsultation = {
      id: require('uuid').v4(),
      patientId,
      doctorId: user.id,
      doctorName: user.name,
      date: new Date().toISOString().split('T')[0],
      ...consultationData,
      createdAt: new Date()
    };

    consultations.push(newConsultation);

    // Actualizar última visita del paciente
    patient.lastVisit = new Date();

    res.status(201).json({
      success: true,
      message: 'Consulta registrada exitosamente',
      data: newConsultation
    });

  } catch (error) {
    console.error('Error al crear consulta:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al registrar consulta'
    });
  }
};

/**
 * Actualizar información del paciente
 */
const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updates = req.body;
    const user = req.user;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Solo admin, doctor o el propio paciente pueden actualizar
    if (user.role !== ROLES.ADMIN && 
        user.role !== ROLES.DOCTOR && 
        patient.userId !== user.id &&
        patient.tutorId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    // Actualizar campos permitidos
    const allowedUpdates = ['phone', 'emergencyContact', 'insurance', 'allergies', 'chronicConditions'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        patient[field] = updates[field];
      }
    });

    res.json({
      success: true,
      message: 'Paciente actualizado exitosamente',
      data: patient
    });

  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al actualizar información del paciente'
    });
  }
};

/**
 * Verificar acceso del usuario al paciente
 */
const checkPatientAccess = (user, patient) => {
  // Admin tiene acceso a todo
  if (user.role === ROLES.ADMIN) return true;

  // Doctor tiene acceso a todos los pacientes
  if (user.role === ROLES.DOCTOR) return true;

  // Paciente tiene acceso a su propio expediente
  if (user.role === ROLES.PATIENT && patient.userId === user.id) return true;

  // Tutor tiene acceso a sus dependientes
  if (user.role === ROLES.TUTOR && patient.tutorId === user.id) return true;

  return false;
};

module.exports = {
  getAllPatients,
  getPatientRecord,
  getClinicalHistory,
  createConsultation,
  updatePatient
};
