package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.bson.types.Binary;
import org.bson.types.ObjectId;

/**
 * Representa el Expediente Clínico de un paciente.
 *
 * Esta clase actúa como un contenedor digital para almacenar el historial
 * médico, incluyendo documentos escaneados (PDFs), imágenes médicas
 * (radiografías, etc.) y recetas emitidas.
 *
 * Se vincula con un {@link Paciente} específico a través del Número de
 * Seguridad Social (NSS).
 *
 *
 * @author Secretaria de Salud
 */
public class Expediente {

    private ObjectId ID;
    private String nss;
    private Date ultModf;
    private List<Binary> pdfs;
    private List<Binary> imagenes;
    private List<String> recetas;

    /**
     * Constructor vacío por defecto. Inicializa una instancia de Expediente sin
     * datos.
     */
    public Expediente() {
    }

    /**
     * Obtiene el identificador único de MongoDB del expediente.
     *
     * @return El objeto {@code ObjectId} asignado por la base de datos.
     */
    public ObjectId getID() {
        return ID;
    }

    /**
     * Asigna un identificador único al expediente.
     *
     * @param ID El nuevo {@code ObjectId}.
     */
    public void setID(ObjectId ID) {
        this.ID = ID;
    }

    /**
     * Obtiene el NSS del paciente dueño de este expediente.
     *
     * @return El Número de Seguridad Social como cadena de texto.
     */
    public String getNss() {
        return nss;
    }

    /**
     * Asigna el expediente a un paciente específico mediante su NSS.
     *
     * @param nss El Número de Seguridad Social del paciente.
     */
    public void setNss(String nss) {
        this.nss = nss;
    }

    /**
     * Obtiene la fecha y hora de la última vez que se modificó el expediente.
     *
     * @return Un objeto {@code Date} con la marca de tiempo.
     */
    public Date getUltModf() {
        return ultModf;
    }

    /**
     * Actualiza la fecha de última modificación. Se debe llamar cada vez que se
     * agrega o elimina contenido del expediente.
     *
     * @param ultModf La nueva fecha de modificación.
     */
    public void setUltModf(Date ultModf) {
        this.ultModf = ultModf;
    }

    /**
     * Obtiene la lista de documentos PDF almacenados.
     *
     * @return Una lista de objetos {@code Binary} que contienen los datos de
     * los archivos PDF.
     */
    public List<Binary> getPdfs() {
        return pdfs;
    }

    /**
     * Asigna la lista de documentos PDF al expediente.
     *
     * @param pdfs La lista de archivos binarios (PDFs) a guardar.
     */
    public void setPdfs(List<Binary> pdfs) {
        this.pdfs = pdfs;
    }

    /**
     * Obtiene la lista de imágenes médicas almacenadas.
     *
     * @return Una lista de objetos {@code Binary} con los datos de las
     * imágenes.
     */
    public List<Binary> getImagenes() {
        return imagenes;
    }

    /**
     * Asigna la lista de imágenes médicas al expediente.
     *
     * @param imagenes La lista de archivos binarios (imágenes) a guardar.
     */
    public void setImagenes(List<Binary> imagenes) {
        this.imagenes = imagenes;
    }

    /**
     * Obtiene la lista de recetas médicas.
     *
     * @return Una lista de cadenas de texto con el contenido de las recetas.
     */
    public List<String> getRecetas() {
        return recetas;
    }

    /**
     * Asigna la lista de recetas médicas al expediente.
     *
     * @param recetas La lista de textos de recetas a guardar.
     */
    public void setRecetas(List<String> recetas) {
        this.recetas = recetas;
    }
}
