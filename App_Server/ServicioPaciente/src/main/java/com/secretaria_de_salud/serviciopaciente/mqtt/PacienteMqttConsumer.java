package com.secretaria_de_salud.serviciopaciente.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.secretaria_de_salud.Paciente;
import com.secretaria_de_salud.basedatosexpedienteclinico.PacientePersistencia;
import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;

public class PacienteMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    private static final String TOPIC = "consulta/paciente";

    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws MqttException, JsonProcessingException {

        String payload = new String(message.getPayload());
        JSONObject json = new JSONObject(payload);
        String nss = json.getString("nss");
        String jwt = json.getString("jwt");
        String replyTo = json.getString("replyTo");

        // Validar JWT (igual que en tu filtro)
        // ...
        // Buscar paciente
        Paciente paciente = new PacientePersistencia().buscarPaciente(nss);
        System.out.println("nss" + nss);
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();
        if (paciente != null) {
            root.put("status", "OK");
            root.set("paciente", mapper.valueToTree(paciente));
        } else {
            root.put("status", "NOT_FOUND");
            root.put("error", "Paciente no encontrado");
        }
        String jsonRespuesta = mapper.writeValueAsString(root);

        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.connect();
        client.publish(replyTo, new MqttMessage(jsonRespuesta.getBytes()));
        client.disconnect();

        System.out.println("Respuesta paciente publicada en: " + replyTo);
    }

    @Override
    public void connectionLost(Throwable cause
    ) {
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token
    ) {
    }
}
