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
def crear_solicitud_acceso(nss_paciente, id_medico, motivo, jwt_token):
    """
    Llama al ServicioSolicitud para crear una nueva solicitud de acceso.
    """
    url = f"{GLASSFISH_URL_SOLICITUD_BASE}/solicitudes"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "nssPaciente": nss_paciente,
        "idMedico": id_medico,
        "motivo": motivo,
    }
    resp = requests.post(url, json=payload, headers=headers)
    if resp.status_code == 200:
        return resp.json()
    return {"error": resp.text or "Error creando solicitud", "status": resp.status_code}


# =========================
# PACIENTE -> LISTAR SOLICITUDES
# =========================
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


# =========================
# PACIENTE -> RESPONDER SOLICITUD
# =========================
def responder_solicitud(id_solicitud, nuevo_estado, jwt_token):
    """
    Cambia el estado de la solicitud a ACEPTADA o RECHAZADA.
    """
    url = f"{GLASSFISH_URL_SOLICITUD_BASE}/solicitudes/{id_solicitud}"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json",
    }
    payload = {"estado": nuevo_estado}  # "ACEPTADA" o "RECHAZADA"
    resp = requests.put(url, json=payload, headers=headers)
    if resp.status_code == 200:
        return resp.json()
    return {"error": resp.text or "Error respondiendo solicitud", "status": resp.status_code}

