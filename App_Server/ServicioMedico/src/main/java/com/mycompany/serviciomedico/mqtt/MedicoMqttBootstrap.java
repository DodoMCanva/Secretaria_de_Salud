package com.mycompany.serviciomedico.mqtt;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

/**
 * Clase de inicialización del consumidor MQTT para el servicio del Médico.
 * Anotada con {@code @Singleton} y {@code @Startup}, esta clase garantiza que
 * el proceso de escucha del {@code MedicoMqttConsumer} se inicie
 * automáticamente al desplegar la aplicación EJB, manteniendo al médico
 * conectado al broker de mensajería.
 *
 * @author Secretaria de Salud
 */
@Singleton
@Startup
public class MedicoMqttBootstrap {

    private MedicoMqttConsumer consumer;

    /**
     * Método que se ejecuta inmediatamente después de que el Singleton es
     * creado por el contenedor EJB. Inicializa y arranca el cliente MQTT para
     * que comience a suscribirse y recibir mensajes del broker.
     */
    @PostConstruct
    public void init() {
        try {
            consumer = new MedicoMqttConsumer();
            consumer.start();
            System.out.println("MedicoMqttConsumer iniciado");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
