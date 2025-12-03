package com.secretaria_de_salud.serviciosolicitud.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;

import java.util.List;

// IMPORTS CORRECTOS BASADOS EN TU ARCHIVO
import com.secretaria_de_salud.SolicitudAcceso;
import com.secretaria_de_salud.basedatosexpedienteclinico.SolicitudPersistencia;

/**
 * Consumidor MQTT encargado de escuchar y procesar peticiones de consulta y
 * gestión de solicitudes de acceso a expedientes clínicos. Este consumidor
 * responde a la solicitud del Middleware buscando las solicitudes de acceso
 * pendientes asociadas a un paciente específico.
 *
 * @autor Secretaria de Salud
 */
public class SolicitudMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    // Tópico para escuchar peticiones de consulta
    private static final String TOPIC = "consulta/solicitudes";

    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
        System.out.println("SolicitudMqttConsumer iniciado. Escuchando en: " + TOPIC);
    }

    /**
     * Método invocado cuando se recibe un mensaje MQTT. Procesa una petición de
     * consulta buscando las solicitudes pendientes para un NSS de paciente dado
     * y publica el resultado (lista de solicitudes o error) en el tópico de
     * respuesta especificado.
     *
     * @param topic El tópico donde se recibió el mensaje.
     * @param message El mensaje MQTT que contiene la carga útil (payload).
     * @throws MqttException Si ocurre un error al publicar la respuesta.
     * @throws JsonProcessingException Si falla la conversión de los objetos
     * Java a JSON.
     */
    @Override
    public void messageArrived(String topic, MqttMessage message) throws MqttException, JsonProcessingException {
        String payload = new String(message.getPayload());
        System.out.println("Mensaje recibido: " + payload);

        JSONObject json = new JSONObject(payload);

        // 1. Obtener datos del mensaje (enviados desde Python)
        String nss = json.optString("nss");
        String replyTo = json.optString("replyTo");

        if (replyTo.isEmpty()) {
            System.err.println("No se recibió replyTo, no se puede responder.");
            return;
        }

        // 2. Instanciar persistencia y buscar
        SolicitudPersistencia persistencia = new SolicitudPersistencia();

        // Usamos TU método específico: listarPendientesPorPaciente
        List<SolicitudAcceso> solicitudes = persistencia.listarPendientesPorPaciente(nss);

        // 3. Preparar JSON de respuesta
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();

        if (solicitudes != null) {
            root.put("status", "OK");
            // Jackson convertirá la lista de objetos SolicitudAcceso a un Array JSON
            root.set("solicitudes", mapper.valueToTree(solicitudes));
        } else {
            root.put("status", "ERROR");
            root.put("error", "Error consultando base de datos");
        }

        String jsonRespuesta = mapper.writeValueAsString(root);

        // 4. Responder al tópico temporal
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.connect();
        client.publish(replyTo, new MqttMessage(jsonRespuesta.getBytes()));
        client.disconnect();

        System.out.println("Respuesta enviada a: " + replyTo);
    }

    /**
     * Maneja la pérdida de conexión con el broker MQTT.
     *
     * @param cause La causa de la desconexión.
     */
    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Conexión perdida: " + cause.getMessage());
    }

    /**
     * Método invocado cuando la entrega de un mensaje publicado se ha
     * completado.
     *
     * @param token El token de entrega.
     */
    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
    }
}
