package com.secretaria_de_salud.conexion;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;



/**
 *
 * @author dodo
 */
public class conexionBD {

    public MongoDatabase obtenerBD() {
        String url = "mongodb://secretariasalud:cesvalferpaukimivan@localhost:27017/expedientedb?authSource=admin";
        try (MongoClient mongoClient = MongoClients.create(url)) {
            MongoDatabase db = mongoClient.getDatabase("expedientedb");
            System.out.println("Conectado a " + db.getName());
            return db;
        }
    }
}
