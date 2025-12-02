from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import auth
from servicios import pacienteComunicacion, medicoComunicacion,solicitudComunicacion, expedienteComunicacion  #  medio de Comunicacion

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
        token = jwt.encode(payload, SECRET, algorithm="HS256")
        return jsonify({
            "token": token,
            "usuario": paciente.get("nss"),
            "rol": "paciente"
        }), 200
    
    try:
        medico = medicoComunicacion.login_rest(usuario, password, jwt_token=None)
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
            "usuario": medico.get("nss"),
            "rol": "medico"
        }), 200
    return jsonify({"error": "Credenciales incorrectas"}), 401



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




# ----------------- NUEVOS ENDPOINTS PARA EXPEDIENTES Y BÚSQUEDA -----------------

@app.route("/pacientes/buscar", methods=["POST"])
def buscar_pacientes():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario_info = auth.validar_token(token)
    
    if not usuario_info:
        return jsonify({"error": "Token inválido o expirado"}), 401
    
    # 1. Obtener el término de búsqueda del frontend (desde input-paciente-search)
    data = request.get_json(silent=True) or {}
    termino = data.get('termino', '').lower()

    if not termino or len(termino) < 3:
        return jsonify({"status": "ERROR", "pacientes": []}), 200

    print(f"Búsqueda solicitada por {usuario_info.get('usuario')} con término: {termino}")

    try:
        # Aquí se realizaría la llamada a tu servicio de comunicación para la búsqueda
        # resp = pacienteComunicacion.buscar_pacientes(termino, token)
        
        # SIMULACIÓN de respuesta de pacientes (debes reemplazar con tu lógica de backend/DB)
        pacientes_simulados = [
            {"id": "pat_001", "nombreCompleto": "María Elena González López", "curp": "GOLM890515...", "ultModf": "2025-11-20"},
            {"id": "pat_002", "nombreCompleto": "Juan Carlos Ramírez Pérez", "curp": "RAPJ950101...", "ultModf": "2025-10-05"},
            {"id": "pat_003", "nombreCompleto": "Ana Torres", "curp": "TORA871212...", "ultModf": "2025-11-01"},
        ]
        
        # Filtro simple por nombre (simulado)
        resultados = [p for p in pacientes_simulados if termino in p['nombreCompleto'].lower() or termino in p['id'].lower()]

        return jsonify({
            "status": "OK",
            "pacientes": resultados
        }), 200

    except Exception as e:
        print(f"Error en el endpoint /pacientes/buscar: {e}")
        return jsonify({"error": "Error al procesar la búsqueda"}), 500

#--------------por el momento no lo uso----------------------
@app.route("/expediente/detalle", methods=["POST"])
def detalle_expediente():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario_info = auth.validar_token(token)
    
    if not usuario_info:
        return jsonify({"error": "Token inválido o expirado"}), 401

    # 1. Obtener el ID del paciente del frontend
    data = request.get_json(silent=True) or {}
    paciente_id = data.get('paciente_id')

    if not paciente_id:
        return jsonify({"error": "Falta el ID del paciente"}), 400

    print(f"Solicitud de detalle de expediente para ID: {paciente_id}")

    try:
        # Aquí harías la consulta a tu base de datos o servicio externo
        # (Ej: resp = pacienteComunicacion.obtener_expediente(paciente_id, token))

        # SIMULACIÓN DE DATOS DEL EXPEDIENTE (DEBES REEMPLAZAR CON TU LÓGICA)
        if paciente_id == "pat_001":
            detalle = {
                "nombre": "María Elena González López",
                "ultModf": "20 de Noviembre de 2025",
                "pdfs": ["Historial_Clinico_01.pdf", "Resultados_Lab_Nov.pdf"],
                "imagenes": ["RX_Torax_2025.jpg", "Tomografia_2023.png"],
                "recetas": ["Receta_Amoxicilina_2025.txt", "Receta_Paracetamol_2024.txt"]
            }
        else:
            detalle = {
                "nombre": "Paciente Desconocido",
                "ultModf": "N/A",
                "pdfs": ["Sin documentos."],
                "imagenes": [],
                "recetas": []
            }
        
        return jsonify({
            "status": "OK",
            "expediente": detalle
        }), 200

    except Exception as e:
        print(f"Error en el endpoint /expediente/detalle: {e}")
        return jsonify({"error": "Error al obtener el detalle del expediente"}), 500


# ----------------- NUEVOS para solicitar permiso -----------------

@app.route("/solicitudes/crear", methods=["POST"])
def crear_solicitud():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401

    data = request.get_json(silent=True) or {}
    nss_paciente = data.get("nssPaciente")
    motivo = data.get("motivo")
    nss_medico = usuario.get("usuario")   # este será nssMedico

    if not nss_paciente:
        return jsonify({"error": "Falta nssPaciente"}), 400

    res = solicitudComunicacion.crear_solicitud(
        nss_paciente, nss_medico, motivo, token
    )
    return jsonify({"respuesta": res}), 200
#-------------Aqui abre el expediente si la solicitud esta autorizada-------------------------
@app.route("/medico/expediente/abrir", methods=["POST"])
def medico_abrir_expediente():
    """
    El médico intenta abrir el expediente de un paciente.
    1) Valida JWT.
    2) Pregunta a ServicioSolicitud si la solicitud está ACEPTADA.
    3) Si está autorizado, devuelve un expediente simulado (por ahora).
    """
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401

    data = request.get_json(silent=True) or {}
    nss_paciente = data.get("nssPaciente")
    if not nss_paciente:
        return jsonify({"error": "Falta nssPaciente"}), 400

    id_medico = usuario.get("usuario")  # el NSS / id del médico en el token

    # 1) Verificar autorización en ServicioSolicitud
    auth_resp = solicitudComunicacion.esta_autorizado(nss_paciente, id_medico, token)

    if not auth_resp.get("autorizado"):
        # Todavía no hay solicitud aceptada
        return jsonify({
            "status": "NO_AUTORIZADO",
            "mensaje": "El paciente aún no ha aceptado la solicitud."
        }), 200

    # 2) AUTORIZADO: por ahora devolvemos un expediente de prueba
    expediente_mock = {
        "nombre": "Paciente Autorizado",
        "nss": nss_paciente,
        "ultModf": "2025-11-20 14:30",
        "estado": "Activo",
        "edad": 36,
        "curp": "GOLM890515MDFNLR08",
        "tipoSangre": "O+",
        "alergias": ["Penicilina", "Polen"],
        "contactoEmergencia": "Contacto simulado",
        "pdfs": ["Estudios_2025.pdf"],
        "imagenes": ["RX_Torax.jpg"],
        "recetas": ["Receta_Paracetamol.pdf"]
    }

    return jsonify({
        "status": "OK",
        "expediente": expediente_mock
    }), 200


# ----------------- Cargar Datos medico -----------------

@app.route("/api/medico/actual", methods=["GET"])
def medico_actual():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)

    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401
    
    if usuario.get("rol") != "medico":
        return jsonify({"error": "No autorizado"}), 403

    nss_medico = usuario.get("usuario")
    print("NSS del médico:", nss_medico)

    datos_medico = medicoComunicacion.consulta_medico_esperando_respuesta(nss_medico, token)
    print(datos_medico)

    if isinstance(datos_medico, dict) and "medico" in datos_medico:
        datos_medico = datos_medico["medico"]

    print(datos_medico)

    return jsonify(datos_medico), 200

# ----------------- Consultar solicitudes paciente-----------------


@app.route("/solicitudes/consulta-mqtt", methods=["POST"])
def consultar_solicitudes_paciente_mqtt():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    
    if not usuario:
        return jsonify({"error": "Token inválido"}), 401

    data = request.json
    nss = data.get('nss')
    
    # Validar que el usuario solo consulte sus propias solicitudes (opcional pero recomendado)
    if usuario.get('usuario') != nss:
         return jsonify({"error": "No autorizado para ver estos datos"}), 403

    print(f"Consultando solicitudes MQTT para NSS: {nss}")

    # Llamada a la nueva función MQTT
    resp = solicitudComunicacion.consultar_solicitudes_mqtt(nss, token)
    
    return jsonify(resp), 200

@app.route("/expediente/consulta", methods=["GET"])
def consulta_expediente():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
    return jsonify({"error": "Token inválido o expirado"}), 401

    nss = request.args.get("nss")
    if not nss:
        return jsonify({"error": "Falta el NSS para la consulta"}), 400
    response = expedienteComunicacion.consulta_expediente(nss)

    if isinstance(response, dict) and (response.get("status") == "ERROR" or response.get("error")):
        print("Error en la respuesta REST:", response)
        return jsonify(response), 404

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
