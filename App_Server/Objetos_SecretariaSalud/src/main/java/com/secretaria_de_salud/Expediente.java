package com.secretaria_de_salud;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.bson.types.Binary;

/**
 *
 * @author Secretaria de Salud
 */
public class Expediente {

    private Date ultModf;
    private List<Binary> pdfs;
    private List<Binary> imagenes;
    private List<String> recetas;

    public Expediente() {
    }

    public Date getUltModf() {
        return ultModf;
    }

    public void setUltModf(Date ultModf) {
        this.ultModf = ultModf;
    }

    public List<Binary> getPdfs() {
        return pdfs;
    }

    public void setPdfs(List<Binary> pdfs) {
        this.pdfs = pdfs;
    }

    public List<Binary> getImagenes() {
        return imagenes;
    }

    public void setImagenes(List<Binary> imagenes) {
        this.imagenes = imagenes;
    }

    public List<String> getRecetas() {
        return recetas;
    }

    public void setRecetas(List<String> recetas) {
        this.recetas = recetas;
    }
}
