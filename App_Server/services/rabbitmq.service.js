const amqp = require('amqplib');

let connection = null;
let channel = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'medical_exchange';

// Definición de colas
const QUEUES = {
  APPOINTMENTS: process.env.RABBITMQ_QUEUE_APPOINTMENTS || 'appointments_queue',
  DOCUMENTS: process.env.RABBITMQ_QUEUE_DOCUMENTS || 'documents_queue',
  NOTIFICATIONS: process.env.RABBITMQ_QUEUE_NOTIFICATIONS || 'notifications_queue'
};

/**
 * Inicializa la conexión con RabbitMQ
 */
const initializeRabbitMQ = async () => {
  try {
    // Conectar a RabbitMQ
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Crear exchange tipo 'topic'
    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

    // Crear y enlazar colas
    for (const [key, queueName] of Object.entries(QUEUES)) {
      await channel.assertQueue(queueName, { durable: true });
      
      // Routing keys según el tipo de cola
      let routingKey = '';
      switch (key) {
        case 'APPOINTMENTS':
          routingKey = 'appointment.*';
          break;
        case 'DOCUMENTS':
          routingKey = 'document.*';
          break;
        case 'NOTIFICATIONS':
          routingKey = 'notification.*';
          break;
      }
      
      await channel.bindQueue(queueName, EXCHANGE, routingKey);
    }

    // Iniciar consumidores
    startConsumers();

    console.log('RabbitMQ inicializado correctamente');
    
    // Manejar cierre de conexión
    connection.on('close', () => {
      console.log('Conexión con RabbitMQ cerrada');
    });

    connection.on('error', (err) => {
      console.error('Error en conexión RabbitMQ:', err);
    });

  } catch (error) {
    console.error('Error al conectar con RabbitMQ:', error.message);
    console.log('⚠ Continuando sin RabbitMQ (modo desarrollo)');
    // En desarrollo, no es crítico que falle RabbitMQ
  }
};

/**
 * Publica un mensaje en RabbitMQ
 * @param {String} routingKey - Clave de enrutamiento (ej: 'appointment.created')
 * @param {Object} message - Mensaje a enviar
 */
const publishMessage = async (routingKey, message) => {
  try {
    if (!channel) {
      console.warn('Canal RabbitMQ no disponible, mensaje no enviado');
      return false;
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.publish(EXCHANGE, routingKey, messageBuffer, {
      persistent: true,
      timestamp: Date.now(),
      contentType: 'application/json'
    });

    console.log(`Mensaje publicado: ${routingKey}`);
    return true;
  } catch (error) {
    console.error('Error al publicar mensaje:', error);
    return false;
  }
};

/**
 * Inicia los consumidores para cada cola
 */
const startConsumers = () => {
  // Consumidor de citas
  consumeQueue(QUEUES.APPOINTMENTS, async (message) => {
    console.log('Procesando mensaje de cita:', message);
    
    // Aquí procesarías la lógica de negocio
    // Por ejemplo: enviar notificaciones, actualizar calendarios, etc.
    
    switch (message.action) {
      case 'created':
        console.log(`Nueva cita creada: ${message.data.id}`);
        // Enviar notificación
        await publishMessage('notification.appointment', {
          type: 'appointment_created',
          appointmentId: message.data.id,
          patientId: message.data.patientId,
          message: `Cita programada para ${message.data.date} a las ${message.data.time}`
        });
        break;
      case 'updated':
        console.log(`Cita actualizada: ${message.data.id}`);
        break;
      case 'cancelled':
        console.log(`Cita cancelada: ${message.data.id}`);
        break;
    }
  });

  // Consumidor de documentos
  consumeQueue(QUEUES.DOCUMENTS, async (message) => {
    console.log('Procesando mensaje de documento:', message);
    
    switch (message.action) {
      case 'uploaded':
        console.log(`Documento subido: ${message.data.id}`);
        // Aquí podrías procesar el documento, generar thumbnails, etc.
        break;
      case 'deleted':
        console.log(`Documento eliminado: ${message.data.id}`);
        break;
    }
  });

  // Consumidor de notificaciones
  consumeQueue(QUEUES.NOTIFICATIONS, async (message) => {
    console.log('Procesando notificación:', message);
    
    // Aquí enviarías emails, SMS, push notifications, etc.
    switch (message.type) {
      case 'appointment_created':
        console.log(`Enviando notificación de cita: ${message.message}`);
        break;
      case 'document_uploaded':
        console.log(`Enviando notificación de documento: ${message.message}`);
        break;
      case 'access_granted':
        console.log(`Enviando notificación de acceso: ${message.message}`);
        break;
    }
  });
};

/**
 * Consume mensajes de una cola
 * @param {String} queueName - Nombre de la cola
 * @param {Function} callback - Función a ejecutar con cada mensaje
 */
const consumeQueue = (queueName, callback) => {
  if (!channel) return;

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString());
        await callback(content);
        channel.ack(msg);
      } catch (error) {
        console.error(`Error procesando mensaje de ${queueName}:`, error);
        // Rechazar mensaje y no reencolar (evitar loops infinitos)
        channel.nack(msg, false, false);
      }
    }
  });

  console.log(`Consumidor iniciado para cola: ${queueName}`);
};

/**
 * Cierra la conexión con RabbitMQ
 */
const closeConnection = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('Conexión RabbitMQ cerrada correctamente');
  } catch (error) {
    console.error('Error al cerrar conexión RabbitMQ:', error);
  }
};

// Eventos de mensajería específicos del dominio

/**
 * Publica evento de cita creada
 */
const publishAppointmentCreated = async (appointment) => {
  return publishMessage('appointment.created', {
    action: 'created',
    data: appointment,
    timestamp: new Date().toISOString()
  });
};

/**
 * Publica evento de cita actualizada
 */
const publishAppointmentUpdated = async (appointment) => {
  return publishMessage('appointment.updated', {
    action: 'updated',
    data: appointment,
    timestamp: new Date().toISOString()
  });
};

/**
 * Publica evento de cita cancelada
 */
const publishAppointmentCancelled = async (appointmentId) => {
  return publishMessage('appointment.cancelled', {
    action: 'cancelled',
    data: { id: appointmentId },
    timestamp: new Date().toISOString()
  });
};

/**
 * Publica evento de documento subido
 */
const publishDocumentUploaded = async (document) => {
  return publishMessage('document.uploaded', {
    action: 'uploaded',
    data: document,
    timestamp: new Date().toISOString()
  });
};

/**
 * Publica evento de documento eliminado
 */
const publishDocumentDeleted = async (documentId) => {
  return publishMessage('document.deleted', {
    action: 'deleted',
    data: { id: documentId },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  initializeRabbitMQ,
  publishMessage,
  closeConnection,
  publishAppointmentCreated,
  publishAppointmentUpdated,
  publishAppointmentCancelled,
  publishDocumentUploaded,
  publishDocumentDeleted,
  QUEUES
};
