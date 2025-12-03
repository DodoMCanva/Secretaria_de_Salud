package com.mycompany.servicioexpediente.mqtt;

/**
 *
 * @author aleja
 */
import jakarta.annotation.PostConstruct;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

/**
 * Clase de inicialización del consumidor MQTT para la gestión de expedientes.
 *
 * Al ser anotada con {@code @Singleton} y {@code @Startup}, esta clase se
 * inicializa automáticamente al desplegar la aplicación EJB (Enterprise Java
 * Bean), asegurando que el cliente MQTT comience a escuchar mensajes
 * inmediatamente.
 *
 * @author Secretaría de Salud
 */
@Singleton
@Startup
public class ExpedienteMqttBootstrap {

    private ExpedienteMqttConsumer consumer;

    /**
     * Método que se ejecuta inmediatamente después de que la instancia
     * Singleton de esta clase es construida. Se encarga de inicializar y
     * arrancar el proceso de escucha del consumidor MQTT.
     *
     * @throws Exception Si ocurre un error al inicializar el consumidor MQTT.
     */
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
