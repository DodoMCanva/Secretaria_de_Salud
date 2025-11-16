import requests

GLASSFISH_URL = "http://localhost:8080/ServicioPacientes/api/pacientes/buscar"

def consultar_paciente_rest(curp, jwt_token):
    headers = {"Authorization": f"Bearer {jwt_token}"}
    params = {"curp": curp}
    resp = requests.get(GLASSFISH_REST_URL, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.json()
    return None
