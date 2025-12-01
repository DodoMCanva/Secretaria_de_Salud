from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import auth
from servicios import pacienteComunicacion, medicoComunicacion  # agrega medicoComunicacion

app = Flask(__name__)
CORS(app)

SECRET = "cesvalferpaukimivsectrsalud!!@##"

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    usuario = data.get('usuario')
    password = data.get('password')

    if not usuario or not password:
        return jsonify({"error": "Faltan credenciales"}), 400

    # 1) Intentar login como PACIENTE (REST)
    try:
        paciente = pacienteComunicacion.login_rest(usuario, password, jwt_token=None)
    except Exception as e:
        print("ERROR login_rest paciente:", e)
        paciente = None

    if paciente:
        payload = {
            "usuario": paciente.get("nss"),
            "nombre": paciente.get("nombre"),
            "rol": "paciente"
        }
        token = jwt.encode(payload, SECRET, algorithm="HS256")  # payload con rol[web:168][web:164]
        return jsonify({
            "token": token,
            "usuario": paciente,
            "rol": "paciente"
        }), 200

    # 2) Si no es paciente, intentar como MÉDICO (REST o MQTT, según tu diseño)
    try:
        medico = medicoComunicacion.login_rest(usuario, password, jwt_token=None)
        # o login_mqtt(...), según cómo lo hayas implementado
    except Exception as e:
        print("ERROR login_rest medico:", e)
        medico = None

    if medico:
        payload = {
            "usuario": medico.get("nss"),
            "nombre": medico.get("nombre"),
            "rol": "medico"
        }
        token = jwt.encode(payload, SECRET, algorithm="HS256")
        return jsonify({
            "token": token,
            "usuario": medico,
            "rol": "medico"
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
    nss = data.get('nss')
    #expediente.publicar_consulta_expediente(_id, token)
    return jsonify({"status": "Consulta publicada por MQTT"}), 202


@app.route("/medico/consulta", methods=["POST"])
def consulta_medico():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        print("Token inválido o expirado")
        return jsonify({"error": "Token inválido o expirado"}), 401

    data = request.json
    nss = data.get('nss')
    print("Entró /medico/consulta con nss:", nss)

    # Llamar al servicio MQTT/REST de médicos
    resp = medicoComunicacion.consulta_medico_esperando_respuesta(nss, token)
    print("Respuesta desde MQTT medico:", resp)
    return jsonify(resp), 200


@app.route("/paciente/consulta", methods=["POST"])
def consulta_paciente():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        print("Token inválido o expirado")
        return jsonify({"error": "Token inválido o expirado"}), 401

    print("Raw body:", request.get_data(as_text=True))
    data = request.json
    nss = data.get('nss')
    print("Entró /paciente/consulta con nss:", nss)

    resp = pacienteComunicacion.consulta_paciente_esperando_respuesta(nss, token)
    print("Respuesta desde MQTT:", resp)
    return jsonify(resp), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
