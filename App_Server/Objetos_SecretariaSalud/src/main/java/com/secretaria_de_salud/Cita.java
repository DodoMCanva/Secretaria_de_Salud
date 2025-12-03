package com.secretaria_de_salud;

import java.util.Date;

/**
 * Representa una Cita Médica dentro del Sistema de Salud. Esta clase vincula a
 * un {@link Paciente} con un {@link Medico} en una fecha y hora específicas.
 * También gestiona el estado actual de la cita (activa, cancelada, etc.).
 *
 * @author Secretaria de Salud
 */
public class Cita {

    private String id;
    private Date fecha;
    private Paciente paciente;
    private Medico medico;
    private Boolean estadoCita;

    /**
     * Constructor vacío por defecto. Crea una instancia de Cita sin inicializar
     * sus atributos.
     */
    public Cita() {
    }

    /**
     * Constructor completo para inicializar una Cita con todos sus datos.
     *
     * @param id Identificador único de la cita.
     * @param fecha Fecha y hora de la cita.
     * @param paciente Objeto Paciente que asiste a la cita.
     * @param medico Objeto Medico que atenderá la cita.
     * @param estadoCita Estado inicial de la cita (true = activa).
     */
    public Cita(String id, Date fecha, Paciente paciente, Medico medico, Boolean estadoCita) {
        this.id = id;
        this.fecha = fecha;
        this.paciente = paciente;
        this.medico = medico;
        this.estadoCita = estadoCita;
    }

    /**
     * Obtiene el ID de la cita.
     *
     * @return El identificador único de la cita como String.
     */
    public String getId() {
        return id;
    }

    /**
     * Establece o modifica el ID de la cita.
     *
     * @param id El nuevo identificador de la cita.
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Obtiene la fecha y hora de la cita.
     *
     * @return Un objeto {@code Date} con la fecha programada.
     */
    public Date getFecha() {
        return fecha;
    }

    /**
     * Asigna una nueva fecha y hora a la cita.
     *
     * @param fecha La nueva fecha a establecer.
     */
    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    /**
     * Obtiene la información del paciente asociado a la cita.
     *
     * @return El objeto {@code Paciente}.
     */
    public Paciente getPaciente() {
        return paciente;
    }

    /**
     * Asigna un paciente a la cita.
     *
     * @param paciente El objeto Paciente a vincular.
     */
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    /**
     * Obtiene la información del médico asignado a la cita.
     *
     * @return El objeto {@code Medico}.
     */
    public Medico getMedico() {
        return medico;
    }

    /**
     * Asigna un médico a la cita.
     *
     * @param medico El objeto Medico a vincular.
     */
    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    /**
     * Verifica el estado actual de la cita.
     *
     * @return {@code true} si la cita está activa, {@code false} en caso
     * contrario.
     */
    public Boolean getEstadoCita() {
        return estadoCita;
    }

    /**
     * Cambia el estado de la cita.
     *
     * @param estadoCita {@code true} para activar, {@code false} para
     * cancelar/desactivar.
     */
    public void setEstadoCita(Boolean estadoCita) {
        this.estadoCita = estadoCita;
    }

    /**
     * Retorna una representación en cadena de texto de la Cita. Útil para
     * depuración y registros (logs).
     *
     * * @return String con los valores de id, fecha, paciente, médico y
     * estado.
     */
    @Override
    public String toString() {
        return "Cita{" + "id=" + id + ", fecha=" + fecha + ", paciente=" + paciente + ", medico=" + medico + ", estadoCita=" + estadoCita + '}';
    }

}
