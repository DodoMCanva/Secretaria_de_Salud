/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.secretaria_de_salud.serviciosolicitud.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.secretaria_de_salud.SolicitudAcceso;
import jakarta.ws.rs.Path;
import com.secretaria_de_salud.basedatosexpedienteclinico.SolicitudPersistencia;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author delll
 */
@Path("/solicitudes")
public class SolicitudResource {

    private SolicitudPersistencia sp = new SolicitudPersistencia();

    // Médico crea solicitud de acceso
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/crear")
    @Produces(MediaType.APPLICATION_JSON)
    public Response crearSolicitud(@QueryParam("nssPaciente") String nssPaciente, @QueryParam("nssMedico") String nssMedico, @QueryParam("motivo") String motivo) {
        sp.crearSolicitud(nssPaciente, nssMedico, motivo);
        return Response.ok("Se creo solicitud").build();
    }

    @GET
    @Path("/paciente")
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarPorPaciente(@QueryParam("nss") String nss) {
        List<SolicitudAcceso> solicitudes = sp.listarPendientesPorPaciente(nss);

        Map<String, Object> root = new HashMap<>();
        if (solicitudes != null) {
            root.put("status", "OK");
            root.put("solicitudes", solicitudes);
        } else {
            root.put("status", "ERROR");
            root.put("error", "Error consultando base de datos");
        }

        return Response.ok(root).build();  // JAX‑RS + Jackson lo serializan a JSON plano
    }

    @PUT
    @Path("/responder")
    @Produces(MediaType.APPLICATION_JSON)
    public Response responder(@QueryParam("estado") String estado,
            @QueryParam("nssP") String nssP,
            @QueryParam("nssM") String nssM) {
        sp.actualizarEstado(estado, nssP, nssM);
        return Response.ok("{\"status\":\"OK\"}")
                .type(MediaType.APPLICATION_JSON)
                .build();
    }

    // ServicioMedico pregunta si hay una solicitud aceptada vigente
    @GET
    @Path("/autorizacion")
    @Produces(MediaType.APPLICATION_JSON)
    public Response verificarAutorizacion(@QueryParam("nss") String nss,
            @QueryParam("idMedico") String idMedico) {
        boolean ok = sp.existeAceptadaVigente(nss, idMedico);
        if (ok) {
            return Response.ok("{\"autorizado\":true}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        } else {
            return Response.ok("{\"autorizado\":false}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }
}
