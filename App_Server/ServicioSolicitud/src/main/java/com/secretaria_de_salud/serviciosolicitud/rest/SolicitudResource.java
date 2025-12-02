/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.secretaria_de_salud.serviciosolicitud.rest;

import com.secretaria_de_salud.SolicitudAcceso;
import jakarta.ws.rs.Path;
import com.secretaria_de_salud.basedatosexpedienteclinico.SolicitudPersistencia;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
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
        return Response.ok("Se armo").build();
        /*if (paciente != null) {
            return Response.ok(paciente).build"Se armo"
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"contraseña o usuario incorrectos\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }*/
    }
    // Paciente ve sus solicitudes pendientes
    @GET
    @Path("/paciente/{nss}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarPorPaciente(@PathParam("nss") String nss) {
        List<SolicitudAcceso> lista = sp.listarPendientesPorPaciente(nss);
        return Response.ok(lista).build();
    }

    // Paciente responde (ACEPTADA/RECHAZADA)
    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response responder(@PathParam("id") String id, SolicitudAcceso dto) {
        if (dto.getEstado() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Falta estado\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
        sp.actualizarEstado(id, dto.getEstado());
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
        boolean ok = sp.existeAceptadaVigente(nss,idMedico);
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
