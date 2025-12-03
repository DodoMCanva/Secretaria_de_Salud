package com.secretaria_de_salud.serviciopaciente.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.secretaria_de_salud.Paciente;
import com.secretaria_de_salud.basedatosexpedienteclinico.PacientePersistencia;
import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;

/**
 * Consumidor MQTT encargado de escuchar los mensajes entrantes en el tópico de
 * consulta para el paciente. Implementa la interfaz {@code MqttCallback} para
 * recibir mensajes asíncronos, buscar la información del {@code Paciente}
 * solicitado en la base de datos y publicar una respuesta con los datos
 * encontrados en un tópico de retorno.
 *
 * @version Secretaria de Salud
 */
public class PacienteMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    private static final String TOPIC = "consulta/paciente";

    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
    }

    /**
     * Método invocado cuando llega un nuevo mensaje MQTT al tópico suscrito.
     * Procesa la solicitud buscando el NSS del paciente en la base de datos y
     * publica la respuesta (datos del paciente o error NOT_FOUND) en el tópico
     * especificado en el campo {@code replyTo} del payload.
     *
     * @param topic El tópico donde se recibió el mensaje.
     * @param message El mensaje MQTT que contiene la carga útil (payload).
     * @throws MqttException Si ocurre un error al publicar la respuesta.
     * @throws JsonProcessingException Si falla la conversión del POJO a JSON.
     */
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

    /**
     * Maneja la pérdida de conexión con el broker MQTT.
     * @param cause La causa de la desconexión.
     */
    @Override
    public void connectionLost(Throwable cause
    ) {
    }

    /**
     * Método invocado cuando la entrega de un mensaje publicado se ha completado.
     * @param token El token de entrega.
     */
    @Override
    public void deliveryComplete(IMqttDeliveryToken token
    ) {
    }
}
