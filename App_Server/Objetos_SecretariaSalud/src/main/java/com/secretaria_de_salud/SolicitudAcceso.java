/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.secretaria_de_salud;
// Objetos_SecretariaSalud/src/main/java/com/secretaria_de_salud/SolicitudAcceso.java

import java.util.Date;
import org.bson.types.ObjectId;

public class SolicitudAcceso {

    private ObjectId id;          // _id en Mongo
    private String nssPaciente;   // Paciente al que se quiere acceder
    private String idMedico;      // Identificador del médico (puede ser nss, cedula, user)
    private String estado;        // PENDIENTE, ACEPTADA, RECHAZADA
    private Date fechaSolicitud;
    private Date fechaRespuesta;  // null mientras está pendiente
    private String motivo;        // opcional

    public SolicitudAcceso() {}

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getNssPaciente() {
        return nssPaciente;
    }

    public void setNssPaciente(String nssPaciente) {
        this.nssPaciente = nssPaciente;
    }

    public String getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(String idMedico) {
        this.idMedico = idMedico;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Date getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(Date fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public Date getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(Date fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

}
