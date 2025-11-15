from flask import request
import jwt

def decode_jwt(token):
    secret = "tu_secreto"
    return jwt.decode(token, secret, algorithms=["HS256"])

# Ejemplo de endpoint protegido
@app.route('/endpoint')
def protegida():
    token = request.headers.get('Authorization').split()[1]
    datos = decode_jwt(token)
    # Procesar según datos del usuario
