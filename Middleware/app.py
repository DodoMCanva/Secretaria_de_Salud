from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import jwt
import auth
from servicios import pacienteComunicacion

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    usuario = data.get('usuario')
    password = data.get('password')

    #Agregar flujo adicional para medico
    if not usuario or not password:
        return jsonify({"error": "Faltan credenciales"}), 400
    try:
        paciente = pacienteComunicacion.login_rest(usuario, password, jwt_token=None)
    except Exception as e:
        print("ERROR login_rest:", e)
        return jsonify({"error": "Error interno login_rest"}), 500

    if paciente:
        payload = {
            "nss": paciente.get("nss"),
            "nombre": paciente.get("nombre"),
            "rol": "paciente"
        }
        
        token = jwt.encode(payload, "cesvalferpaukimivsectrsalud!!@##", algorithm="HS256")
        return jsonify({
            "token": token,
            "paciente": paciente
        }), 200
    
    return jsonify({"error": "Credenciales incorrectas"}), 401

#Este es el mismo del anterior caso para mqtt no creo que sea comun que se utilice
@app.route("/expediente/consulta-mqtt", methods=["POST"])
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

"""
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
"""