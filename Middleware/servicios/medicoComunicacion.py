# medicoComunicacion.py
import paho.mqtt.client as mqtt
import json
import requests
import queue
from rutas import rutas

direcciones = rutas.rutasActuales()

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC_PUBLICAR = "consulta/medico"

# Ajusta el puerto y la ruta según tu servicio Java de médicos
GLASSFISH_URL_LOGIN = (
    f"http://localhost:{direcciones['medico']}"
    "/ServicioMedico/resources/medicos/login"
)


def login_rest(nss, pwd, jwt_token=None):
    headers = {}
    params = {"nss": nss, "pwd": pwd}
    if jwt_token:
        headers["Authorization"] = f"Bearer {jwt_token}"
    try:
        resp = requests.get(GLASSFISH_URL_LOGIN, headers=headers, params=params)
    except Exception as e:
        print("Error llamando a GlassFish (medico):", e)
        return None

    if resp.status_code == 200:
        return resp.json()
    return None


# --- Consulta por MQTT (solo publicar, si lo necesitas) ---
def publicar_consulta_medico(nss, jwt_token):
    reply_to = f"respuesta/medico/{nss}"
    msg = {
        "nss": nss,
        "jwt": jwt_token,
        "replyTo": reply_to
    }
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(TOPIC_PUBLICAR, json.dumps(msg))
    client.disconnect()


# --- Consulta por MQTT esperando respuesta ---
def consulta_medico_esperando_respuesta(nss, jwt_token, timeout=5):
    reply_to = f"respuesta/medico/{nss}"
    q = queue.Queue()

    def on_message(client, userdata, msg):
        try:
            data = json.loads(msg.payload.decode("utf-8"))
            q.put(data)
        except Exception as e:
            q.put({"error": str(e)})

    client = mqtt.Client()
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.subscribe(reply_to)
    client.loop_start()

    msg = {
        "nss": nss,
        "jwt": jwt_token,
        "replyTo": reply_to
    }
    client.publish(TOPIC_PUBLICAR, json.dumps(msg))

    try:
        resp = q.get(timeout=timeout)
    except queue.Empty:
        resp = {"error": "Timeout esperando respuesta del servicio medico"}

    client.loop_stop()
    client.disconnect()
    return resp
