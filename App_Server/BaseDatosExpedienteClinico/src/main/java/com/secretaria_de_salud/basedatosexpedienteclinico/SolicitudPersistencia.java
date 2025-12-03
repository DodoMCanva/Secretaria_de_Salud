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
import com.mongodb.client.result.DeleteResult;
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
 * Clase encargada de gestionar la persistencia de solicitudes de acceso al
 * expediente clínico en MongoDB. Proporciona operaciones CRUD como creación,
 * consulta, actualización y eliminación de solicitudes.
 *
 * @author Secretaría de Salud
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

    /**
     * Obtiene la colección de MongoDB donde se almacenan las solicitudes de
     * acceso.
     *
     * @return colección tipada de {@link SolicitudAcceso}.
     */
    private MongoCollection<SolicitudAcceso> col() {
        MongoDatabase db = client.getDatabase("expedientedb");
        return db.getCollection("solicitudes_acceso", SolicitudAcceso.class);
    }

    /**
     * Crea una nueva solicitud de acceso para un paciente y médico.
     *
     * Antes de insertar la nueva solicitud, elimina todas las solicitudes
     * previas entre el mismo paciente y el mismo médico para evitar duplicados.
     *
     * @param nssPaciente Número de seguridad social del paciente.
     * @param idMedico Identificador del médico que solicita acceso.
     * @param motivo Razón de la solicitud.
     * @return La solicitud creada e insertada en la base de datos.
     */
    public SolicitudAcceso crearSolicitud(String nssPaciente, String idMedico, String motivo) {
        DeleteResult del = col().deleteMany(Filters.and(
                Filters.eq("nssPaciente", nssPaciente),
                Filters.eq("idMedico", idMedico)
        ));

        SolicitudAcceso s = new SolicitudAcceso();
        s.setNssPaciente(nssPaciente);
        s.setIdMedico(idMedico);
        s.setEstado("PENDIENTE");
        s.setFechaSolicitud(new Date());
        s.setMotivo(motivo);
        col().insertOne(s);
        return s;
    }

    /**
     * Inserta una solicitud de acceso en la base de datos sin realizar
     * validaciones adicionales.
     *
     * @param s Objeto {@link SolicitudAcceso} que será almacenado.
     */
    public void insertarSolicitud(SolicitudAcceso s) {
        col().insertOne(s);
    }

    /**
     * Obtiene todas las solicitudes de acceso en estado "PENDIENTE" asociadas a
     * un paciente.
     *
     * @param nssPaciente Número de seguridad social del paciente.
     * @return Lista de solicitudes pendientes del paciente.
     */
    public List<SolicitudAcceso> listarPendientesPorPaciente(String nssPaciente) {
        List<SolicitudAcceso> res = new ArrayList<>();
        col().find(Filters.and(
                Filters.eq("nssPaciente", nssPaciente),
                Filters.eq("estado", "PENDIENTE")
        )).into(res);
        return res;
    }

    /**
     * Busca una solicitud de acceso mediante su identificador único.
     *
     * @param id Cadena con el ObjectId del documento.
     * @return La solicitud encontrada o null si no existe.
     */
    public SolicitudAcceso buscarPorId(String id) {
        return col().find(Filters.eq("_id", new ObjectId(id))).first();
    }

    /**
     * Actualiza el estado de una solicitud pendiente específica entre un
     * paciente y un médico. Además, actualiza la fecha de solicitud a la fecha
     * actual.
     *
     * @param estado Nuevo estado de la solicitud (PENDIENTE, ACEPTADA,
     * RECHAZADA).
     * @param nssP Número de seguridad social del paciente.
     * @param nssM Identificador del médico.
     */
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

    /**
     * Verifica si existe alguna solicitud vigente en estado "ACEPTADA" entre un
     * paciente y un médico específico.
     *
     * @param nssPaciente Número de seguridad social del paciente.
     * @param idMedico Identificador del médico.
     * @return true si existe una solicitud aceptada; false en caso contrario.
     */
    public boolean existeAceptadaVigente(String nssPaciente, String idMedico) {
        SolicitudAcceso s = col().find(Filters.and(
                Filters.eq("nssPaciente", nssPaciente),
                Filters.eq("idMedico", idMedico),
                Filters.eq("estado", "ACEPTADA")
        )).first();

        return s != null;
    }

    /**
     * Elimina todas las solicitudes almacenadas en la colección. Esta función
     * es auxiliar y normalmente usada para depuración o pruebas.
     */
    public void eliminarSolicitud() {
        MongoDatabase db = client.getDatabase("expedientedb");
        MongoCollection<SolicitudAcceso> col = db.getCollection("solicitudes_acceso", SolicitudAcceso.class);
        col.deleteMany(new Document());

    }
}
