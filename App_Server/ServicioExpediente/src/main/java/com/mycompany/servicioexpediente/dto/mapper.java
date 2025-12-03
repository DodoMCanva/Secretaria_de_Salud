/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.servicioexpediente.dto;

import com.secretaria_de_salud.Expediente;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.bson.types.Binary;

/**
 *
 * @author dodo
 */
public class mapper {

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
