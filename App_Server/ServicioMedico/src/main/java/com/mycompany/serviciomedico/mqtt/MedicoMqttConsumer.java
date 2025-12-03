package com.mycompany.serviciomedico.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.secretaria_de_salud.Medico;
import com.secretaria_de_salud.basedatosexpedienteclinico.MedicoPersistencia;
import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;

/**
 * Consumidor MQTT para el servicio del Médico. Implementa la interfaz
 * {@code MqttCallback} para gestionar la conexión y la recepción de mensajes.
 * Escucha peticiones en el tópico y responde con los datos del médico
 * solicitados por el NSS.
 *
 * @author Secretaria de Salud
 */
public class MedicoMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    private static final String TOPIC = "consulta/medico";

    /**
     * Inicia la conexión con el broker MQTT y se suscribe al tópico de
     * consulta.
     *
     * @throws MqttException Si ocurre un error durante la conexión o
     * suscripción.
     */
    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
        System.out.println("Suscrito a tópico médico: " + TOPIC);
    }

    /**
     * Método invocado cuando se recibe un mensaje MQTT. Procesa la solicitud
     * buscando el NSS del médico en la base de datos y publica la respuesta
     * (datos del médico o error NOT_FOUND) en el tópico especificado en el
     * campo {@code replyTo} del payload.
     *
     * @param topic El tópico donde se recibió el mensaje.
     * @param message El mensaje MQTT recibido.
     * @throws MqttException Si ocurre un error al publicar la respuesta.
     * @throws JsonProcessingException Si falla la conversión del POJO (Plain
     * Old Java Object) a JSON.
     */
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

    /**
     * Método invocado cuando la conexión con el broker se pierde. Se puede
     * utilizar para implementar lógica de reconexión.
     *
     * @param cause La causa de la pérdida de conexión.
     */
    @Override
    public void connectionLost(Throwable cause) {
        // podrías loguear el error
    }

    /**
     * Método invocado cuando la entrega de un mensaje publicado se ha
     * completado.
     *
     * @param token El token de entrega.
     */
    @Override
    public void deliveryComplete(IMqttDeliveryToken token) {
        // opcional
    }
}
