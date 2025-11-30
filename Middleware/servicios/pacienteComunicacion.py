#PacienteComunicacion
import paho.mqtt.client as mqtt
import json
import requests
from rutas import rutas
direcciones = rutas.rutasActuales()

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC_PUBLICAR = "consulta/paciente"


GLASSFISH_URL_LOGIN = f"http://localhost:{direcciones["paciente"]}/ServicioPaciente/resources/pacientes/login"

def login_rest(nss, pwd, jwt_token=None):
    headers = {}
    params = {"nss": nss, "pwd": pwd} 
    if jwt_token:
        headers["Authorization"] = f"Bearer {jwt_token}"

    print("URL:", GLASSFISH_URL_LOGIN)
    print("params:", params)
    print("headers:", headers)

    try:
        resp = requests.get(GLASSFISH_URL_LOGIN, headers=headers, params=params)
    except Exception as e:
        print("Error llamando a GlassFish:", e)
        return None

    print("status:", resp.status_code, "body:", resp.text)

    if resp.status_code == 200:
        return resp.json()
    return None


#Consulta por mqtt
def publicar_consulta_paciente(curp, jwt_token):
    msg = {"curp": curp, "jwt": jwt_token}
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(TOPIC_PUBLICAR, json.dumps(msg))
    client.disconnect()
