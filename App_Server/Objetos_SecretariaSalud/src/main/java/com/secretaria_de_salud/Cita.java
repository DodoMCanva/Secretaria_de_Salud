/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.secretaria_de_salud;

import java.util.Date;

/**
 *
 * @author pauli
 */
public class Cita {
    private String id;
    private Date fecha;
    private Paciente paciente;
    private Medico medico;
    private Boolean estadoCita;

    public Cita() {
    }

    public Cita(String id, Date fecha, Paciente paciente, Medico medico, Boolean estadoCita) {
        this.id = id;
        this.fecha = fecha;
        this.paciente = paciente;
        this.medico = medico;
        this.estadoCita = estadoCita;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Boolean getEstadoCita() {
        return estadoCita;
    }

    public void setEstadoCita(Boolean estadoCita) {
        this.estadoCita = estadoCita;
    }

    @Override
    public String toString() {
        return "Cita{" + "id=" + id + ", fecha=" + fecha + ", paciente=" + paciente + ", medico=" + medico + ", estadoCita=" + estadoCita + '}';
    }
    
    
    
}
