package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.secretaria_de_salud.Expediente;
import com.secretaria_de_salud.Paciente;
import java.util.ArrayList;
import java.util.Date;

/**
 *
 * @author Secretaria de Salud
 */
public class Presets {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        PacientePersistencia p = new PacientePersistencia();
        //Limpiar expedientebd de mongo
        p.eliminarPacientes();
        //Agregar registros predeterminados
        Paciente p1 = new Paciente();
        p1.setNss("12345678901");
        p1.setNombre("Juan Pérez");
        p1.setCorreo("juan@example.com");
        p1.setTelefono("6441234567");
        p1.setCurp("JUAP800101HSONRN01");
        p1.setTipoSangre("O+");
        p1.setPwd("pwd123");
        p1.setHuella(null);
        p1.setTutor(null);
        p1.setNombreContEm("Madre");
        p1.setTelefonoContEm("9809787576");
        p1.setFehcaNac(new Date(1997, 12, 16));
        p1.setAlergias(new ArrayList<String>());
        p1.setExp(new Expediente());
        p.agregarPaciente(p1);
        
        Paciente p2 = new Paciente();
        p2.setNss("423482374");
        p2.setNombre("Maria Hinojosa");
        p2.setCorreo("mari@example.com");
        p2.setTelefono("644213213");
        p2.setCurp("MARIE73470324HR3");
        p2.setTipoSangre("A+");
        p2.setPwd("123pwd");
        p2.setHuella(null);
        p2.setTutor(null);
        p2.setNombreContEm("Jose");
        p2.setTelefonoContEm("128738927");
        p2.setFehcaNac(new Date(1999, 6, 3));
        ArrayList<String> alergias = new ArrayList<String>();
        alergias.add("Cacahuate");
        alergias.add("Gatos");
        p2.setAlergias(alergias);
        p2.setExp(new Expediente());
        
        p.agregarPaciente(p2);
    }

}
