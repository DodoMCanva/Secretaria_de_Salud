package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.secretaria_de_salud.Cita;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author Secretaria de Salud
 */
public class CitaPersistencia {
    
    
    public List<Cita> consultarCitasPaciente(ObjectId paciente){
        return null;
    }
    
    public List<Cita> consultarCitasMedico(ObjectId medico){
        return null;
    }
    
    /*
    public void close() {
        if (client != null) {
            client.close();
            System.out.println("Conexión a MongoDB cerrada.");
        }
    }*/
    
    
    
}
