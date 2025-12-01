    package com.secretaria_de_salud.serviciopaciente.rest;

    import com.secretaria_de_salud.Paciente;
    import com.secretaria_de_salud.basedatosexpedienteclinico.PacientePersistencia;
    import jakarta.ws.rs.GET;
    import jakarta.ws.rs.Path;
    import jakarta.ws.rs.Produces;
    import jakarta.ws.rs.QueryParam;
    import jakarta.ws.rs.core.MediaType;
    import jakarta.ws.rs.core.Response;

    @Path("/pacientes")
    public class PacienteResource { 

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
