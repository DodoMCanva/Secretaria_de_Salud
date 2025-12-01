package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;
import org.bson.types.ObjectId;

/**
 *
 * @author Secretaria de Salud
 */
public class Paciente {

    //Cargar local
    private ObjectId ID;
    private String nss, nombre, correo, telefono, curp, tipoSangre, nombreContEm, telefonoContEm;
    private ArrayList<String> alergias;

    //No cargar completamente
    private Binary huella;
    private Date fehcaNac;
    private ObjectId tutor;
    private String pwd;

    public Paciente() {
    }

    public Paciente(ObjectId ID,
            String nss,
            String nombre,
            String correo,
            String telefono,
            String curp,
            String tipoSangre,
            String pwd,
            Binary huella,
            Date fehcaNac,
            ObjectId tutor,
            String nombreContEm,
            String telefonoContEm,
            ArrayList<String> alergias,
            Expediente exp) {
        this.ID = ID;
        this.nss = nss;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.curp = curp;
        this.tipoSangre = tipoSangre;
        this.pwd = pwd;
        this.huella = huella;
        this.fehcaNac = fehcaNac;
        this.tutor = tutor;
        this.nombreContEm = nombreContEm;
        this.telefonoContEm = telefonoContEm;
        this.alergias = alergias;
    }

    public ObjectId getID() {
        return ID;
    }

    public void setID(ObjectId ID) {
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

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public Binary getHuella() {
        return huella;
    }

    public void setHuella(Binary huella) {
        this.huella = huella;
    }

    public Date getFehcaNac() {
        return fehcaNac;
    }

    public void setFehcaNac(Date fehcaNac) {
        this.fehcaNac = fehcaNac;
    }

    public ObjectId getTutor() {
        return tutor;
    }

    public void setTutor(ObjectId tutor) {
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

    public ArrayList<String> getAlergias() {
        return alergias;
    }

    public void setAlergias(ArrayList<String> alergias) {
        this.alergias = alergias;
    }

    @Override
    public String toString() {
        return "Paciente{" + "ID=" + ID + ", nss=" + nss + ", nombre=" + nombre + ", correo=" + correo + ", telefono=" + telefono + ", curp=" + curp + ", tipoSangre=" + tipoSangre + ", contrase\u00f1a=" + pwd + ", huella=" + huella + ", fehcaNac=" + fehcaNac + ", tutor=" + tutor + ", nombreContEm=" + nombreContEm + ", telefonoContEm=" + telefonoContEm + ", alergias=" + alergias + '}';
    }

}
