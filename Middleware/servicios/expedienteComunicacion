# ExpedienteComunicacion.py

import paho.mqtt.client as mqtt
import json
import requests
import queue
import time
# Asegúrate de que 'rutas.py' contenga la dirección del servicio de Expediente
from rutas import rutas
direcciones = rutas.rutasActuales()

# --- CONFIGURACIÓN GENERAL ---
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
# Tópico al que se publica la solicitud de consulta de expediente
TOPIC_PUBLICAR_EXPEDIENTE = "consulta/expediente" 

# URL para el servicio de validación/login del paciente (Necesario para obtener el JWT)
# Usaremos la misma URL de login de paciente, asumiendo que el JWT es el mismo para consultar expediente
GLASSFISH_URL_LOGIN_PACIENTE = f"http://localhost:{direcciones["expediente"]}/ServicioPaciente/resources/pacientes/login"

# ==============================================================================
# MÉTODOS DE CONSULTA (MQTT)
# ==============================================================================

def publicar_consulta_expediente(nss, jwt_token):
    """
    Publica una solicitud de consulta de expediente vía MQTT.
    """
    reply_to = f"respuesta/expediente/{nss}"
    msg = {
        "nss": nss,
        "jwt": jwt_token,
        "replyTo": reply_to
    }
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    # Publica en el tópico de expediente
    client.publish(TOPIC_PUBLICAR_EXPEDIENTE, json.dumps(msg))
    client.disconnect()


def consulta_expediente_esperando_respuesta(nss, jwt_token, timeout=5):
    """
    Publica una solicitud de consulta de expediente y espera la respuesta
    en un tópico único para evitar colisiones.
    """
    # El tópico de respuesta se basa en el NSS
    reply_to = f"respuesta/expediente/{nss}"
    q = queue.Queue()

    def on_message(client, userdata, msg):
        """Callback que se ejecuta al recibir la respuesta."""
        try:
            # Asumiendo que la respuesta es un JSON con los datos del expediente
            data = json.loads(msg.payload.decode("utf-8"))
            q.put(data)
        except Exception as e:
            # Captura errores de parseo JSON o cualquier otro error
            q.put({"error": f"Error procesando respuesta MQTT: {e}"})

    client = mqtt.Client()
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    
    # Suscribirse al tópico de respuesta específico
    client.subscribe(reply_to)
    client.loop_start() # Iniciar el bucle para escuchar mensajes

    # Mensaje de solicitud de expediente
    msg = {
        "nss": nss,
        "jwt": jwt_token,
        "replyTo": reply_to
    }
    # Publicar la solicitud
    client.publish(TOPIC_PUBLICAR_EXPEDIENTE, json.dumps(msg))

    try:
        # Esperar la respuesta con un timeout
        resp = q.get(timeout=timeout)
    except queue.Empty:
        resp = {"error": "Timeout esperando respuesta del servicio expediente"}

    # Limpiar conexión MQTT
    client.loop_stop()
    client.disconnect()
    return resp

# ==============================================================================
# EJEMPLO DE USO
# ==============================================================================

if __name__ == "__main__":
    
    NSS_PRUEBA = "12345678901"
    PWD_PRUEBA = "pwd123" # Reemplazar con la contraseña real
    
    print("--- 1. Intentando Login/Validación REST para obtener JWT ---")
    login_info = login_rest(NSS_PRUEBA, PWD_PRUEBA)
    
    if login_info and "jwt" in login_info:
        jwt_token = login_info["jwt"]
        print("Login exitoso. JWT obtenido.")
        
        print(f"\n--- 2. Consultando Expediente de NSS {NSS_PRUEBA} vía MQTT ---")
        
        # Llama a la función de consulta que publica y espera la respuesta
        expediente_data = consulta_expediente_esperando_respuesta(NSS_PRUEBA, jwt_token)
        
        if "error" in expediente_data:
            print("❌ Error en la consulta del expediente:", expediente_data["error"])
        else:
            print("✅ Expediente recibido exitosamente:")
            # Imprimir los datos recibidos (el JSON del expediente)
            print(json.dumps(expediente_data, indent=4))
            
    else:
        print("❌ Login fallido. No se puede consultar el expediente sin JWT.")