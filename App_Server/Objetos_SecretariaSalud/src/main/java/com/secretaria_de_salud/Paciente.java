package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;
import org.bson.types.ObjectId;

/**
 * Representa a un Paciente o derechohabiente dentro del Sistema de Salud. Esta
 * clase contiene toda la información demográfica, de contacto y médica básica
 * del paciente, así como datos de seguridad (contraseña, huella) y de contacto
 * en caso de emergencia.
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

    /**
     * Constructor vacío por defecto. Crea una instancia de Paciente sin
     * inicializar sus atributos.
     */
    public Paciente() {
    }

    /**
     * Constructor completo para inicializar un Paciente con todos sus datos.
     *
     * @param ID Identificador único de la base de datos.
     * @param nss Número de Seguridad Social.
     * @param nombre Nombre completo.
     * @param correo Correo electrónico.
     * @param telefono Teléfono personal.
     * @param curp Clave Única de Registro de Población.
     * @param tipoSangre Tipo de sangre.
     * @param pwd Contraseña de acceso.
     * @param huella Datos de la huella dactilar.
     * @param fehcaNac Fecha de nacimiento.
     * @param tutor ID del tutor legal (opcional).
     * @param nombreContEm Nombre del contacto de emergencia.
     * @param telefonoContEm Teléfono del contacto de emergencia.
     * @param alergias Lista de alergias.
     * @param exp Objeto expediente asociado (Nota: Actualmente no se asigna en
     * este constructor).
     */
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

    /**
     * Obtiene el identificador único de MongoDB del paciente.
     *
     * @return El objeto {@code ObjectId}.
     */
    public ObjectId getID() {
        return ID;
    }

    /**
     * Asigna un identificador único al paciente.
     *
     * @param ID El nuevo {@code ObjectId}.
     */
    public void setID(ObjectId ID) {
        this.ID = ID;
    }

    /**
     * Obtiene el Número de Seguridad Social (NSS).
     *
     * @return El NSS como cadena de texto.
     */
    public String getNss() {
        return nss;
    }

    /**
     * Establece el Número de Seguridad Social (NSS).
     *
     * @param nss El nuevo NSS.
     */
    public void setNss(String nss) {
        this.nss = nss;
    }

    /**
     * Obtiene el nombre completo del paciente.
     *
     * @return El nombre.
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre completo del paciente.
     *
     * @param nombre El nombre a asignar.
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene el correo electrónico del paciente.
     *
     * @return El correo electrónico.
     */
    public String getCorreo() {
        return correo;
    }

    /**
     * Establece el correo electrónico del paciente.
     *
     * @param correo El nuevo correo.
     */
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    /**
     * Obtiene el teléfono personal del paciente.
     *
     * @return El número de teléfono.
     */
    public String getTelefono() {
        return telefono;
    }

    /**
     * Establece el teléfono personal del paciente.
     *
     * @param telefono El nuevo número de teléfono.
     */
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    /**
     * Obtiene la CURP del paciente.
     *
     * @return La CURP como cadena de texto.
     */
    public String getCurp() {
        return curp;
    }

    /**
     * Establece la CURP del paciente.
     *
     * @param curp La nueva CURP.
     */
    public void setCurp(String curp) {
        this.curp = curp;
    }

    /**
     * Obtiene el tipo de sangre del paciente.
     *
     * @return El tipo de sangre (ej. "O+").
     */
    public String getTipoSangre() {
        return tipoSangre;
    }

    /**
     * Establece el tipo de sangre del paciente.
     *
     * @param tipoSangre El nuevo tipo de sangre.
     */
    public void setTipoSangre(String tipoSangre) {
        this.tipoSangre = tipoSangre;
    }

    /**
     * Obtiene la contraseña de acceso.
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
     * Obtiene los datos biométricos de la huella.
     *
     * @return Un objeto {@code Binary} con la huella.
     */
    public Binary getHuella() {
        return huella;
    }

    /**
     * Asigna los datos de la huella biométrica.
     *
     * @param huella El objeto {@code Binary} con la huella.
     */
    public void setHuella(Binary huella) {
        this.huella = huella;
    }

    /**
     * Obtiene la fecha de nacimiento.
     *
     * @return Un objeto {@code Date}.
     */
    public Date getFehcaNac() {
        return fehcaNac;
    }

    /**
     * Establece la fecha de nacimiento.
     *
     * @param fehcaNac La nueva fecha de nacimiento.
     */
    public void setFehcaNac(Date fehcaNac) {
        this.fehcaNac = fehcaNac;
    }

    /**
     * Obtiene el ID del tutor legal.
     *
     * @return El {@code ObjectId} del tutor.
     */
    public ObjectId getTutor() {
        return tutor;
    }

    /**
     * Asigna un tutor legal al paciente.
     *
     * @param tutor El ID del tutor.
     */
    public void setTutor(ObjectId tutor) {
        this.tutor = tutor;
    }

    /**
     * Obtiene el nombre del contacto de emergencia.
     *
     * @return El nombre del contacto.
     */
    public String getNombreContEm() {
        return nombreContEm;
    }

    /**
     * Establece el nombre del contacto de emergencia.
     *
     * @param nombreContEm El nombre a asignar.
     */
    public void setNombreContEm(String nombreContEm) {
        this.nombreContEm = nombreContEm;
    }

    /**
     * Obtiene el teléfono del contacto de emergencia.
     *
     * @return El teléfono de emergencia.
     */
    public String getTelefonoContEm() {
        return telefonoContEm;
    }

    /**
     * Establece el teléfono del contacto de emergencia.
     *
     * @param telefonoContEm El nuevo teléfono de emergencia.
     */
    public void setTelefonoContEm(String telefonoContEm) {
        this.telefonoContEm = telefonoContEm;
    }

    /**
     * Obtiene la lista de alergias del paciente.
     *
     * @return Un {@code ArrayList<String>} con las alergias.
     */
    public ArrayList<String> getAlergias() {
        return alergias;
    }

    /**
     * Asigna la lista de alergias.
     *
     * @param alergias La nueva lista de alergias.
     */
    public void setAlergias(ArrayList<String> alergias) {
        this.alergias = alergias;
    }

    /**
     * Retorna una representación en cadena de texto del Paciente. Incluye todos
     * los atributos principales para facilitar la depuración.
     *
     * @return String con los detalles del paciente.
     */
    @Override
    public String toString() {
        return "Paciente{" + "ID=" + ID + ", nss=" + nss + ", nombre=" + nombre + ", correo=" + correo + ", telefono=" + telefono + ", curp=" + curp + ", tipoSangre=" + tipoSangre + ", contrase\u00f1a=" + pwd + ", huella=" + huella + ", fehcaNac=" + fehcaNac + ", tutor=" + tutor + ", nombreContEm=" + nombreContEm + ", telefonoContEm=" + telefonoContEm + ", alergias=" + alergias + '}';
    }
}
