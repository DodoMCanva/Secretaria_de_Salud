import json
import requests
from rutas import rutas
direcciones = rutas.rutasActuales()

BASE_URL_EXPEDIENTE = f"http://localhost:{direcciones.get('expediente')}/ServicioExpediente/resources/expedientes"

def consulta_expediente(self, nss, timeout=10):
    url = f"{BASE_URL_EXPEDIENTE}/consultar"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    params = {
        "nssPaciente": nss_paciente,
    }

    resp = requests.get(url, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.text
    return {"error": resp.text or "Error cargando expediente", "status": resp.status_code}