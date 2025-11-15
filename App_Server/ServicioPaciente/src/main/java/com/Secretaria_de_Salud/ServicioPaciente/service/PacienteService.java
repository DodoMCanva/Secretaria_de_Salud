package com.Secretaria_de_Salud.ServicioPaciente.service;

import com.secretaria_de_salud.Paciente;

/**
 *
 * @author F
 */
public class PacienteService {
    // Simulación base de datos. En un real, accedes a BD:
        public Paciente buscarPorCurp(String curp) {
        // Aquí iría la consulta real
        if ("ABCD123456HDFRLR09".equals(curp)) {
            Paciente p = new Paciente();
            p.setCurp(curp);
            p.setNombre("Juan Perez");
            return p;
        }
        return null;
    }
}
