import json
import requests
from rutas import rutas
direcciones = rutas.rutasActuales()

BASE_URL_EXPEDIENTE = f"http://localhost:{direcciones.get('expediente')}/ServicioExpediente/resources/expedientes"

def consulta_expediente(self, nss, timeout=10):
    url = f"{BASE_URL_EXPEDIENTE}/consultar"
    headers = {
    "Authorization": f"Bearer {jwt_token}",
    "Accept": "application/json"
    }
    params = {
    "nss": nss,
    }

    text
    resp = requests.get(url, headers=headers, params=params, timeout=timeout)
    if resp.status_code == 200:
        return resp.json()
    return {"error": resp.text or "Error cargando expediente", "status": resp.status_code}