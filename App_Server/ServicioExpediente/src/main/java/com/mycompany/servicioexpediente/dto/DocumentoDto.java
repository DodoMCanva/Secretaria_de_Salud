package com.mycompany.servicioexpediente.dto;

/**
 * Clase DTO utilizada para la transferencia de archivos binarios (documentos,
 * imágenes, etc.) en un formato apto para ser enviado y recibido a través de la
 * web, típicamente como respuesta de un servicio REST.
 *
 *
 * @author Secretaria de SaludDS
 */
public class DocumentoDto {

    private String nombre;
    private String tipo;
    private String contenidoBase64;

    /**
     * Constructor vacío por defecto.
     */
    public DocumentoDto() {
    }

    /**
     * Obtiene el nombre del documento.
     *
     * @return El nombre del archivo.
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Establece el nombre del documento.
     *
     * @param nombre El nombre del archivo.
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Obtiene el tipo o MIME Type del documento.
     *
     * @return El tipo del archivo (ej. "application/pdf").
     */
    public String getTipo() {
        return tipo;
    }

    /**
     * Establece el tipo o MIME Type del documento.
     *
     * @param tipo El tipo del archivo.
     */
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    /**
     * Obtiene el contenido del documento codificado en Base64.
     *
     * @return La cadena Base64 que representa los datos binarios del archivo.
     */
    public String getContenidoBase64() {
        return contenidoBase64;
    }

    /**
     * Establece el contenido del documento codificado en Base64.
     *
     * @param contenidoBase64 La cadena Base64 con el contenido binario.
     */
    public void setContenidoBase64(String contenidoBase64) {
        this.contenidoBase64 = contenidoBase64;
    }

}
