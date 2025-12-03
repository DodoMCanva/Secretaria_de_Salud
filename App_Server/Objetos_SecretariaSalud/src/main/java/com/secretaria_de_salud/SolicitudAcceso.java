package com.secretaria_de_salud;
// Objetos_SecretariaSalud/src/main/java/com/secretaria_de_salud/SolicitudAcceso.java

import java.util.Date;
import org.bson.types.ObjectId;

/**
 * Representa una Solicitud de Acceso temporal a un expediente clínico. Esta
 * clase gestiona el flujo de seguridad y permisos, permitiendo que un médico
 * solicite permiso para ver la información de un paciente. El paciente debe
 * aprobar esta solicitud para que el estado cambie de "PENDIENTE" a "ACEPTADA".
 *
 * @author Secretaria de Salud
 */
public class SolicitudAcceso {

    private ObjectId id;          // _id en Mongo
    private String nssPaciente;   // Paciente al que se quiere acceder
    private String idMedico;      // Identificador del médico (puede ser nss, cedula, user)
    private String estado;        // PENDIENTE, ACEPTADA, RECHAZADA
    private Date fechaSolicitud;
    private Date fechaRespuesta;  // null mientras está pendiente
    private String motivo;        // opcional

    /**
     * Constructor vacío por defecto. Inicializa una instancia de
     * SolicitudAcceso sin datos.
     */
    public SolicitudAcceso() {
    }

    /**
     * Obtiene el identificador único de la solicitud.
     *
     * @return El objeto {@code ObjectId} de MongoDB.
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * Asigna el identificador único a la solicitud.
     *
     * @param id El nuevo {@code ObjectId}.
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

    /**
     * Obtiene el NSS del paciente destinatario de la solicitud.
     *
     * @return El NSS como cadena de texto.
     */
    public String getNssPaciente() {
        return nssPaciente;
    }

    /**
     * Establece el NSS del paciente destinatario.
     *
     * @param nssPaciente El NSS del paciente.
     */
    public void setNssPaciente(String nssPaciente) {
        this.nssPaciente = nssPaciente;
    }

    /**
     * Obtiene el identificador del médico que realiza la solicitud.
     *
     * @return El ID del médico.
     */
    public String getIdMedico() {
        return idMedico;
    }

    /**
     * Establece el identificador del médico solicitante.
     *
     * @param idMedico El ID del médico.
     */
    public void setIdMedico(String idMedico) {
        this.idMedico = idMedico;
    }

    /**
     * Obtiene el estado actual de la solicitud.
     *
     * @return El estado (ej. "PENDIENTE", "ACEPTADA").
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Actualiza el estado de la solicitud.
     *
     * @param estado El nuevo estado a asignar.
     */
    public void setEstado(String estado) {
        this.estado = estado;
    }

    /**
     * Obtiene la fecha en que se realizó la solicitud.
     *
     * @return La fecha de creación.
     */
    public Date getFechaSolicitud() {
        return fechaSolicitud;
    }

    /**
     * Establece la fecha de creación de la solicitud.
     *
     * @param fechaSolicitud La fecha de solicitud.
     */
    public void setFechaSolicitud(Date fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    /**
     * Obtiene la fecha en que se respondió la solicitud.
     *
     * @return La fecha de respuesta o {@code null} si aún está pendiente.
     */
    public Date getFechaRespuesta() {
        return fechaRespuesta;
    }

    /**
     * Establece la fecha de respuesta de la solicitud. Se debe asignar al
     * momento de cambiar el estado a ACEPTADA o RECHAZADA.
     *
     * @param fechaRespuesta La fecha de la respuesta.
     */
    public void setFechaRespuesta(Date fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

    /**
     * Obtiene el motivo de la solicitud.
     *
     * @return El texto descriptivo del motivo.
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Establece el motivo de la solicitud.
     *
     * @param motivo El texto del motivo.
     */
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}
