import paho.mqtt.client as mqtt
token = JWT_generado_o_recibido

client = mqtt.Client()
client.username_pw_set(username="usuario", password=token)
client.connect("broker_url", 1883, 60)
client.publish("topic/mqtt", "mensaje")
