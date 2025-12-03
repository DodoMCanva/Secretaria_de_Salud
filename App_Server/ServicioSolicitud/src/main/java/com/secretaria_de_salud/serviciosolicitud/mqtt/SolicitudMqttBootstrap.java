package com.secretaria_de_salud.serviciosolicitud.mqtt;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

/**
 * Clase de inicialización (Bootstrap) del consumidor MQTT para el servicio de
 * Solicitudes de Acceso. Anotada con {@code @Singleton} y {@code @Startup},
 * esta clase asegura que el {@code SolicitudMqttConsumer} se inicialice y
 * comience a escuchar mensajes automáticamente al desplegar la aplicación EJB.
 * Su objetivo principal es recibir peticiones asíncronas para crear, consultar
 * o responder a solicitudes de acceso a expedientes.
 *
 * @autor Secretaria de Salud
 *
 */
@Singleton
@Startup
public class SolicitudMqttBootstrap {

    private SolicitudMqttConsumer consumer;

    /**
     * Método que se ejecuta inmediatamente después de que el contenedor EJB
     * construye esta instancia Singleton. Inicializa el cliente MQTT y lo
     * arranca para que se suscriba a los tópicos pertinentes.
     */
    @PostConstruct
    public void init() {
        try {
            consumer = new SolicitudMqttConsumer();
            consumer.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
