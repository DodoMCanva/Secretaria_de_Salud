package com.secretaria_de_salud.conexion;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

/**
 * Clase encargada de gestionar la conexión con la base de datos MongoDB
 * utilizada por el sistema de expediente clínico.
 *
 * @author Secretaría de Salud
 */
public class conexionBD {

    /**
     * Establece la conexión con MongoDB y devuelve la base de datos
     * "expedientedb".
     *
     * @return Instancia de {@link MongoDatabase} conectada.
     */
    public MongoDatabase obtenerBD() {
        String url = "mongodb://secretariasalud:cesvalferpaukimivan@localhost:27017/expedientedb?authSource=admin";
        try (MongoClient mongoClient = MongoClients.create(url)) {
            MongoDatabase db = mongoClient.getDatabase("expedientedb");
            System.out.println("Conectado a " + db.getName());
            return db;
        }
    }
}
