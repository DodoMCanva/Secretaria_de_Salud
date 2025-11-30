package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.secretaria_de_salud.Paciente;
import com.secretaria_de_salud.conexion.conexionBD;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.Document;

/**
 *
 * @author Secretaria de Salud
 */
public class PacientePersistencia {

    private String uri = "mongodb://secretariasalud:cesvalferpaukimivan@localhost:27017/expedientedb?authSource=admin";
    
    private CodecRegistry pojoCodecRegistry = fromRegistries(
            MongoClientSettings.getDefaultCodecRegistry(),
            fromProviders(PojoCodecProvider.builder().automatic(true).build()));

    private MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(new ConnectionString(uri))
            .codecRegistry(pojoCodecRegistry)
            .build();

    private MongoClient client = MongoClients.create(settings);

    //metodos reciclados simplificar
    public Paciente login(String nss, String pwd) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> col = db.getCollection("pacientes", Paciente.class);
        Paciente paciente = col.find(
                Filters.and(
                        Filters.eq("nss", nss),
                        Filters.eq("pwd", pwd)
                )
        ).first();
        if (paciente.getNombre() == null || paciente.getNombre() == "s") {
            return null;
        }
        return paciente;
    }

    public void agregarPaciente(Paciente paciente) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> pacientesCol = db.getCollection("pacientes", Paciente.class);
        pacientesCol.insertOne(paciente);
    }

    //Auxiliar
    public void eliminarPacientes() {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> col = db.getCollection("pacientes", Paciente.class);
        col.deleteMany(new Document());

    }
}
