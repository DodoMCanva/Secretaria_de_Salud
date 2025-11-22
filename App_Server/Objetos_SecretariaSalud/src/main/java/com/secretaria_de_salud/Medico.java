/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;

/**
 *
 * @author pauli
 */
public class Medico {
    private String ID;
    private String nombre;
    private String correo;
    private String telefono;
    private String cedula;
    private String contraseña;
    private Binary huella;
    private Date fehcaNac;

    public Medico() {
    }

    public Medico(String ID, String nombre, String correo, String telefono, String cedula, String contraseña, Date fehcaNac) {
        this.ID = ID;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.cedula = cedula;
        this.contraseña = contraseña;
        this.fehcaNac = fehcaNac;
    }

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
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

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
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

    @Override
    public String toString() {
        return "Medico{" + "ID=" + ID + ", nombre=" + nombre + ", correo=" + correo + ", telefono=" + telefono + ", cedula=" + cedula + ", contrase\u00f1a=" + contraseña + ", huella=" + huella + ", fehcaNac=" + fehcaNac + '}';
    }

    
    
}
