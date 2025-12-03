PROYECTO – SISTEMA DISTRIBUIDO (SECRETARÍA DE SALUD)

Este proyecto es un sistema distribuido compuesto por un App Server, un Middleware y un Web Server, diseñado para la gestión de expedientes clínicos, comunicación mediante servicios REST y manejo de solicitudes médicas.
Incluye módulos para base de datos, servicios independientes desplegados en GlassFish, comunicación por MQTT y una interfaz web para el usuario.


REQUISITOS

- Java 8+
- GlassFish 5+
- Python 3.10+
- Mongo DB
- Dependencias de Python (Flask, paho-mqtt, mosquitto, etc.)
- NetBeans / IntelliJ (para compilar los módulos Java)
- Navegador web


INSTRUCCIONES PARA EJECUTAR EL PROYECTO

1. Preparación en App_Server/

    1. Realizar Clean & Build en este orden:
         - Objetos_SecretariaSalud
         - BaseDatosExpedienteClinico
    2. Ejecutar la clase Presets (esto inicializa datos necesarios).
    3. Realizar Clean & Build en todos los servicios del App Server.
    4. Crear un servicio en GlassFish para cada módulo y asignar las rutas correspondientes en: Middleware/rutas/rutas.py

2. Ejecutar el Middleware

      Desde consola:
           cd Middleware
           python app.py

3. Levantar los servicios del App_Server

      En GlassFish, desplegar y ejecutar todos los servicios.
      Asegurarse de que todos estén en estado Running.

4. Ejecutar el Web Server

      Desde consola:
           cd Web_Server
           python -m http.server 8800

5. Acceder desde navegador:
  
      http://localhost:8800/login.html


NOTAS

- Si un servicio falla, realizar nuevamente Clean & Build y volver a desplegar en GlassFish.
- El Middleware debe estar ejecutándose antes de abrir la interfaz web.
- Si se modifican las rutas del backend, actualizar rutas.py.



Proyecto realizado para la materia Sistemas Distribuidos /Arquitecturas Empresariales – ITSON.
Integrantes: 
247045 - César Durán Ávalos
225330 - Valeria Encinas Lujano
244802 - Kimberli Martínez Sandoval
249444 - Fernando García Salazar
117262 - Paulina Rodríguez Rayos
165647 - Alejandro Ochoa Vega
