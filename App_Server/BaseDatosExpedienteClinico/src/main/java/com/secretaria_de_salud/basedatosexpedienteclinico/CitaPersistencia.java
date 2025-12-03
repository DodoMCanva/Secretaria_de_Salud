package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.secretaria_de_salud.Cita;
import java.util.List;
import org.bson.types.ObjectId;

/**
 * Clase responsable de gestionar la persistencia de las citas médicas
 * almacenadas en la base de datos del expediente clínico. Esta clase define los
 * métodos necesarios para consultar las citas asociadas tanto a un paciente
 * como a un médico.
 *
 * @author Secretaría de Salud
 */
public class CitaPersistencia {

    /**
     * Consulta todas las citas asociadas a un paciente específico.
     *
     * @param paciente ObjectId correspondiente al paciente del cual se desean
     * obtener las citas.
     * @return una lista de objetos pertenecientes al paciente. En caso de no
     * existir citas o no encontrarse el paciente, puede retornar una lista
     * vacía.
     */
    public List<Cita> consultarCitasPaciente(ObjectId paciente) {
        return null;
    }

    /**
     * Consulta todas las citas asignadas a un médico en particular.
     *
     * @param medico ObjectId del médico del cual se desean consultar las citas
     * programadas.
     * @return una lista de objetos correspondientes a las citas
     * del médico. En caso de no existir citas registradas, la lista puede ser
     * vacía.
     */
    public List<Cita> consultarCitasMedico(ObjectId medico) {
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
