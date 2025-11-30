package com.secretaria_de_salud.serviciopaciente.mqtt;


import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

@Singleton
@Startup
public class PacienteMqttBootstrap {

    private PacienteMqttConsumer consumer;

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