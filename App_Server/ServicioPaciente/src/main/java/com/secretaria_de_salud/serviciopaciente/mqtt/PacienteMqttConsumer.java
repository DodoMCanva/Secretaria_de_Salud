package com.secretaria_de_salud.serviciopaciente.mqtt;

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
    public void messageArrived(String topic, MqttMessage message) {
        String payload = new String(message.getPayload());
        JSONObject json = new JSONObject(payload);
        String _id = json.getString("_id");
        String jwt = json.getString("jwt");
        // Aquí verifica tu JWT, busca el paciente, responde (si quieres: publica en otro tópico, actualiza base, etc.)
        System.out.println("Llego consulta por MQTT para curp: " + _id);
    }

    @Override
    public void connectionLost(Throwable cause) {}
    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {}
}
