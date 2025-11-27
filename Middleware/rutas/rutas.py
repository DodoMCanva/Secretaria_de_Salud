def rutasFer():
    #Son los puertos que usamos localmente para ejecutarlo
    #Servicios: paciente, medico, expediente, cita, solicitud
    #adicional: base de datos, http local, middleware, mqtt
    direcciones = {
        "paciente" : "18609", 
        "medico" : "9300", 
        "expediente" : "36059", 
        "cita" : "20023", 
        "solicitud" : "23106",
        "http_local" : "8800", 
        "mid" : "5000", 
        "paciente_mqtt" : "1883", 
        "medico_mqtt" : "1884", 
        "expediente_mqtt" : "1885", 
        "cita_mqtt" : "1886", 
        "solicitud_mqtt" : "1887"}
    return direcciones

def rutasKim():
    #Son los puertos que usamos localmente para ejecutarlo
    #Servicios: paciente, medico, expediente, cita, solicitud
    #adicional: base de datos, http local, middleware, mqtt
    direcciones = {
        "paciente" : "18609", 
        "medico" : "9300", 
        "expediente" : "36059", 
        "cita" : "20023", 
        "solicitud" : "23106",
        "http_local" : "8800", 
        "mid" : "5000", 
        "mqtt" : "1883"}
    return direcciones

def rutasActuales():
    return rutasFer()
    