package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;
import org.bson.types.ObjectId;

/**
 *
 * @author pauli
 */
public class Medico {
    private ObjectId ID;
    private String nombre;
    private String correo;
    private String telefono;
    private String cedula;
    private String pwd;
    private Binary huella;
    private Date fehcaNac;
    private String nss;

    public Medico() {
    }

    public Medico(ObjectId ID, String nombre, String correo, String telefono, String cedula, String pwd, Binary huella, Date fehcaNac, String nss) {
        this.ID = ID;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.cedula = cedula;
        this.pwd = pwd;
        this.huella = huella;
        this.fehcaNac = fehcaNac;
        this.nss = nss;
    }

   
    

    public ObjectId getID() {
        return ID;
    }

    public void setID(ObjectId ID) {
        this.ID = ID;
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

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
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

    public String getNss() {
        return nss;
    }

    public void setNss(String nss) {
        this.nss = nss;
    }

    @Override
    public String toString() {
        return "Medico{" + "ID=" + ID + ", nombre=" + nombre + ", correo=" + correo + ", telefono=" + telefono + ", cedula=" + cedula + ", contrase\u00f1a=" + pwd + ", huella=" + huella + ", fehcaNac=" + fehcaNac + ", nss=" + nss + '}';
    }
        
    

    
    
}
