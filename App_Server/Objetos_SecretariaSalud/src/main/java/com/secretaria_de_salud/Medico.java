package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;
import org.bson.types.ObjectId;

/**
 * Representa a un Médico o profesional de la salud dentro del sistema.
 *
 * Esta clase almacena la información personal, profesional y de autenticación
 * del médico, incluyendo datos sensibles como la contraseña y la huella
 * biométrica para el acceso seguro.
 *
 *
 * @author Secretaria de Salud
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

    /**
     * Constructor vacío por defecto. Crea una instancia de Medico sin
     * inicializar sus atributos.
     */
    public Medico() {
    }

    /**
     * Constructor completo para inicializar un Médico con todos sus datos.
     *
     * * @param ID Identificador único de la base de datos.
     * @param nombre Nombre completo del médico.
     * @param correo Correo electrónico.
     * @param telefono Teléfono de contacto.
     * @param cedula Cédula profesional.
     * @param pwd Contraseña de acceso.
     * @param huella Datos de la huella dactilar.
     * @param fehcaNac Fecha de nacimiento.
     * @param nss Número de Seguridad Social.
     */
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

    /**
     * Obtiene el identificador único de MongoDB del médico.
     *
     * @return El objeto {@code ObjectId}.
     */
    public ObjectId getID() {
        return ID;
    }

    /**
     * Asigna un identificador único al médico.
     *
     * @param ID El nuevo {@code ObjectId}.
     */
    public void setID(ObjectId ID) {
        this.ID = ID;
    }

    /**
     * Obtiene el nombre completo del médico.
     *
     * @return El nombre como cadena de texto.
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre completo del médico.
     *
     * @param nombre El nombre a asignar.
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene el correo electrónico del médico.
     *
     * @return El correo electrónico.
     */
    public String getCorreo() {
        return correo;
    }

    /**
     * Establece el correo electrónico del médico.
     *
     * @param correo El nuevo correo electrónico.
     */
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    /**
     * Obtiene el número de teléfono del médico.
     *
     * @return El teléfono de contacto.
     */
    public String getTelefono() {
        return telefono;
    }

    /**
     * Establece el número de teléfono del médico.
     *
     * @param telefono El nuevo número de teléfono.
     */
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    /**
     * Obtiene la cédula profesional del médico.
     *
     * @return La cédula profesional.
     */
    public String getCedula() {
        return cedula;
    }

    /**
     * Establece la cédula profesional del médico.
     *
     * @param cedula La nueva cédula profesional.
     */
    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    /**
     * Obtiene la contraseña de acceso del médico.
     *
     * @return La contraseña.
     */
    public String getPwd() {
        return pwd;
    }

    /**
     * Establece la contraseña de acceso.
     *
     * @param pwd La nueva contraseña.
     */
    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    /**
     * Obtiene los datos biométricos de la huella dactilar.
     *
     * @return Un objeto {@code Binary} con la información de la huella.
     */
    public Binary getHuella() {
        return huella;
    }

    /**
     * Asigna los datos de la huella dactilar.
     *
     * @param huella El objeto {@code Binary} con la huella.
     */
    public void setHuella(Binary huella) {
        this.huella = huella;
    }

    /**
     * Obtiene la fecha de nacimiento del médico.
     *
     * @return Un objeto {@code Date} con la fecha de nacimiento.
     */
    public Date getFehcaNac() {
        return fehcaNac;
    }

    /**
     * Establece la fecha de nacimiento del médico.
     *
     * @param fehcaNac La nueva fecha de nacimiento.
     */
    public void setFehcaNac(Date fehcaNac) {
        this.fehcaNac = fehcaNac;
    }

    /**
     * Obtiene el Número de Seguridad Social (NSS) del médico.
     *
     * @return El NSS como cadena de texto.
     */
    public String getNss() {
        return nss;
    }

    /**
     * Establece el Número de Seguridad Social (NSS) del médico.
     *
     * @param nss El nuevo NSS.
     */
    public void setNss(String nss) {
        this.nss = nss;
    }

    /**
     * Retorna una representación en cadena de texto del Médico. Incluye ID,
     * nombre, correo, teléfono, cédula, contraseña, huella, fecha de nacimiento
     * y NSS.
     *
     * @return String con los detalles del médico.
     */
    @Override
    public String toString() {
        return "Medico{" + "ID=" + ID + ", nombre=" + nombre + ", correo=" + correo + ", telefono=" + telefono + ", cedula=" + cedula + ", contrase\u00f1a=" + pwd + ", huella=" + huella + ", fehcaNac=" + fehcaNac + ", nss=" + nss + '}';
    }
}
