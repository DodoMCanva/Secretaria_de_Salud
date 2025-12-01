
package com.mycompany.servicioexpediente.mqtt;

/**
 *
 * @author aleja
 */
import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

@Singleton
@Startup
public class ExpedienteMqttBootstrap {

    private ExpedienteMqttConsumer consumer;

    @PostConstruct
    public void init() {
        try {
            consumer = new ExpedienteMqttConsumer();
            consumer.start();
            System.out.println("PacienteMqttConsumer iniciado");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
