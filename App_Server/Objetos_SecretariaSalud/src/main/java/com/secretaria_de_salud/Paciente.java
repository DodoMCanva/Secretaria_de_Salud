package com.secretaria_de_salud;

/**
 *
 * @author dodo
 */
public class Paciente {
    private String NSS;
    private String Nombre;

    public String getCURP() {
        return NSS;
    }

    public void setCurp(String CURP) {
        this.NSS = CURP;
    }

    public String getNombre() {
        return Nombre;
    }

    public void setNombre(String Nombre) {
        this.Nombre = Nombre;
    }
    
    
}
