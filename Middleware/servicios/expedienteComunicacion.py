import requests
from rutas import rutas
import json
import base64
import queue
import paho.mqtt.client as mqtt

direcciones = rutas.rutasActuales()
BASE_URL_EXPEDIENTE = f"http://localhost:{direcciones.get('expediente')}/ServicioExpediente/resources/expedientes"


# Configuración MQTT (Para subidas)
MQTT_BROKER = "localhost"
MQTT_PORT = 1883

TOPIC_MODIFICAR_EXPEDIENTE = "modificar/expediente"



def consulta_expediente(nss, jwt_token, timeout=10):
    url = f"{BASE_URL_EXPEDIENTE}/consultar"

    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Accept": "application/json"
    }

    params = {"nss": nss}

    resp = requests.get(url, headers=headers, params=params, timeout=timeout)

    if resp.status_code == 200:
        return resp.json()

    return {
        "error": resp.text or "Error cargando expediente",
        "status": resp.status_code
    }

def subir_archivo_expediente_mqtt(nss, archivo_storage, tipo_archivo, jwt_token, timeout=25):
    try:
        print("Conectando a MQTT en", MQTT_BROKER, MQTT_PORT)
        file_bytes = archivo_storage.read()
        base64_str = base64.b64encode(file_bytes).decode('utf-8')

        client = mqtt.Client()
        client.connect(MQTT_BROKER, MQTT_PORT, 60)  # <-- si aquí falla, verás el print previo
        print("Conexión MQTT OK")

        client.loop_start()

        payload = {
            "accion": "CARGAR_ARCHIVO",
            "nss": nss,
            "tipo": tipo_archivo,
            "nombreArchivo": archivo_storage.filename,
            "contenidoBase64": base64_str,
            "jwt": jwt_token,
        }

        client.publish(TOPIC_MODIFICAR_EXPEDIENTE, json.dumps(payload))
        client.loop_stop()
        client.disconnect()

        return {"status": "ENVIADO"}

    except Exception as e:
        print("Error middleware subiendo archivo:", e)
        return {"error": str(e)}
