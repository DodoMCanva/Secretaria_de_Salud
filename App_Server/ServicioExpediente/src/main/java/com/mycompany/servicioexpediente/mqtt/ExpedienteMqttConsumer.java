
package com.mycompany.servicioexpediente.mqtt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.secretaria_de_salud.basedatosexpedienteclinico.ExpedientePersistencia;
import java.util.Base64;
import org.bson.types.Binary;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONObject;

/**
 * Consumidor MQTT encargado de escuchar los mensajes entrantes en el tópico
 * "modificar/expediente". Su función principal es recibir peticiones de carga
 * de archivos (PDFs, Imágenes) codificados en Base64, decodificarlos y
 * persistirlos en la base de datos MongoDB del paciente correspondiente.
 *
 * @author Secretaria de Salud
 */
public class ExpedienteMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    private static final String TOPIC = "modificar/expediente";

    /**
     * Inicia el cliente MQTT y se suscribe al tópico de modificación de
     * expedientes.
     *
     * @throws MqttException Si ocurre un error durante la conexión o
     * suscripción al broker.
     */
    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
        System.out.println("ExpedienteMqttConsumer ESCUCHANDO en: " + TOPIC);
    }

    /**
     * Método invocado cuando llega un nuevo mensaje MQTT al tópico suscrito.
     * Procesa la carga de archivos: decodifica el Base64, convierte a
     * {@code Binary} y llama al método de persistencia para guardar en MongoDB.
     *
     * @param topic El tópico donde se recibió el mensaje.
     * @param message El mensaje MQTT que contiene la carga útil (payload).
     * @throws Exception Si ocurre un error de procesamiento del JSON o
     * decodificación del archivo.
     */
    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String payload = new String(message.getPayload());

        String logPayload = payload.length() > 100 ? payload.substring(0, 100) + "..." : payload;
        System.out.println("Mensaje MQTT recibido en Expediente: " + logPayload);

        JSONObject json = new JSONObject(payload);

        String accion = json.optString("accion", "CARGAR_ARCHIVO");
        String nss = json.optString("nss");

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();

        ExpedientePersistencia persistencia = new ExpedientePersistencia();

        try {
            if ("CARGAR_ARCHIVO".equals(accion)) {
                System.out.println("Procesando carga de archivo para NSS: " + nss);

                String tipo = json.getString("tipo");          // "pdf" o "imagen"
                String base64Str = json.getString("contenidoBase64");

                byte[] fileBytes = Base64.getDecoder().decode(base64Str);
                Binary archivoBinario = new Binary(fileBytes);

                String campoDestino = "imagenes";
                if (tipo != null && (tipo.equalsIgnoreCase("pdf") || tipo.contains("pdf"))) {
                    campoDestino = "pdfs";
                }

                persistencia.agregarArchivo(nss, campoDestino, archivoBinario);

                root.put("status", "OK");
                root.put("mensaje", "Archivo guardado exitosamente en la lista: " + campoDestino);

            } else {
                System.out.println("Acción no reconocida: " + accion);
                root.put("status", "ERROR");
                root.put("error", "Acción desconocida: " + accion);
            }

        } catch (Exception e) {
            e.printStackTrace();
            root.put("status", "ERROR");
            root.put("error", "Error interno en Java: " + e.getMessage());
        } finally {
            persistencia.close();
        }
    }

    /**
     * Envía una respuesta de vuelta al broker MQTT. Este método auxiliar se
     * utilizaría para confirmar el estado de la operación (éxito o fracaso) al
     * cliente que envió el mensaje original.
     *
     * @param topic El tópico de respuesta.
     * @param mensaje El cuerpo del mensaje (usualmente el JSON de estado).
     */
    private void enviarRespuesta(String topic, String mensaje) {
        try {
            MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
            client.connect();
            client.publish(topic, new MqttMessage(mensaje.getBytes()));
            client.disconnect();
            System.out.println("Respuesta enviada a: " + topic);
        } catch (MqttException e) {
            System.err.println("Error respondiendo MQTT: " + e.getMessage());
        }

    }

    /**
     * Maneja la pérdida de conexión con el broker MQTT.
     *
     * @param cause La causa de la desconexión.
     */
    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Conexión MQTT perdida: " + cause.getMessage());
    }

    /**
     * Método invocado cuando se completa la entrega de un mensaje publicado.
     *
     * @param token El token de entrega.
     */
    @Override
    public void deliveryComplete(IMqttDeliveryToken token
    ) {
    }
}
