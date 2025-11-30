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
        payload = {"usuario": paciente.get("_id"), "nombre": paciente.get("nombre"), "rol": "paciente"}
        _id = paciente.get("_id")
        token = jwt.encode(payload, "cesvalferpaukimivsectrsalud!!@##", algorithm="HS256")
        return jsonify({
            "token": token,
            "usuario": _id
        }), 200
    
    return jsonify({"error": "Credenciales incorrectas"}), 401

#Este es el mismo del anterior caso para mqtt no creo que sea comun que se utilice
@app.route("/expediente/consulta", methods=["POST"])
def consulta_expediente():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401

    data = request.json
    _id = data.get('_id')
    #expediente.publicar_consulta_expediente(_id, token)
    return jsonify({"status": "Consulta publicada por MQTT"}), 202

@app.route("/paciente/consulta", methods=["POST"])
def consulta_paciente():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401
    data = request.json
    _id = data.get('_id')
    pacienteComunicacion.publicar_consulta_paciente(_id, token)
    return jsonify({"status": "Consulta publicada por MQTT"}), 202

if __name__ == "__main__":
    app.run(debug=True, port=5000)
