package com.secretaria_de_salud.serviciosolicitud.mqtt;


import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

@Singleton
@Startup
public class SolicitudMqttBootstrap {

    private SolicitudMqttConsumer consumer;

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