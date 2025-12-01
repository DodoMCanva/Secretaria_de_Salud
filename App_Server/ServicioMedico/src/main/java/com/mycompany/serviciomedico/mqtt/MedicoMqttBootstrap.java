package com.mycompany.serviciomedico.mqtt;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

/**
 *
 * @author 
 */
@Singleton
@Startup
public class MedicoMqttBootstrap {

    private MedicoMqttConsumer consumer;

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