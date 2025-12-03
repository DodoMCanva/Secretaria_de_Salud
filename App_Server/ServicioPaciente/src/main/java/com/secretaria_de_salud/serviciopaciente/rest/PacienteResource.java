package com.secretaria_de_salud.serviciopaciente.rest;

import com.secretaria_de_salud.Paciente;
import com.secretaria_de_salud.basedatosexpedienteclinico.PacientePersistencia;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Recurso RESTful para manejar las peticiones de inicio de sesión y
 * autenticación relacionadas con el Portal del Paciente. Este recurso expone un
 * endpoint de login que permite al paciente autenticarse mediante su Número de
 * Seguridad Social (NSS) y su contraseña.
 *
 * @autor Secretaria de Salud
 */
@Path("/pacientes")
public class PacienteResource {

    /**
     * Endpoint para la autenticación de un paciente. Recibe el NSS y la
     * contraseña, y delega en la capa de persistencia
     * ({@code PacientePersistencia}) para verificar las credenciales en la base
     * de datos.
     *
     * @param nss El Número de Seguridad Social del paciente.
     * @param pwd La contraseña de acceso.
     * @return {@code Response} con el objeto {@code Paciente} si las
     * credenciales son válidas (200 OK), o un mensaje de error si las
     * credenciales son incorrectas (404 NOT_FOUND).
     */
    @GET
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@QueryParam("nss") String nss, @QueryParam("pwd") String pwd) {
        System.out.println("Llegamos aca");
        Paciente paciente = new PacientePersistencia().login(nss, pwd);
        if (paciente != null) {
            return Response.ok(paciente).build();
        } else {
            System.out.println("nss: [" + nss + "]");
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"contraseña o usuario incorrectos\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }

}
