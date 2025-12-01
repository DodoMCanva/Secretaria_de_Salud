package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.secretaria_de_salud.Expediente;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.types.Binary;

/**
 *
 * @author Secretaria de Salud
 */
public class ExpedientePersistencia {

    private final String URI = "mongodb://secretariasalud:cesvalferpaukimivan@localhost:27017/expedientedb?authSource=admin";
    private final String DB_NAME = "expedientedb";
    private final String COLLECTION_NAME = "expedientes";

    private final CodecRegistry pojoCodecRegistry = fromRegistries(
            MongoClientSettings.getDefaultCodecRegistry(),
            fromProviders(PojoCodecProvider.builder().automatic(true).build()));

    private final MongoClient client;

    // Constructor para inicializar la conexión
    public ExpedientePersistencia() {
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(URI))
                .codecRegistry(pojoCodecRegistry)
                .build();
        this.client = MongoClients.create(settings);
    }

    public MongoCollection<Expediente> getExpedienteCollection() {
        MongoDatabase db = client.getDatabase(DB_NAME);
        return db.getCollection(COLLECTION_NAME, Expediente.class);
    }

    /**
     * Consulta el expediente clínico usando el NSS del paciente.
     *
     * @param nss El Número de Seguridad Social del paciente.
     * @return El objeto Expediente o null si no se encuentra.
     */
    public Expediente consultarExpedientePorNss(String nss) {
        MongoCollection<Expediente> col = getExpedienteCollection();

        // Busca el expediente filtrando por el campo "nss"
        Expediente expediente = col.find(Filters.eq("nss", nss)).first();

        return expediente;
    }

    /**
     * Agrega un nuevo documento de expediente. Debe usarse solo si el paciente
     * no tiene un expediente registrado.
     *
     * @param expediente El objeto Expediente a guardar (debe tener el NSS
     * seteado).
     */
    public void agregarExpediente(Expediente expediente) {
        MongoCollection<Expediente> col = getExpedienteCollection();

        col.insertOne(expediente);
        System.out.println("Nuevo expediente guardado exitosamente.");
    }

    /**
     * Agrega un nuevo archivo binario (PDF o imagen) al expediente existente.
     * Utiliza $push para añadir al array sin sobrescribir.
     *
     * @param nss El NSS para identificar el expediente.
     * @param tipoCampo El nombre del campo a actualizar ("pdfs" o "imagenes").
     * @param archivo El objeto Binary que representa el archivo.
     */
    public void agregarArchivo(String nss, String tipoCampo, Binary archivo) {
        MongoCollection<Expediente> col = getExpedienteCollection();

        col.updateOne(
                Filters.eq("nss", nss), // Filtro: buscar por NSS
                Updates.push(tipoCampo, archivo) // Actualización: $push al array
        );
        System.out.println("Archivo agregado a la lista '" + tipoCampo + "' del expediente con NSS: " + nss);
    }

    /**
     * Agrega una nueva receta (String) al expediente existente.
     *
     * @param nss El NSS para identificar el expediente.
     * @param receta La cadena de texto de la receta.
     */
    public void agregarReceta(String nss, String receta) {
        MongoCollection<Expediente> col = getExpedienteCollection();

        col.updateOne(
                Filters.eq("nss", nss), // Filtro: buscar por NSS
                Updates.push("recetas", receta) // Actualización: $push al array de recetas
        );
        System.out.println("Receta agregada al expediente con NSS: " + nss);
    }

    public void close() {
        if (client != null) {
            client.close();
            System.out.println("Conexión a MongoDB cerrada.");
        }
    }

}
