# servicios/solicitudComunicacion.py
import requests
from rutas import rutas
import json
import paho.mqtt.client as mqtt
import queue

direcciones = rutas.rutasActuales()
MQTT_BROKER = "localhost"


# ServicioSolicitud corre en otro puerto; ajústalo en rutasActuales()
GLASSFISH_URL_SOLICITUD_BASE = (
    f"http://localhost:{direcciones['solicitud']}/ServicioSolicitud/resources"
)

def crear_solicitud(nss_paciente, nss_medico, motivo, jwt_token):
    # llama a /solicitudes/crear con QUERY PARAMS
    url = f"{GLASSFISH_URL_SOLICITUD_BASE}/solicitudes/crear"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json",
    }
    params = {
        "nssPaciente": nss_paciente,
        "nssMedico": nss_medico,
        "motivo": motivo,
    }


    # cuerpo vacío; todo va en query
    resp = requests.post(url, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.text  # Java devuelve "Se armo"
    return {"error": resp.text or "Error creando solicitud", "status": resp.status_code}


# Lógica para definir el puerto dinámicamente
# Si existe una configuración específica "solicitud_mqtt" (Caso Fer), úsala.
# Si no, usa la general "mqtt" (Caso Pau, Kim, etc).
if "solicitud_mqtt" in direcciones:
    MQTT_PORT = int(direcciones["solicitud_mqtt"])
elif "mqtt" in direcciones:
    MQTT_PORT = int(direcciones["mqtt"])
else:
    MQTT_PORT = 1883 # Default de seguridad

TOPIC_PUBLICAR_SOLICITUDES = "consulta/solicitudes"

def listar_solicitudes_pendientes(nss_paciente, jwt_token):
    """
    Devuelve las solicitudes PENDIENTES para ese paciente.
    """
    url = f"{GLASSFISH_URL_SOLICITUD_BASE}/solicitudes/paciente/{nss_paciente}"
    headers = {"Authorization": f"Bearer {jwt_token}"}
    resp = requests.get(url, headers=headers)
    if resp.status_code == 200:
        return resp.json()
    return {"error": resp.text or "Error listando solicitudes", "status": resp.status_code}

def responder_solicitud(nssP, nssM, nuevo_estado, jwt_token):
    url = f"{GLASSFISH_URL_SOLICITUD_BASE}/solicitudes/responder"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json",
    }
    params = {
        "nssP": nssP,
        "nssM": nssM,
        "estado": nuevo_estado
    }

    resp = requests.put(url, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.json()
    return {"error": resp.text or "Error respondiendo solicitud", "status": resp.status_code}

def consultar_solicitudes_mqtt(nss_paciente, jwt_token, timeout=10):

    """
    Consulta las solicitudes de un paciente vía MQTT esperando respuesta síncrona.
    """
    # 1. Crear tópico único de respuesta
    reply_to = f"respuesta/solicitudes/{nss_paciente}"
    q = queue.Queue()

    # 2. Callback interno
    def on_message(client, userdata, msg):
        try:
            data = json.loads(msg.payload.decode("utf-8"))
            q.put(data)
        except Exception as e:
            q.put({"error": str(e)})

    # 3. Configurar cliente MQTT temporal
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.subscribe(reply_to)
    client.loop_start()

    # 4. Publicar mensaje
    msg = {
        "nss": nss_paciente,
        "jwt": jwt_token,
        "replyTo": reply_to
    }
    client.publish(TOPIC_PUBLICAR_SOLICITUDES, json.dumps(msg))

    # 5. Esperar respuesta
    try:
        resp = q.get(timeout=timeout)
    except queue.Empty:
        resp = {"error": "Timeout esperando respuesta del servicio solicitudes"}

    client.loop_stop()
    client.disconnect()
    
    return resp

def consultar_solicitudes(nss_paciente, jwt_token):
    url = f"{GLASSFISH_URL_SOLICITUD_BASE}/solicitudes/paciente"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Accept": "application/json",
    }
    params = {"nss": nss_paciente}
    r = requests.get(url, params=params, headers=headers, timeout=5)
    r.raise_for_status()
    return r.json()  

    