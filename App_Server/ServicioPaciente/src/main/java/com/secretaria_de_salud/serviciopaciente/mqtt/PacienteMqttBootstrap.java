package com.secretaria_de_salud.serviciopaciente.mqtt;


import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

/**
 * Clase de inicialización del consumidor MQTT para el servicio del Paciente.
 * Anotada con {@code @Singleton} y {@code @Startup}, esta clase garantiza que
 * el proceso de escucha del {@code PacienteMqttConsumer} se inicie
 * automáticamente al desplegar la aplicación EJB. Esto permite que el servicio
 * reciba notificaciones asíncronas (como solicitudes de acceso de médicos)
 * desde el broker MQTT.
 *
 * @version Secretaria de Salud
 */
@Singleton
@Startup
public class PacienteMqttBootstrap {

    private PacienteMqttConsumer consumer;

     /**
     * Método que se ejecuta inmediatamente después de que el Singleton es creado 
     * por el contenedor EJB.
     * Inicializa y arranca el cliente MQTT para que comience a suscribirse 
     * y recibir mensajes (por ejemplo, para notificar sobre solicitudes).
     */
    @PostConstruct
    public void init() {
        try {
            consumer = new PacienteMqttConsumer();
            consumer.start();
            System.out.println("PacienteMqttConsumer iniciado");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}