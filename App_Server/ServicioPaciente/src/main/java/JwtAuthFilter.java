
import io.jsonwebtoken.*;
import jakarta.ws.rs.container.*;
import jakarta.ws.rs.core.*;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class JwtAuthFilter implements ContainerRequestFilter {

    private static final String SECRET = "cesvalferpaukimivsectrsalud!!@##";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        System.out.println("Path en filtro: [" + path + "]");

        // IGNORAR login
        if (path.equals("pacientes/login") || path.endsWith("pacientes/login")) {
            System.out.println("Saltando filtro JWT para login");
            return;
        }

        String authHeader = requestContext.getHeaderString("Authorization");
        System.out.println("Auth header recibido en filtro: [" + authHeader + "]");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            abort(requestContext, "Falta el token JWT");
            return;
        }

        String jwt = authHeader.substring("Bearer ".length());
        try {
            System.out.println("Intentando validar JWT: " + jwt);
            Jwts.parserBuilder()
                    .setSigningKey(SECRET.getBytes())
                    .build()
                    .parseClaimsJws(jwt);
            System.out.println("JWT válido");
        } catch (JwtException e) {
            System.out.println("JWT inválido: " + e.getMessage());
            abort(requestContext, "Token inválido o expirado: " + e.getMessage());
        }
    }

    private void abort(ContainerRequestContext ctx, String msg) {
        System.out.println("Aborto");
        ctx.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                .entity("{\"error\":\"" + msg + "\"}")
                .type(MediaType.APPLICATION_JSON)
                .build());
    }
}
