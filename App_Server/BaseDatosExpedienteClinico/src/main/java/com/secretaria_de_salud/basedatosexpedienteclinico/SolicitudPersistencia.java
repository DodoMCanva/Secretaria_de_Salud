package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;
import com.secretaria_de_salud.SolicitudAcceso;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.bson.Document;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.types.ObjectId;

/**
 *
 * @author Secretaria de Salud
 */
public class SolicitudPersistencia {

    private String uri = "mongodb://secretariasalud:cesvalferpaukimivan@localhost:27017/expedientedb?authSource=admin";

    private CodecRegistry pojoCodecRegistry = fromRegistries(
            MongoClientSettings.getDefaultCodecRegistry(),
            fromProviders(PojoCodecProvider.builder().automatic(true).build()));

    private MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(new ConnectionString(uri))
            .codecRegistry(pojoCodecRegistry)
            .build();

    private MongoClient client = MongoClients.create(settings);

    private MongoCollection<SolicitudAcceso> col() {
        MongoDatabase db = client.getDatabase("expedientedb");
        return db.getCollection("solicitudes_acceso", SolicitudAcceso.class);
    }

    public SolicitudAcceso crearSolicitud(String nssPaciente, String idMedico, String motivo) {
        SolicitudAcceso s = new SolicitudAcceso();
        s.setNssPaciente(nssPaciente);
        s.setIdMedico(idMedico);
        s.setEstado("PENDIENTE");
        s.setFechaSolicitud(new Date());
        s.setMotivo(motivo);
        col().insertOne(s);
        return s;
    }

    public void insertarSolicitud(SolicitudAcceso s) {
        col().insertOne(s);
    }

    public List<SolicitudAcceso> listarPendientesPorPaciente(String nssPaciente) {
        List<SolicitudAcceso> res = new ArrayList<>();
        col().find(Filters.and(
                Filters.eq("nssPaciente", nssPaciente),
                Filters.eq("estado", "PENDIENTE")
        )).into(res);
        return res;
    }

    public SolicitudAcceso buscarPorId(String id) {
        return col().find(Filters.eq("_id", new ObjectId(id))).first();
    }

    public void actualizarEstado(String estado, String nssP, String nssM) {
        UpdateResult result = col().updateOne(
                Filters.and(
                        Filters.eq("nssPaciente", nssP),
                        Filters.eq("idMedico", nssM),
                        Filters.eq("estado", "PENDIENTE")
                ),
                Updates.combine(
                        Updates.set("estado", estado),
                        Updates.set("fechaSolicitud", new Date())
                )
        );

        System.out.println("Matched: " + result.getMatchedCount()
                + " | Modified: " + result.getModifiedCount());
    }

    public boolean existeAceptadaVigente(String nssPaciente, String idMedico) {
        SolicitudAcceso s = col().find(Filters.and(
                Filters.eq("nssPaciente", nssPaciente),
                Filters.eq("idMedico", idMedico),
                Filters.eq("estado", "ACEPTADA")
        )).sort(Sorts.descending("fechaSolicitud")) // la más reciente primero
                .first();

        return s != null;
    }
    //Auxiliar

    public void eliminarSolicitud() {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<SolicitudAcceso> col = db.getCollection("solicitudes_acceso", SolicitudAcceso.class);
        col.deleteMany(new Document());

    }
}
