# servicios/solicitudComunicacion.py
import requests
from rutas import rutas

direcciones = rutas.rutasActuales()

# ServicioSolicitud corre en otro puerto; ajústalo en rutasActuales()
GLASSFISH_URL_SOLICITUD_BASE = (
    f"http://localhost:{direcciones['solicitud']}/ServicioSolicitud/resources"
)

# =========================
# MÉDICO -> CREAR SOLICITUD
# =========================
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