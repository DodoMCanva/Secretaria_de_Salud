/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.serviciomedico.mqtt;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.secretaria_de_salud.Medico;
import com.secretaria_de_salud.basedatosexpedienteclinico.MedicoPersistencia;
import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;

/**
 *
 * @author cesar
 */


public class MedicoMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    private static final String TOPIC = "consulta/medico";

    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
        System.out.println("Suscrito a tópico médico: " + TOPIC);
    }

    @Override
    public void messageArrived(String topic, MqttMessage message)
            throws MqttException, JsonProcessingException {

        String payload = new String(message.getPayload());
        JSONObject json = new JSONObject(payload);
        String nss = json.getString("nss");
        String jwt = json.getString("jwt");
        String replyTo = json.getString("replyTo");

        // Aquí iría la validación del JWT (igual que en tu filtro)

        // Buscar médico por NSS
        Medico medico = new MedicoPersistencia().buscarMedico(nss);
        System.out.println("nss medico: " + nss);

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();
        if (medico != null) {
            root.put("status", "OK");
            root.set("medico", mapper.valueToTree(medico));  // valueToTree para convertir POJO a JSON[web:133][web:131]
        } else {
            root.put("status", "NOT_FOUND");
            root.put("error", "Medico no encontrado");
        }
        String jsonRespuesta = mapper.writeValueAsString(root);

        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.connect();
        client.publish(replyTo, new MqttMessage(jsonRespuesta.getBytes()));
        client.disconnect();

        System.out.println("Respuesta medico publicada en: " + replyTo);
    }

    @Override
    public void connectionLost(Throwable cause) {
        // podrías loguear el error
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // opcional
    }
}