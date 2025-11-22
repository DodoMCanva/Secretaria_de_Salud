package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;

/**
 *
 * @author dodo
 */
public class Paciente {
    private String ID;
    private String nss;
    private String nombre;
    private String correo;
    private String telefono;
    private String curp;
    private String tipoSangre;
    private String contraseña;
    private Binary huella;
    private Date fehcaNac;
    private Paciente tutor;
    private String nombreContEm;
    private String telefonoContEm;
    private ArrayList alergias;

    public Paciente() {
    }

    public Paciente(String ID) {
        this.ID = ID;
    }

    public Paciente(String ID, String nss, String nombre, String correo, String telefono, String curp, String tipoSangre, String contraseña, Date fehcaNac, Paciente tutor, String nombreContEm, String telefonoContEm, ArrayList alergias) {
        this.ID = ID;
        this.nss = nss;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.curp = curp;
        this.tipoSangre = tipoSangre;
        this.contraseña = contraseña;
        this.fehcaNac = fehcaNac;
        this.tutor = tutor;
        this.nombreContEm = nombreContEm;
        this.telefonoContEm = telefonoContEm;
        this.alergias = alergias;
    }





    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getNss() {
        return nss;
    }

    public void setNss(String nss) {
        this.nss = nss;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCurp() {
        return curp;
    }

    public void setCurp(String curp) {
        this.curp = curp;
    }

    public String getTipoSangre() {
        return tipoSangre;
    }

    public void setTipoSangre(String tipoSangre) {
        this.tipoSangre = tipoSangre;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public Date getFehcaNac() {
        return fehcaNac;
    }

    public void setFehcaNac(Date fehcaNac) {
        this.fehcaNac = fehcaNac;
    }

    public Paciente getTutor() {
        return tutor;
    }

    public void setTutor(Paciente tutor) {
        this.tutor = tutor;
    }

    public String getNombreContEm() {
        return nombreContEm;
    }

    public void setNombreContEm(String nombreContEm) {
        this.nombreContEm = nombreContEm;
    }

    public String getTelefonoContEm() {
        return telefonoContEm;
    }

    public void setTelefonoContEm(String telefonoContEm) {
        this.telefonoContEm = telefonoContEm;
    }

    public ArrayList getAlergias() {
        return alergias;
    }

    public void setAlergias(ArrayList alergias) {
        this.alergias = alergias;
    }

    public Binary getHuella() {
        return huella;
    }

    public void setHuella(Binary huella) {
        this.huella = huella;
    }

    @Override
    public String toString() {
        return "Paciente{" + "ID=" + ID + ", nss=" + nss + ", nombre=" + nombre + ", correo=" + correo + ", telefono=" + telefono + ", curp=" + curp + ", tipoSangre=" + tipoSangre + ", contrase\u00f1a=" + contraseña + ", huella=" + huella + ", fehcaNac=" + fehcaNac + ", tutor=" + tutor + ", nombreContEm=" + nombreContEm + ", telefonoContEm=" + telefonoContEm + ", alergias=" + alergias + '}';
    }

    




    

    
}
