package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.model.Updates;
import com.secretaria_de_salud.Paciente;
import com.secretaria_de_salud.conexion.conexionBD;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.Document;
import org.bson.types.ObjectId;

/**
 * Maneja las operaciones CRUD relacionadas con los pacientes en MongoDB.
 * Incluye autenticación, consulta, inserción y asignación de tutor.
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

     /**
     * Realiza el inicio de sesión verificando NSS y contraseña.
     *
     * @param nss NSS del paciente.
     * @param pwd Contraseña del paciente.
     * @return Paciente autenticado o null si no coincide.
     */
    public Paciente login(String nss, String pwd) {
        System.out.println("logeamos");
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> col = db.getCollection("pacientes", Paciente.class);

        Paciente paciente = col.find(
                Filters.and(
                        Filters.eq("nss", nss),
                        Filters.eq("pwd", pwd)
                )
        ).first();

        if (paciente == null || paciente.getNombre() == null || paciente.getNombre().equals("s")) {
            return null;
        }
        return paciente;
    }

    /**
     * Agrega un nuevo paciente a la base de datos.
     *
     * @param paciente Objeto Paciente a insertar.
     */
    public void agregarPaciente(Paciente paciente) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> pacientesCol = db.getCollection("pacientes", Paciente.class);
        pacientesCol.insertOne(paciente);
    }

    /**
     * Asigna un tutor a un paciente.
     *
     * @param paciente ID del paciente.
     * @param tutor ID del tutor.
     */
    public void asignarTutor(ObjectId paciente, ObjectId tutor) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> col = db.getCollection("pacientes", Paciente.class);
        col.updateOne(
                new Document("_id", paciente),
                Updates.set("tutor", tutor)
        );
    }

    /**
     * Busca un paciente por NSS.
     *
     * @param nss Número de seguridad social.
     * @return Paciente encontrado o null.
     */
    public Paciente buscarPaciente(String nss) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> col = db.getCollection("pacientes", Paciente.class);
        Paciente paciente = col.find(eq("nss", nss)).first();
        if (paciente.getNombre() == null || paciente.getNombre() == "s") {
            return null;
        }
        return paciente;
    }

    /**
     * Elimina todos los pacientes de la colección.
     */
    public void eliminarPacientes() {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Paciente> col = db.getCollection("pacientes", Paciente.class);
        col.deleteMany(new Document());

    }

    /**
     * Cierra la conexión con MongoDB.
     */
    public void close() {
        if (client != null) {
            client.close();
            System.out.println("Conexión a MongoDB cerrada.");
        }
    }
}
