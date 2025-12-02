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

    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Conexión perdida: " + cause.getMessage());
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
    }
}
