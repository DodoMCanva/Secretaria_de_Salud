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

# Lógica para elegir el puerto correcto según quien corra el sistema
if "expediente_mqtt" in direcciones:
    MQTT_PORT = int(direcciones["expediente_mqtt"])
elif "mqtt" in direcciones:
    MQTT_PORT = int(direcciones["mqtt"])
else:
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



#  NUEVA FUNCIÓN PARA SUBIR ARCHIVO (MQTT)

def subir_archivo_expediente_mqtt(nss, archivo_storage, tipo_archivo, jwt_token, timeout=25):
    """
    Toma el archivo, lo convierte a Base64 y lo envía a Java por MQTT.
    """
    try:
        # Convertir archivo a Base64 (Texto) para poder enviarlo en JSON
        file_bytes = archivo_storage.read()
        base64_str = base64.b64encode(file_bytes).decode('utf-8')
        
        # Configurar tópico de respuesta único para este usuario
        reply_to = f"respuesta/expediente/carga/{nss}"
        q = queue.Queue()

        # Callback interno para recibir la confirmación de Java
        def on_message(client, userdata, msg):
            try:
                data = json.loads(msg.payload.decode("utf-8"))
                q.put(data)
            except Exception as e:
                q.put({"error": str(e)})

        # C. Conexión MQTT temporal
        client = mqtt.Client()
        client.on_message = on_message
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.subscribe(reply_to)
        client.loop_start()

        # Construir Payload (JSON)
        # La clave "accion": "CARGAR_ARCHIVO" es vital para que Java sepa qué hacer****************************
        payload = {
            "accion": "CARGAR_ARCHIVO", 
            "nss": nss,
            "tipo": tipo_archivo,        # "pdf" o "imagen"
            "nombreArchivo": archivo_storage.filename,
            "contenidoBase64": base64_str,
            "jwt": jwt_token,
            "replyTo": reply_to
        }

        # Publicar mensaje y esperar respuesta
        client.publish(TOPIC_MODIFICAR_EXPEDIENTE, json.dumps(payload))

        try:
            # Damos un timeout de 25s porque subir archivos puede ser lento
            resp = q.get(timeout=timeout)
        except queue.Empty:
            resp = {"error": "Timeout: El servicio de Expediente no respondió a tiempo."}

        client.loop_stop()
        client.disconnect()
        
        return resp

    except Exception as e:
        print("Error middleware subiendo archivo:", e)
        return {"error": str(e)}