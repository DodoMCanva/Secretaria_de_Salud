const { documents, patients } = require('../data/mockData');
const { ROLES } = require('../config/roles.config');
const { publishDocumentUploaded, publishDocumentDeleted } = require('../services/rabbitmq.service');
const path = require('path');

/**
 * Obtener documentos de un paciente
 */
const getPatientDocuments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type, category } = req.query;
    const user = req.user;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Verificar permisos
    const hasAccess = checkPatientAccess(user, patient);
    if (!hasAccess) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    let patientDocuments = documents.filter(d => d.patientId === patientId);

    // Filtros
    if (type) {
      patientDocuments = patientDocuments.filter(d => d.type === type);
    }

    if (category) {
      patientDocuments = patientDocuments.filter(d => d.category === category);
    }

    // Ordenar por fecha (más recientes primero)
    patientDocuments.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: patientDocuments,
      total: patientDocuments.length
    });

  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener documentos'
    });
  }
};

/**
 * Obtener un documento específico
 */
const getDocumentById = async (req, res) => {
  try {
    const { documentId } = req.params;
    const user = req.user;

    const document = documents.find(d => d.id === documentId);
    if (!document) {
      return res.status(404).json({ 
        error: 'Documento no encontrado'
      });
    }

    const patient = patients.find(p => p.id === document.patientId);
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

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Error al obtener documento:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener documento'
    });
  }
};

/**
 * Subir nuevo documento
 */
const uploadDocument = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type, name, description, category, tags } = req.body;
    const user = req.user;

    // Solo doctores y admin pueden subir documentos
    if (user.role !== ROLES.DOCTOR && user.role !== ROLES.ADMIN) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'Solo el personal médico puede subir documentos'
      });
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return res.status(404).json({ 
        error: 'Paciente no encontrado'
      });
    }

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({ 
        error: 'Archivo requerido',
        message: 'Debe subir un archivo'
      });
    }

    const newDocument = {
      id: require('uuid').v4(),
      patientId,
      type: type || 'general',
      name: name || req.file.originalname,
      description: description || '',
      date: new Date().toISOString().split('T')[0],
      uploadedBy: user.id,
      uploadedByName: user.name,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: `/uploads/documents/${req.file.filename}`,
      category: category || 'General',
      tags: tags ? tags.split(',') : [],
      createdAt: new Date()
    };

    documents.push(newDocument);

    // Publicar evento
    await publishDocumentUploaded(newDocument);

    res.status(201).json({
      success: true,
      message: 'Documento subido exitosamente',
      data: newDocument
    });

  } catch (error) {
    console.error('Error al subir documento:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al subir documento'
    });
  }
};

/**
 * Actualizar metadatos de documento
 */
const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const updates = req.body;
    const user = req.user;

    const document = documents.find(d => d.id === documentId);
    if (!document) {
      return res.status(404).json({ 
        error: 'Documento no encontrado'
      });
    }

    // Solo quien lo subió, admin o el doctor actual pueden actualizar
    if (user.role !== ROLES.ADMIN && 
        user.role !== ROLES.DOCTOR && 
        document.uploadedBy !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    // Actualizar campos permitidos
    const allowedUpdates = ['name', 'description', 'category', 'tags'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        document[field] = updates[field];
      }
    });

    res.json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: document
    });

  } catch (error) {
    console.error('Error al actualizar documento:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al actualizar documento'
    });
  }
};

/**
 * Eliminar documento
 */
const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const user = req.user;

    const documentIndex = documents.findIndex(d => d.id === documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ 
        error: 'Documento no encontrado'
      });
    }

    const document = documents[documentIndex];

    // Solo admin o quien lo subió pueden eliminar
    if (user.role !== ROLES.ADMIN && document.uploadedBy !== user.id) {
      return res.status(403).json({ 
        error: 'Acceso denegado'
      });
    }

    // Eliminar del array
    documents.splice(documentIndex, 1);

    // Publicar evento
    await publishDocumentDeleted(documentId);

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al eliminar documento'
    });
  }
};

/**
 * Obtener categorías de documentos
 */
const getDocumentCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'laboratorio', name: 'Laboratorio', icon: 'flask' },
      { id: 'imagenologia', name: 'Imagenología', icon: 'scan' },
      { id: 'recetas', name: 'Recetas', icon: 'pill' },
      { id: 'vacunas', name: 'Vacunación', icon: 'syringe' },
      { id: 'general', name: 'General', icon: 'file' }
    ];

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      message: 'Error al obtener categorías'
    });
  }
};

// Función auxiliar
const checkPatientAccess = (user, patient) => {
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.DOCTOR) return true;
  if (user.role === ROLES.PATIENT && patient.userId === user.id) return true;
  if (user.role === ROLES.TUTOR && patient.tutorId === user.id) return true;
  return false;
};

module.exports = {
  getPatientDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentCategories
};
