import paho.mqtt.client as mqtt
import json
import requests
from rutas import rutas
direcciones = rutas.rutasActuales()

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC_PUBLICAR = "consulta/paciente"


GLASSFISH_URL_PACIENTE = f"http://localhost:{direcciones["paciente"]}/ServicioPaciente/resources/pacientes/buscar"

def consultar_paciente_rest(curp, jwt_token):
    headers = {"Authorization": f"Bearer {jwt_token}"}
    params = {"curp": curp}
    resp = requests.get(GLASSFISH_URL, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.json()
    return None

def publicar_consulta_paciente(curp, jwt_token):
    msg = {"curp": curp, "jwt": jwt_token}
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(TOPIC_PUBLICAR, json.dumps(msg))
    client.disconnect()
