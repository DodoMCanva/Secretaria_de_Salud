package com.mycompany.servicioexpediente.dto;

import java.util.Date;
import java.util.List;

/**
 *
 * @author dodo
 */
public class ExpedienteDto {

    private String nss;
    private Date ultModf;
    private List<DocumentoDto> pdfs;
    private List<DocumentoDto> imagenes;
    private List<String> recetas;

    public ExpedienteDto() {
    }

    public String getNss() {
        return nss;
    }

    public void setNss(String nss) {
        this.nss = nss;
    }

    public Date getUltModf() {
        return ultModf;
    }

    public void setUltModf(Date ultModf) {
        this.ultModf = ultModf;
    }

    public List<DocumentoDto> getPdfs() {
        return pdfs;
    }

    public void setPdfs(List<DocumentoDto> pdfs) {
        this.pdfs = pdfs;
    }

    public List<DocumentoDto> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<DocumentoDto> imagenes) {
        this.imagenes = imagenes;
    }

    public List<String> getRecetas() {
        return recetas;
    }

    public void setRecetas(List<String> recetas) {
        this.recetas = recetas;
    }
    
    
}
