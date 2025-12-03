package com.mycompany.servicioexpediente.rest;

import com.mycompany.servicioexpediente.dto.ExpedienteDto;
import com.mycompany.servicioexpediente.dto.mapper;
import com.secretaria_de_salud.Expediente;
import com.secretaria_de_salud.basedatosexpedienteclinico.ExpedientePersistencia;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Recurso RESTful para manejar las operaciones relacionadas con el Expediente
 * Clínico. Esta clase actúa como la interfaz externa (API) para que otros
 * servicios o el frontend (Middleware de Python) puedan solicitar y recibir
 * datos de un expediente.
 *
 * @author Secretaria de Salud
 *
 */
@Path("/expedientes")
public class ExpedienteResource {

    /**
     * Permite consultar el expediente de un paciente a partir de su Número de
     * Seguridad Social (NSS).
     *
     * * @param nss El Número de Seguridad Social del paciente requerido.
     * @return {@code Response} con el DTO del expediente si es exitoso (200 OK)
     * o un mensaje de error si el expediente no es encontrado (404 Not Found).
     */
    @GET
    @Path("/consultar")
    @Produces(MediaType.APPLICATION_JSON)
    public Response consultar(@QueryParam("nss") String nss) {

        Expediente expediente = new ExpedientePersistencia().consultarExpedientePorNss(nss);
        if (expediente != null) {
            ExpedienteDto dto = new mapper().toDto(expediente);
            return Response.ok(dto).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"Expediente no encontrado para NSS " + nss + "\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }
}
