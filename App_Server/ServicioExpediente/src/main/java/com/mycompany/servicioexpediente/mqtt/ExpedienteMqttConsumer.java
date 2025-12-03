/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
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
 *
 * @author aleja
 */
public class ExpedienteMqttConsumer implements MqttCallback {

    private static final String BROKER = "tcp://localhost:1883";
    private static final String TOPIC = "modificar/expediente";

    public void start() throws MqttException {
        MqttClient client = new MqttClient(BROKER, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(TOPIC);
        System.out.println("ExpedienteMqttConsumer ESCUCHANDO en: " + TOPIC);
    }

     @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String payload = new String(message.getPayload());
        
        // Log para depuración (recortado para no llenar la consola con el base64)
        String logPayload = payload.length() > 100 ? payload.substring(0, 100) + "..." : payload;
        System.out.println("Mensaje MQTT recibido en Expediente: " + logPayload);

        JSONObject json = new JSONObject(payload);
        
        // Extraer datos comunes del mensaje
        String replyTo = json.optString("replyTo");
        String accion = json.optString("accion", "CARGAR_ARCHIVO"); // Acción por defecto
        String nss = json.optString("nss");

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();
        
        // Instancia de tu persistencia
        ExpedientePersistencia persistencia = new ExpedientePersistencia();

        try {
            // CARGAR ARCHIVOS
            if ("CARGAR_ARCHIVO".equals(accion)) {
                System.out.println("Procesando carga de archivo para NSS: " + nss);
                
                String tipo = json.getString("tipo"); // "pdf" o "imagen"
                String base64Str = json.getString("contenidoBase64");

                // Decodificar Base64 a Bytes (Java nativo)
                byte[] fileBytes = Base64.getDecoder().decode(base64Str);
                
                // Convertir a Binary de MongoDB
                Binary archivoBinario = new Binary(fileBytes);

                // Determinar en qué lista guardar (pdfs o imagenes)
                String campoDestino = "imagenes"; 
                if (tipo != null && (tipo.equalsIgnoreCase("pdf") || tipo.contains("pdf"))) {
                    campoDestino = "pdfs";
                }

                // Guardar usando método existente
                persistencia.agregarArchivo(nss, campoDestino, archivoBinario);

                // Respuesta exitosa
                root.put("status", "OK");
                root.put("mensaje", "Archivo guardado exitosamente en la lista: " + campoDestino);
                
            } 

            else {
                System.out.println("Acción no reconocida: " + accion);
                root.put("status", "ERROR");
                root.put("error", "Acción desconocida: " + accion);
            }

        } catch (Exception e) {
            e.printStackTrace();
            root.put("status", "ERROR");
            root.put("error", "Error interno en Java: " + e.getMessage());
        } finally {
            // Siempre cerrar la conexión a Mongo
            persistencia.close();
        }

        // 6. Enviar respuesta al Middleware (si se solicitó replyTo)
        if (replyTo != null && !replyTo.isEmpty()) {
            enviarRespuesta(replyTo, mapper.writeValueAsString(root));
        }
    }

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
    

        // Validar JWT (igual que en tu filtro)
        // ...
        // Buscar paciente
        /*Paciente paciente = new PacientePersistencia().buscarPaciente(nss);
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
        
        System.out.println("Respuesta paciente publicada en: " + replyTo);*/
    }

    @Override
    public void connectionLost(Throwable cause) {
        System.out.println("Conexión MQTT perdida: " + cause.getMessage());
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken token
    ) {
    }
}
