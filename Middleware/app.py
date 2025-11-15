from flask import Flask, request, jsonify
import requests
import jwt

app = Flask(__name__)
GLASSFISH_URL = "http://ip-glassfish:8080/ServicioPaciente/api/pacientes/buscar"

@app.route('/login', methods=['POST'])
def login():
    # Validar usuario, generar JWT (ejemplo)
    usuario = request.json['usuario']
    password = request.json['password']
    # ...verificar credenciales...
    if usuario == "demo" and password == "123":
        token = jwt.encode({'usuario': usuario}, 'secreto', algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Credenciales incorrectas"}), 401

@app.route("/paciente/consulta-rest", methods=["GET"])
def consulta_rest():
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)