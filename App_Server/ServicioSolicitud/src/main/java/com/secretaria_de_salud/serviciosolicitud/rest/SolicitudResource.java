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
 * Recurso RESTful para gestionar las Solicitudes de Acceso a Expedientes. Esta
 * clase expone la API para que el Middleware y otros microservicios puedan
 * interactuar con las solicitudes (creación, listado por paciente, respuesta, y
 * verificación de autorización).
 *
 * @autor Secretaria de Salud
 */
@Path("/solicitudes")
public class SolicitudResource {

    private SolicitudPersistencia sp = new SolicitudPersistencia();

    /**
     * Endpoint para que un médico cree una nueva solicitud de acceso a un
     * paciente.
     *
     * @param nssPaciente Número de Seguridad Social del paciente requerido.
     * @param nssMedico Número de Seguridad Social del médico solicitante.
     * @param motivo Razón breve de la solicitud.
     * @return {@code Response} con estado OK y confirmación de la creación.
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("/crear")
    @Produces(MediaType.APPLICATION_JSON)
    public Response crearSolicitud(@QueryParam("nssPaciente") String nssPaciente, @QueryParam("nssMedico") String nssMedico, @QueryParam("motivo") String motivo) {
        sp.crearSolicitud(nssPaciente, nssMedico, motivo);
        return Response.ok("Se creo solicitud").build();
    }

    /**
     * Endpoint para que un paciente liste todas las solicitudes pendientes
     * dirigidas a su NSS. Utilizado por el Portal del Paciente para mostrar las
     * peticiones de acceso pendientes.
     *
     * @param nss Número de Seguridad Social del paciente.
     * @return {@code Response} con una lista de objetos {@code SolicitudAcceso}
     * con status OK.
     */
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

    /**
     * Endpoint para que el paciente apruebe o rechace una solicitud de acceso.
     *
     * @param estado Nuevo estado a aplicar ("ACEPTADA" o "RECHAZADA").
     * @param nssP NSS del paciente que responde (para seguridad).
     * @param nssM NSS del médico afectado.
     * @return {@code Response} con el status OK de la operación.
     */
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

    /**
     * Endpoint de verificación utilizado por el Servicio del Médico para
     * comprobar si un médico tiene una solicitud previamente aceptada y vigente
     * para un NSS específico.
     *
     * @param nss NSS del paciente.
     * @param idMedico ID o NSS del médico que intenta acceder.
     * @return {@code Response} con {@code "autorizado":true} o
     * {@code "autorizado":false}.
     */
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
