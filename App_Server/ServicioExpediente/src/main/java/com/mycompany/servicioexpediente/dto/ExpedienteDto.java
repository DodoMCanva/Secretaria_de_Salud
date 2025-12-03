package com.mycompany.servicioexpediente.dto;

import java.util.Date;
import java.util.List;

/**
 * Clase DTO (Data Transfer Object) que representa una vista parcial o completa
 * del Expediente Clínico de un paciente para su transferencia a través de
 * servicios REST. Su propósito es agrupar la información esencial del
 * expediente (metadatos, documentos, recetas) utilizando el formato
 * {@code DocumentoDto} para los archivos binarios.
 *
 * @author Secretaria de Salud
 */
public class ExpedienteDto {

    private String nss;
    private Date ultModf;
    private List<DocumentoDto> pdfs;
    private List<DocumentoDto> imagenes;
    private List<String> recetas;

    /**
     * Constructor vacío por defecto.
     * Inicializa una instancia de ExpedienteDto.
     */
    public ExpedienteDto() {
    }

    /**
     * Obtiene el Número de Seguridad Social (NSS) del paciente.
     * @return El NSS como cadena de texto.
     */
    public String getNss() {
        return nss;
    }

    /**
     * Establece el Número de Seguridad Social (NSS) del paciente.
     * @param nss El NSS a asignar.
     */
    public void setNss(String nss) {
        this.nss = nss;
    }

    /**
     * Obtiene la fecha de la última modificación.
     * @return Un objeto {@code Date} con la marca de tiempo de la última modificación.
     */
    public Date getUltModf() {
        return ultModf;
    }

    /**
     * Establece la fecha de la última modificación.
     * @param ultModf La nueva fecha de modificación.
     */
    public void setUltModf(Date ultModf) {
        this.ultModf = ultModf;
    }

    /**
     * Obtiene la lista de documentos PDF.
     * @return La lista de objetos {@code DocumentoDto} correspondientes a los archivos PDF.
     */
    public List<DocumentoDto> getPdfs() {
        return pdfs;
    }

    /**
     * Establece la lista de documentos PDF.
     * @param pdfs La lista de {@code DocumentoDto} de los archivos PDF.
     */
    public void setPdfs(List<DocumentoDto> pdfs) {
        this.pdfs = pdfs;
    }

    /**
     * Obtiene la lista de imágenes médicas.
     * @return La lista de objetos {@code DocumentoDto} correspondientes a las imágenes.
     */
    public List<DocumentoDto> getImagenes() {
        return imagenes;
    }

    /**
     * Establece la lista de imágenes médicas.
     * @param imagenes La lista de {@code DocumentoDto} de las imágenes.
     */
    public void setImagenes(List<DocumentoDto> imagenes) {
        this.imagenes = imagenes;
    }

    /**
     * Obtiene la lista de recetas médicas.
     * @return La lista de cadenas de texto con el contenido de las recetas.
     */
    public List<String> getRecetas() {
        return recetas;
    }

    /**
     * Establece la lista de recetas médicas.
     * @param recetas La lista de textos de recetas.
     */
    public void setRecetas(List<String> recetas) {
        this.recetas = recetas;
    }

}
