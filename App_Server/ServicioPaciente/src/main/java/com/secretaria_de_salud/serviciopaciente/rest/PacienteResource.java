package com.secretaria_de_salud.serviciopaciente.rest;

import com.secretaria_de_salud.Paciente;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/pacientes")
public class PacienteResource { 
    @GET
    @Path("/buscar")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarPorCurp(@QueryParam("curp") String curp) {
        if ("TESTCURP".equals(curp)) {
            Paciente paciente = new Paciente();
            paciente.setNombre("Demo");
            return Response.ok(paciente).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                .entity("{\"error\":\"Paciente no encontrado\"}")
                .type(MediaType.APPLICATION_JSON)
                .build();
        }
    }

}