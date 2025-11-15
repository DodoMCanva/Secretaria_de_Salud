import paho.mqtt.client as mqtt
import json
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC_PUBLICAR = "consulta/paciente"

def publicar_consulta_paciente(curp, jwt_token):
    msg = {"curp": curp, "jwt": jwt_token}
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(TOPIC_PUBLICAR, json.dumps(msg))
    client.disconnect()
