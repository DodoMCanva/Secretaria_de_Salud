from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import jwt

app = Flask(__name__)
CORS(app)

GLASSFISH_URL = "http://localhost:8080/ServicioPaciente/resources/pacientes/buscar"

def validar_token(token):
    try:
        secret = 'cesvalferpaukimivsectrsalud!!@##'
        datos = jwt.decode(token, secret, algorithms=["HS256"])
        return datos
    except Exception:
        return None

@app.route('/login', methods=['POST'])
def login():
    usuario = request.json['usuario']
    password = request.json['password']
    if usuario == "demo" and password == "123":
        token = jwt.encode({'usuario': usuario}, 'cesvalferpaukimivsectrsalud!!@##', algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Credenciales incorrectas"}), 401

@app.route("/paciente/consulta-rest", methods=["GET"])
def consulta_rest():
    print("Header Authorization:", request.headers.get("Authorization"))
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401
    curp = request.args.get("curp")
    paciente = consultar_paciente_rest(curp, token)
    if paciente:
        return jsonify(paciente)
    else:
        return jsonify({"error": "Paciente no encontrado"}), 404

@app.route("/paciente/consulta-mqtt", methods=["POST"])
def consulta_mqtt():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401
    data = request.json
    curp = data.get('curp')
    publicar_consulta_paciente(curp, token)
    return jsonify({"status": "Consulta publicada por MQTT"}), 202

def consultar_paciente_rest(curp, jwt_token):
    headers = {"Authorization": f"Bearer {jwt_token}"}
    params = {"curp": curp}
    resp = requests.get(GLASSFISH_URL, headers=headers, params=params)
    if resp.status_code == 200:
        return resp.json()
    return None

if __name__ == "__main__":
    app.run(debug=True, port=5000)

