package com.mycompany.servicioexpediente.dto;

/**
 *
 * @author dodo
 */
public class DocumentoDto {

    private String nombre;
    private String tipo;
    private String contenidoBase64;

    public DocumentoDto() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getContenidoBase64() {
        return contenidoBase64;
    }

    public void setContenidoBase64(String contenidoBase64) {
        this.contenidoBase64 = contenidoBase64;
    }
    
    
}
