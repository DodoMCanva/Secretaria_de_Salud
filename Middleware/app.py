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
        print("paciente devuelto por login_rest:", paciente, type(paciente))
        payload = {"usuario": paciente.get("nss"), "nombre": paciente.get("nombre"), "rol": "paciente"}
        token = jwt.encode(payload, "cesvalferpaukimivsectrsalud!!@##", algorithm="HS256")
        return jsonify({
            "token": token,
            "usuario": paciente.get("nss")
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

# Este endpoint existente es redundante si usas /expediente/detalle, pero se mantiene si lo necesitas para algo específico.
@app.route("/expediente/consulta", methods=["POST"])
def consulta_expediente_mqtt():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    usuario = auth.validar_token(token)
    if not usuario:
        return jsonify({"error": "Token inválido o expirado"}), 401

    data = request.json
    nss = data.get('nss')
    # expediente.publicar_consulta_expediente(_id, token)
    return jsonify({"status": "Consulta publicada por MQTT"}), 202








if __name__ == "__main__":
    app.run(debug=True, port=5000)
