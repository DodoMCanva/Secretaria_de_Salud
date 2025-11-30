from flask import request
import jwt

def decode_jwt(token):
    secret = "cesvalferpaukimivsectrsalud!!@##"
    return jwt.decode(token, secret, algorithms=["HS256"])

def validar_token(token):
    try:
        secret = 'cesvalferpaukimivsectrsalud!!@##'
        datos = jwt.decode(token, secret, algorithms=["HS256"])
        return datos
    except Exception:
        return None
        
def consultar_paciente_rest(curp, jwt_token):
    headers = {"Authorization": f"Bearer {jwt_token}"}
    params = {"curp": curp}
    resp = requests.get(GLASSFISH_URL, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.json()
    return None
