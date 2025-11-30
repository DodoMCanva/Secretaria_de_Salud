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
        
