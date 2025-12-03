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
        "paciente" : "8080", 
        "medico" : "46040", 
        "expediente" : "41388", 
        "cita" : "10432", 
        "solicitud" : "45258",
        "http_local" : "8800", 
        "mid" : "5000", 
        "mqtt" : "1883"}

    return direcciones

def rutasPau():
    #Son los puertos que usamos localmente para ejecutarlo
    #Servicios: paciente, medico, expediente, cita, solicitud
    #adicional: base de datos, http local, middleware, mqtt
    direcciones = {
        "paciente" : "42384", 
        "medico" : "30340", 
        "expediente" : "13952", 
        "cita" : "42116", 
        "solicitud" : "29164",
        "http_local" : "8800", 
        "mid" : "5000", 
        "mqtt" : "1883"}
    return direcciones

def rutasVale():
    #Son los puertos que usamos localmente para ejecutarlo
    #Servicios: paciente, medico, expediente, cita, solicitud
    #adicional: base de datos, http local, middleware, mqtt
    direcciones = {
        "paciente" : "44443", 
        "medico" : "23757", 
        "expediente" : "20366", 
        "cita" : "38716", 
        "solicitud" : "38271",
        "http_local" : "8800", 
        "mid" : "5000", 
        "mqtt" : "1883"}
    return direcciones

def rutasCesar():
    #Son los puertos que usamos localmente para ejecutarlo
    #Servicios: paciente, medico, expediente, cita, solicitud
    #adicional: base de datos, http local, middleware, mqtt
    direcciones = {
        "paciente" : "18919", 
        "medico" : "15848", 
        "expediente" : "46252", 
        "cita" : "43057", 
        "solicitud" : "9787",
        "http_local" : "8800", 
        "mid" : "5000", 
        "mqtt" : "1883"}
    return direcciones

def rutasActuales():
    return rutasFer()
    