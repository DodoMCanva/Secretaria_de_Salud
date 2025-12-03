package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.secretaria_de_salud.Medico;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.secretaria_de_salud.Medico;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.and;
import com.secretaria_de_salud.Paciente;
import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import org.bson.codecs.pojo.PojoCodecProvider;

/**
 * Clase encargada de gestionar la persistencia de los médicos dentro de
 * MongoDB. Permite login, registro, búsqueda y eliminación de documentos en la
 * colección medicos.
 *
 * @author Secretaria de Salud
 */
public class MedicoPersistencia {

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
     * Verifica las credenciales del médico para permitir su acceso al sistema.
     *
     * @param nss NSS del médico.
     * @param pwd Contraseña del médico.
     * @return El objeto Medico si las credenciales coinciden, null si no existe
     * o no coincide.
     */
    public Medico login(String nss, String pwd) {
        System.out.println("Entro aqui login medico");
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);

        Medico medico = col.find(
                Filters.and(
                        Filters.eq("nss", nss),
                        Filters.eq("pwd", pwd)
                )
        ).first();

        if (medico == null) {
            System.out.println("Medico no encontrado para nss=" + nss);
            return null;
        }

        if (medico.getNombre() == null) {
            System.out.println("Medico sin nombre para nss=" + nss);
            return null;
        }

        return medico;
    }

    /**
     * Inserta un nuevo médico en la base de datos.
     *
     * @param medico Objeto Medico que será agregado.
     */
    public void agregarMedico(Medico medico) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);
        col.insertOne(medico);
    }

    /**
     * Busca un médico por su NSS.
     *
     * @param nss Número de Seguro Social del médico.
     * @return El médico encontrado o null si no existe.
     */
    public Medico buscarMedico(String nss) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);

        Medico medico = col.find(eq("nss", nss)).first();
        if (medico == null || medico.getNombre() == null) {
            return null;
        }
        return medico;
    }

    /**
     * Elimina todos los documentos dentro de la colección de médicos. Útil para
     * limpiar datos de prueba.
     */
    public void eliminarMedicos() {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);
        col.deleteMany(new Document());
    }

    /**
     * Elimina un médico específico según su NSS.
     *
     * @param nss NSS del médico a eliminar.
     */
    public void eliminarMedicoPorNss(String nss) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);
        col.deleteOne(eq("nss", nss));
    }

    /**
     * Cierra la conexión activa con la base de datos MongoDB.
     */
    public void close() {
        if (client != null) {
            client.close();
            System.out.println("Conexión a MongoDB cerrada.");
        }
    }
}
