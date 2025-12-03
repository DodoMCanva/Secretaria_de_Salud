package com.secretaria_de_salud.serviciomedico.rest;

import com.secretaria_de_salud.Medico;
import com.secretaria_de_salud.Paciente;
import com.secretaria_de_salud.basedatosexpedienteclinico.MedicoPersistencia;
import com.secretaria_de_salud.basedatosexpedienteclinico.PacientePersistencia;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.client.*;
import org.glassfish.jersey.client.JerseyClientBuilder;

/**
 * Recurso RESTful para manejar las peticiones de inicio de sesión y
 * autenticación relacionadas con el personal médico. Expone endpoints clave
 * como {@code /login} y podría manejar la obtención de expedientes autorizados
 * (actualmente comentado).
 *
 * @version 1.0
 */
@Path("/medicos")
public class MedicoResource {

    /**
     * Endpoint para la autenticación de un médico. Recibe el Número de
     * Seguridad Social  y la contraseña  y utiliza la capa de
     * persistencia para verificar las credenciales.
     *
     * @param nss El Número de Seguridad Social del médico.
     * @param pwd La contraseña de acceso.
     * @return {@code Response} con los datos del médico o un mensaje
     * de error si las credenciales son incorrectas.
     */
    @GET
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@QueryParam("nss") String nss, @QueryParam("pwd") String pwd) {
        System.out.println("Llegamos a login medico");
        Medico medico = new MedicoPersistencia().login(nss, pwd);
        if (medico != null) {
            return Response.ok(medico).build();
        } else {
            System.out.println("nss: [" + nss + "]");
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"contraseña o usuario incorrectos\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }

    /*
      // ServicioMedico NO crea solicitudes, solo revisa permiso y devuelve expediente
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response obtenerExpediente(@QueryParam("nss") String nss,
                                      @QueryParam("idMedico") String idMedico) {

        // 1. Llamar a ServicioSolicitud para ver si está autorizado
        Client client = JerseyClientBuilder.createClient();
        String url = "http://localhost:8080/ServicioSolicitud/resources/solicitudes/autorizacion";
        Response r = client.target(url)
                .queryParam("nss", nss)
                .queryParam("idMedico", idMedico)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get();

        if (r.getStatus() != 200) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error consultando servicio de solicitudes\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
        String body = r.readEntity(String.class);
        if (!body.contains("\"autorizado\":true")) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("{\"error\":\"No tiene autorización del paciente\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }

        // 2. Ya autorizado → traer paciente (desde Mongo o vía tu canal MQTT/Middleware)
        Paciente p = new PacientePersistencia().buscarPaciente(nss);
        if (p == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\":\"Paciente no encontrado\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
        return Response.ok(p).build();
    }*/
}
