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

    // Agregar médico
    public void agregarMedico(Medico medico) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);
        col.insertOne(medico);
    }

    // Buscar médico por NSS
    public Medico buscarMedico(String nss) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);

        Medico medico = col.find(eq("nss", nss)).first();
        if (medico == null || medico.getNombre() == null) {
            return null;
        }
        return medico;
    }

    // Eliminar todos los médicos (similar a eliminarPacientes)
    public void eliminarMedicos() {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);
        col.deleteMany(new Document());
    }

    // Eliminar un médico por NSS (opcional, por si lo necesitas)
    public void eliminarMedicoPorNss(String nss) {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<Medico> col = db.getCollection("medicos", Medico.class);
        col.deleteOne(eq("nss", nss));
    }
}
