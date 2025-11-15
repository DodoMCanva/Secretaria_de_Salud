package com.Secretaria_de_Salud.ServicioPaciente.rest;

import com.Secretaria_de_Salud.ServicioPaciente.service.PacienteService;
import com.secretaria_de_salud.Paciente;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/pacientes")
public class PacienteResource {

    @Context
    private HttpHeaders headers;

    private PacienteService service = new PacienteService();

    @GET
    @Path("/buscar")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarPorCurp(@QueryParam("curp") String curp) {
        // Validación simple JWT (reemplaza por tu lógica segura)
        String auth = headers.getHeaderString("Authorization");
        //if (auth == null || !JwtUtil.isValid(auth.replace("Bearer ", ""))) {
        //    return Response.status(Response.Status.UNAUTHORIZED).build();
        //}
        Paciente paciente = service.buscarPorCurp(curp);
        if (paciente != null) {
            return Response.ok(paciente).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}
