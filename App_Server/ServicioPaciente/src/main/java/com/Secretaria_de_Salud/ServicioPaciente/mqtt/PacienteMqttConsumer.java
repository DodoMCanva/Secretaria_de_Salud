/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.Secretaria_de_Salud.ServicioPaciente.mqtt;

import com.Secretaria_de_Salud.ServicioPaciente.service.PacienteService;
import com.secretaria_de_salud.Paciente;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONObject;



public class PacienteMqttConsumer implements MqttCallback {

    private final String broker = "tcp://localhost:1883";
    private final String topic = "consulta/paciente";
    private final PacienteService service = new PacienteService();

    public void start() throws MqttException {
        MqttClient client = new MqttClient(broker, MqttClient.generateClientId());
        client.setCallback(this);
        client.connect();
        client.subscribe(topic);
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        String payload = new String(message.getPayload());
        JSONObject obj = new JSONObject(payload);
        String jwt = obj.getString("jwt");
        //if (JwtUtil.isValid(jwt)) {
            String curp = obj.getString("curp");
            Paciente paciente = service.buscarPorCurp(curp);
            // Aquí puedes publicar respuesta MQTT o procesar como necesites
            System.out.println("Paciente encontrado: " + paciente);
        //} else {
        //    System.out.println("JWT inválido en mensaje MQTT");
        //}
    }


    @Override
    public void connectionLost(Throwable thrwbl) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken imdt) {
        System.out.println("Si");
    }
}
