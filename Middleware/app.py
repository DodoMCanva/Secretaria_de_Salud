from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import jwt

from servicios import paciente 

app = Flask(__name__)
CORS(app)

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

    #aqui deberia consultarse en la bd utilizando el servicio de medico o paciente
    #primero al servicio de pacientes y si no encuentra nada, al servicio de medicos


    if usuario == "demo" and password == "123":
        #de usuario se cambiaria por su id
        token = jwt.encode({'usuario': usuario}, 'cesvalferpaukimivsectrsalud!!@##', algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Credenciales incorrectas"}), 401



#Este es el metodo que esta al pendiente de todas las acciones del paciente
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

#Este es el mismo del anterior caso para mqtt no creo que sea comun que se utilice
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

