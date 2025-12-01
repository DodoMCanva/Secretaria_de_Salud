package com.secretaria_de_salud.basedatosexpedienteclinico;

import com.secretaria_de_salud.Expediente;
import com.secretaria_de_salud.Paciente;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Date;
import org.bson.types.Binary;

/**
 *
 * @author Secretaria de Salud
 */
public class Presets {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        PacientePersistencia p = new PacientePersistencia();
        //Limpiar expedientebd de mongo
        p.eliminarPacientes();
        //Agregar registros predeterminados
        Paciente p1 = new Paciente();
        p1.setNss("12345678901");
        p1.setNombre("Juan Pérez");
        p1.setCorreo("juan@example.com");
        p1.setTelefono("6441234567");
        p1.setCurp("JUAP800101HSONRN01");
        p1.setTipoSangre("O+");
        p1.setPwd("pwd123");
        p1.setHuella(null);
        p1.setTutor(null);
        p1.setNombreContEm("Madre");
        p1.setTelefonoContEm("9809787576");
        p1.setFehcaNac(new Date(1997, 12, 16));
        p1.setAlergias(new ArrayList<String>());
        p.agregarPaciente(p1);

        Paciente p2 = new Paciente();
        p2.setNss("423482374");
        p2.setNombre("Maria Hinojosa");
        p2.setCorreo("mari@example.com");
        p2.setTelefono("644213213");
        p2.setCurp("MARIE73470324HR3");
        p2.setTipoSangre("A+");
        p2.setPwd("123pwd");
        p2.setHuella(null);
        p2.setTutor(null);
        p2.setNombreContEm("Jose");
        p2.setTelefonoContEm("128738927");
        p2.setFehcaNac(new Date(1999, 6, 3));
        ArrayList<String> alergias = new ArrayList<String>();
        alergias.add("Cacahuate");
        alergias.add("Gatos");
        p2.setAlergias(alergias);

        p.agregarPaciente(p2);

        // --- EJECUTAR PRUEBAS DE EXPEDIENTE ---
        Presets tester = new Presets();

        tester.PruebasExpediente();

        // Cerrar las conexiones
        p.close();

    }

    public void PruebasExpediente() {
        System.out.println("\n--- INICIANDO PRUEBAS DE EXPEDIENTE ---");

        // NSS del paciente de prueba
        final String NSS_PRUEBA = "12345678901";

        ExpedientePersistencia expP = new ExpedientePersistencia();

        // 1. LIMPIEZA INICIAL (Opcional, pero útil)
        // Antes de probar, intentamos eliminar el expediente por si ya existía
        try {
            expP.getExpedienteCollection().deleteOne(new org.bson.Document("nss", NSS_PRUEBA));
        } catch (Exception e) {
        }

        Expediente expEncontrado;

        // --- 1. PRUEBA DE AGREGAR EXPEDIENTE ---
        System.out.println("1. Creando nuevo expediente...");
        Expediente nuevoExp = new Expediente();
        nuevoExp.setNss(NSS_PRUEBA);
        nuevoExp.setUltModf(new Date());
        nuevoExp.setRecetas(new ArrayList<>());
        nuevoExp.setImagenes(new ArrayList<>());
        nuevoExp.setPdfs(new ArrayList<>());

        expP.agregarExpediente(nuevoExp);
        System.out.println("--> Expediente base agregado.");

        // --- 2. PRUEBA DE CONSULTA POR NSS ---
        System.out.println("2. Consultando expediente por NSS...");
        expEncontrado = expP.consultarExpedientePorNss(NSS_PRUEBA);

        if (expEncontrado != null && expEncontrado.getNss().equals(NSS_PRUEBA)) {
            System.out.println("--> CONSULTA EXITOSA. Expediente de NSS " + expEncontrado.getNss() + " encontrado.");
        } else {
            System.err.println("!!! ERROR DE CONSULTA. Expediente no encontrado o NSS incorrecto.");
        }

        // --- 3. PRUEBA DE AGREGAR RECETA (String) ---
        System.out.println("3. Agregando una receta...");
        String receta1 = "Tomar Paracetamol cada 8 horas por 3 días.";
        expP.agregarReceta(NSS_PRUEBA, receta1);

        // Volvemos a consultar para verificar la actualización
        expEncontrado = expP.consultarExpedientePorNss(NSS_PRUEBA);
        if (expEncontrado != null && expEncontrado.getRecetas() != null && expEncontrado.getRecetas().size() == 1) {
            System.out.println("--> AGREGAR RECETA EXITOSO. Recetas totales: " + expEncontrado.getRecetas().size());
        } else {
            System.err.println("!!! ERROR al agregar receta. No se encuentra el registro.");
        }

        // --- 4. PRUEBA DE AGREGAR ARCHIVO BINARIO (PDF real) ---
        System.out.println("4. Agregando archivo PDF real...");

        // ⚠️ DEBES AJUSTAR ESTA RUTA ⚠️
        final String RUTA_ARCHIVO_PDF = "C:/Users/aleja/OneDrive/Escritorio/Detallados.pdf";

        try {
            // 1. Leer el archivo y obtener sus bytes
            Path ruta = new File(RUTA_ARCHIVO_PDF).toPath();
            byte[] datosArchivo = Files.readAllBytes(ruta);

            // 2. Crear el objeto Binary de MongoDB
            Binary pdfReal = new Binary((byte) 0x00, datosArchivo);

            // 3. Llamar al método de persistencia
            expP.agregarArchivo(NSS_PRUEBA, "pdfs", pdfReal);

            // --- CONSULTA Y VERIFICACIÓN ---
            expEncontrado = expP.consultarExpedientePorNss(NSS_PRUEBA);
            if (expEncontrado != null && expEncontrado.getPdfs() != null && expEncontrado.getPdfs().size() == 1) {
                System.out.println("--> AGREGAR PDF REAL EXITOSO. PDFs totales: " + expEncontrado.getPdfs().size());
            } else {
                System.err.println("!!! ERROR al agregar PDF real. El conteo es incorrecto o el archivo no se guardó.");
            }

        } catch (IOException e) {
            System.err.println("!!! ERROR DE LECTURA DE ARCHIVO PDF. Verifique que el archivo exista en la ruta:");
            System.err.println(RUTA_ARCHIVO_PDF);
            e.printStackTrace();
        }

        // --- 5. PRUEBA DE AGREGAR ARCHIVO BINARIO (IMAGEN real) ---
        System.out.println("5. Agregando una imagen de prueba real...");

        // ⚠️ DEBES AJUSTAR ESTA RUTA ⚠️
        final String RUTA_ARCHIVO_IMAGEN = "C:/Users/aleja/OneDrive/Escritorio/LogoPotros.png";

        try {
            Path rutaImagen = new File(RUTA_ARCHIVO_IMAGEN).toPath();
            byte[] datosImagen = Files.readAllBytes(rutaImagen);
            Binary imagenReal = new Binary((byte) 0x00, datosImagen);

            // Llamar al método de persistencia para Imágenes
            expP.agregarArchivo(NSS_PRUEBA, "imagenes", imagenReal);

            // --- CONSULTA Y VERIFICACIÓN ---
            expEncontrado = expP.consultarExpedientePorNss(NSS_PRUEBA);
            if (expEncontrado != null && expEncontrado.getImagenes() != null && expEncontrado.getImagenes().size() == 1) {
                System.out.println("--> AGREGAR IMAGEN EXITOSO. Imágenes totales: " + expEncontrado.getImagenes().size());
            } else {
                System.err.println("!!! ERROR al agregar imagen. El conteo es incorrecto o el archivo no se guardó.");
            }

        } catch (IOException e) {
            System.err.println("!!! ERROR DE LECTURA DE ARCHIVO IMAGEN. Verifique que el archivo exista en la ruta:");
            System.err.println(RUTA_ARCHIVO_IMAGEN);
            e.printStackTrace();
        }

        // --- 6. PRUEBA DE CONSULTA DE EXPEDIENTE NO EXISTENTE (La prueba original 5) ---
        System.out.println("6. Consultando NSS inexistente...");
        Expediente expFalso = expP.consultarExpedientePorNss("99999999999");
        if (expFalso == null) {
            System.out.println("--> CONSULTA NO EXISTENTE EXITOSA. Se devolvió 'null'.");
        } else {
            System.err.println("!!! ERROR. Se encontró un expediente con un NSS falso.");
        }

        // --- 7. PRUEBA DE RECUPERACIÓN DE ARCHIVOS BINARIOS ---
        System.out.println("\n7. Recuperando y guardando archivos...");
        try {
            // 1. Volver a consultar el expediente completo para obtener los archivos
            expEncontrado = expP.consultarExpedientePorNss(NSS_PRUEBA);

            if (expEncontrado != null && expEncontrado.getPdfs() != null && !expEncontrado.getPdfs().isEmpty()) {

                // --- Recuperar PDF ---
                Binary pdfRecuperado = expEncontrado.getPdfs().get(0); // Tomamos el primer PDF
                byte[] pdfBytes = pdfRecuperado.getData();

                // Define la ruta de destino (el archivo recuperado)
                Path rutaDestinoPdf = new File("C:/Users/aleja/OneDrive/Escritorio/pdf_recuperado.pdf").toPath();

                // Escribir los bytes al disco
                Files.write(rutaDestinoPdf, pdfBytes);
                System.out.println("--> PDF recuperado exitosamente en: " + rutaDestinoPdf);

                // --- Recuperar Imagen (si existe) ---
                if (expEncontrado.getImagenes() != null && !expEncontrado.getImagenes().isEmpty()) {
                    Binary imagenRecuperada = expEncontrado.getImagenes().get(0); // Tomamos la primera imagen
                    byte[] imagenBytes = imagenRecuperada.getData();

                    // Define la ruta de destino para la imagen
                    Path rutaDestinoImg = new File("C:/Users/aleja/OneDrive/Escritorio/imagen_recuperada.jpg").toPath();
                    Files.write(rutaDestinoImg, imagenBytes);
                    System.out.println("--> Imagen recuperada exitosamente en: " + rutaDestinoImg);
                }

            } else {
                System.err.println("!!! No se encontraron archivos binarios para recuperar.");
            }

        } catch (IOException e) {
            System.err.println("!!! ERROR DE ESCRITURA: Falló al escribir el archivo recuperado al disco.");
            e.printStackTrace();
        }

        expP.close();
        System.out.println("\n--- PRUEBAS DE EXPEDIENTE FINALIZADAS ---");
    }

}
