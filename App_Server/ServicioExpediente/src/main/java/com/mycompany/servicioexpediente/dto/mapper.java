package com.mycompany.servicioexpediente.dto;

import com.secretaria_de_salud.Expediente;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.bson.types.Binary;

/**
 * Clase Mapper encargada de la conversión de objetos entre: Expediente(Entidad
 * de Persistencia, usa {@code Binary} para archivos) ExpedienteDto(Objeto de
 * Transferencia, usa {@code DocumentoDto} con Base64 para REST) Esta conversión
 * es necesaria para manejar la serialización/deserialización de datos binarios
 * a través de servicios web.
 *
 * @author Secretaria de Salud
 */
public class mapper {

    /**
     * Convierte un objeto Expediente (Entidad de Persistencia) a un
     * ExpedienteDto (Transferencia). Este proceso incluye tomar los datos
     * binarios (PDFs, Imágenes) y codificarlos a Base64 para su transmisión
     * segura.
     *
     * @param expediente El objeto Expediente (con {@code Binary}) a mapear.
     * @return El objeto ExpedienteDto listo para ser enviado por la API.
     */
    public ExpedienteDto toDto(Expediente expediente) {
        ExpedienteDto dto = new ExpedienteDto();
        dto.setNss(expediente.getNss());
        dto.setUltModf(expediente.getUltModf());
        dto.setRecetas(expediente.getRecetas());
        List<DocumentoDto> pdfDtos = new ArrayList<>();
        if (expediente.getPdfs() != null) {
            int index = 1;
            for (Binary bin : expediente.getPdfs()) {
                DocumentoDto doc = new DocumentoDto();
                doc.setNombre("documento_" + index + ".pdf");
                doc.setTipo("application/pdf");
                String base64 = Base64.getEncoder().encodeToString(bin.getData());
                doc.setContenidoBase64(base64);
                pdfDtos.add(doc);
                index++;
            }
        }
        dto.setPdfs(pdfDtos);

        List<DocumentoDto> imgDtos = new ArrayList<>();
        if (expediente.getImagenes() != null) {
            int index = 1;
            for (Binary bin : expediente.getImagenes()) {
                DocumentoDto doc = new DocumentoDto();
                doc.setNombre("imagen_" + index + ".png");
                doc.setTipo("image/png");
                String base64 = Base64.getEncoder().encodeToString(bin.getData());
                doc.setContenidoBase64(base64);
                imgDtos.add(doc);
                index++;
            }
        }
        dto.setImagenes(imgDtos);

        return dto;

    }

    /**
     * Convierte un objeto ExpedienteDto (Transferencia) a un Expediente
     * (Entidad de Persistencia). Este proceso es inverso al {@code toDto},
     * decodificando el contenido Base64 de los documentos para almacenarlos
     * como tipos binarios de MongoDB ({@code Binary}).
     *
     * @param dto El objeto ExpedienteDto (con Base64) a mapear.
     * @return El objeto Expediente listo para ser guardado en la base de datos.
     */
    public Expediente toEntity(ExpedienteDto dto) {
        Expediente expediente = new Expediente();

        expediente.setNss(dto.getNss());
        expediente.setUltModf(dto.getUltModf());
        expediente.setRecetas(dto.getRecetas());

        // Reconstruir PDFs
        List<Binary> pdfs = new ArrayList<>();
        if (dto.getPdfs() != null) {
            for (DocumentoDto doc : dto.getPdfs()) {
                if (doc.getContenidoBase64() != null) {
                    byte[] bytes = Base64.getDecoder().decode(doc.getContenidoBase64());
                    pdfs.add(new Binary(bytes));
                }
            }
        }
        expediente.setPdfs(pdfs);

        // Reconstruir Imágenes
        List<Binary> imagenes = new ArrayList<>();
        if (dto.getImagenes() != null) {
            for (DocumentoDto doc : dto.getImagenes()) {
                if (doc.getContenidoBase64() != null) {
                    byte[] bytes = Base64.getDecoder().decode(doc.getContenidoBase64());
                    imagenes.add(new Binary(bytes));
                }
            }
        }
        expediente.setImagenes(imagenes);

        return expediente;
    }
}
