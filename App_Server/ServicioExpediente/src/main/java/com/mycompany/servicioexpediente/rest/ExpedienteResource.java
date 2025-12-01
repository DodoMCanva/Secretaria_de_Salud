
package com.mycompany.servicioexpediente.rest;

import com.secretaria_de_salud.Expediente;
import com.secretaria_de_salud.basedatosexpedienteclinico.ExpedientePersistencia;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/expedientes")
public class ExpedienteResource { 
    
    @GET
    @Path("/consultar")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@QueryParam("nss") String nss) {
        System.out.println("Llegamos aca");
        Expediente expediente = new ExpedientePersistencia().consultarExpedientePorNss(nss);
        if (expediente != null) { 
            return Response.ok(expediente).build();
        } else {
            System.out.println("nss: [" + nss + "]");
            return Response.status(Response.Status.NOT_FOUND)
                .entity("{\"error\":\"contraseña o usuario incorrectos\"}")
                .type(MediaType.APPLICATION_JSON)
                .build();
        }
    }
    
}
