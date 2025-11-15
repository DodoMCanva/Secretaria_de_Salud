const { appointments, users, patients } = require('../data/mockData');
const { ROLES } = require('../config/roles.config');
const { 
  publishAppointmentCreated,
  publishAppointmentUpdated,
  publishAppointmentCancelled 
} = require('../services/rabbitmq.service');

/**
 * Obtener todas las citas (filtradas por usuario)
 */
const getAppointments = async (req, res) => {
  try {
    const user = req.user;
    const { status, startDate, endDate, doctorId } = req.query;

    let filteredAppointments = [...appointments];

    // Filtrar por rol
    if (user.role === ROLES.PATIENT) {
      // Buscar paciente del usuario
      const patient = patients.find(p => p.userId === user.id);
      if (patient) {
        filteredAppointments = filteredAppointments.filter(a => a.patientId === patient.id);
      }
    } else if (user.role === ROLES.TUTOR) {
      // Buscar dependientes del tutor
      const dependents = patients.filter(p => p.tutorId === user.id);
      const dependentIds = dependents.map(d => d.id);
      filteredAppointments = filteredAppointments.filter(a => dependentIds.includes(a.patientId));
    } else if (user.role === ROLES.DOCTOR) {
      filteredAppointments = filteredAppointments.filter(a => a.doctorId === user.id);
    }
    // Admin ve todas las citas

    // Filtros adicionales
    if (status) {
      filteredAppointments = filteredAppointments.filter(a => a.status === status);
    }

    if (startDate) {
      filteredAppointments = filteredAppointments.filter(a => a.date >= startDate);
    }

    if (endDate) {
      filteredAppointments = filteredAppointments.filter(a => a.date <= endDate);
    }

    if (doctorId) {
      filteredAppointments = filteredAppointments.filter(a => a.doctorId === doctorId);
    }

    // Ordenar por fecha
    filteredAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    res.json({
      success: true,
      data: filteredAppointments,
      total: filteredAppointments.length
    });

  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener citas'
    });
  }
};

/**
 * Obtener una cita específica
 */
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const user = req.user;

    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ 
        error: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    const hasAccess = checkAppointmentAccess(user, appointment);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener cita'
    });
  }
};

/**
 * Crear nueva cita
 */
const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, type, reason, notes } = req.body;
    const user = req.user;

    // Verificar que el paciente exista
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos para crear cita para este paciente
    if (user.role === ROLES.PATIENT && patient.userId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puede crear citas para usted mismo'
      });
    }

    if (user.role === ROLES.TUTOR && patient.tutorId !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo puede crear citas para sus dependientes'
      });
    }

    // Verificar que el doctor exista
    const doctor = users.find(u => u.id === doctorId && u.role === ROLES.DOCTOR);
    if (!doctor) {
      return res.status(404).json({ 
        error: 'Doctor no encontrado'
      });
    }

    // Verificar disponibilidad (simulado)
    const isAvailable = checkDoctorAvailability(doctorId, date, time);
    if (!isAvailable) {
      return res.status(409).json({ 
        error: 'Horario no disponible',
        message: 'El doctor no tiene disponibilidad en ese horario'
      });
    }

    const newAppointment = {
      id: require('uuid').v4(),
      patientId,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      duration: 30,
      type: type || 'Consulta',
      status: 'programada',
      reason,
      notes: notes || '',
      location: `Consultorio ${Math.floor(Math.random() * 400) + 100}`,
      createdAt: new Date()
    };

    appointments.push(newAppointment);

    // Publicar evento en RabbitMQ
    await publishAppointmentCreated(newAppointment);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: newAppointment
    });

  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al crear cita'
    });
  }
};

/**
 * Actualizar cita
 */
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updates = req.body;
    const user = req.user;

    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ 
        error: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    const hasAccess = checkAppointmentAccess(user, appointment);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    // Actualizar campos permitidos
    const allowedUpdates = ['date', 'time', 'notes', 'status', 'diagnosis', 'prescription'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        appointment[field] = updates[field];
      }
    });

    if (updates.status === 'completada') {
      appointment.completedAt = new Date();
    }

    // Publicar evento
    await publishAppointmentUpdated(appointment);

    res.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al actualizar cita'
    });
  }
};

/**
 * Cancelar cita
 */
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;
    const user = req.user;

    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ 
        error: 'Cita no encontrada'
      });
    }

    const hasAccess = checkAppointmentAccess(user, appointment);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    appointment.status = 'cancelada';
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = user.id;

    // Publicar evento
    await publishAppointmentCancelled(appointmentId);

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error al cancelar cita:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al cancelar cita'
    });
  }
};

/**
 * Obtener horarios disponibles de un doctor
 */
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = users.find(u => u.id === doctorId && u.role === ROLES.DOCTOR);
    if (!doctor) {
      return res.status(404).json({ 
        error: 'Doctor no encontrado'
      });
    }

    // Obtener citas del doctor en esa fecha
    const doctorAppointments = appointments.filter(a => 
      a.doctorId === doctorId && 
      a.date === date &&
      a.status !== 'cancelada'
    );

    // Generar horarios disponibles (9:00 - 17:00, cada 30 minutos)
    const availableSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = doctorAppointments.some(a => a.time === time);
        
        availableSlots.push({
          time,
          available: !isBooked
        });
      }
    }

    res.json({
      success: true,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty
      },
      date,
      slots: availableSlots
    });

  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener disponibilidad'
    });
  }
};

// Funciones auxiliares

const checkAppointmentAccess = (user, appointment) => {
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.DOCTOR && appointment.doctorId === user.id) return true;
  
  const patient = patients.find(p => p.id === appointment.patientId);
  if (!patient) return false;
  
  if (user.role === ROLES.PATIENT && patient.userId === user.id) return true;
  if (user.role === ROLES.TUTOR && patient.tutorId === user.id) return true;
  
  return false;
};

const checkDoctorAvailability = (doctorId, date, time) => {
  const existingAppointment = appointments.find(a => 
    a.doctorId === doctorId && 
    a.date === date && 
    a.time === time &&
    a.status !== 'cancelada'
  );
  
  return !existingAppointment;
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getDoctorAvailability
};
