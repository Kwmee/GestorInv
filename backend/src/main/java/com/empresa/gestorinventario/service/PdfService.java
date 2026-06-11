package com.empresa.gestorinventario.service;

import com.empresa.gestorinventario.exception.NegocioException;
import com.empresa.gestorinventario.model.entity.Evento;
import com.empresa.gestorinventario.model.entity.LineaEvento;
import com.empresa.gestorinventario.model.entity.Material;
import com.empresa.gestorinventario.model.entity.Trabajador;
import com.empresa.gestorinventario.model.enums.EstadoMaterial;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
public class PdfService {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DeviceRgb COLOR_CABECERA = new DeviceRgb(30, 64, 118);
    private static final DeviceRgb COLOR_FILA_PAR  = new DeviceRgb(240, 244, 250);

    @Value("${app.albaranes.ruta-almacenamiento}")
    private String rutaAlmacenamiento;

    private final EmpresaService empresaService;

    public PdfService(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    public String generarAlbaranSalida(Evento evento, String numero, Trabajador trabajador) {
        String nombreArchivo = numero + ".pdf";
        String rutaCompleta = prepararDirectorio(nombreArchivo);

        try (PdfWriter writer = new PdfWriter(rutaCompleta);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf, PageSize.A4)) {

            doc.setMargins(36, 36, 36, 36);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontNegrita = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            agregarCabecera(doc, fontNegrita, fontNormal, "ALBARÁN DE SALIDA", numero,
                evento.getFechaInicio().format(FORMATO_FECHA));
            agregarDatosEventoYCliente(doc, fontNegrita, fontNormal, evento, trabajador);
            agregarTablaLineas(doc, fontNegrita, fontNormal, evento.getLineas(), false);
            agregarSeccionFirmas(doc, fontNormal);
            agregarPieDocumento(doc, fontNormal);

        } catch (IOException e) {
            log.error("Error generando PDF albarán salida {}: {}", numero, e.getMessage(), e);
            throw new NegocioException("Error al generar el albarán de salida");
        }

        return rutaCompleta;
    }

    public String generarAlbaranDevolucion(Evento evento, List<LineaEvento> lineas, String numero, Trabajador trabajador) {
        String nombreArchivo = numero + ".pdf";
        String rutaCompleta = prepararDirectorio(nombreArchivo);

        try (PdfWriter writer = new PdfWriter(rutaCompleta);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf, PageSize.A4)) {

            doc.setMargins(36, 36, 36, 36);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontNegrita = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            agregarCabecera(doc, fontNegrita, fontNormal, "ALBARÁN DE DEVOLUCIÓN", numero,
                java.time.LocalDateTime.now().format(FORMATO_FECHA));
            agregarDatosEventoYCliente(doc, fontNegrita, fontNormal, evento, trabajador);
            agregarTablaLineas(doc, fontNegrita, fontNormal, lineas, true);
            agregarSeccionFirmas(doc, fontNormal);
            agregarPieDocumento(doc, fontNormal);

        } catch (IOException e) {
            log.error("Error generando PDF albarán devolución {}: {}", numero, e.getMessage(), e);
            throw new NegocioException("Error al generar el albarán de devolución");
        }

        return rutaCompleta;
    }

    public byte[] generarListaCargaEvento(Evento evento) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf, PageSize.A4)) {

            doc.setMargins(36, 36, 36, 36);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontNegrita = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            agregarCabecera(doc, fontNegrita, fontNormal, "LISTA DE CARGA",
                evento.getNombre(), LocalDateTime.now().format(FORMATO_FECHA));
            agregarDatosEventoYCliente(doc, fontNegrita, fontNormal, evento, evento.getTrabajador());
            agregarTablaListaCarga(doc, fontNegrita, fontNormal, evento.getLineas());
            agregarPieDocumento(doc, fontNormal);

        } catch (IOException e) {
            log.error("Error generando lista de carga para evento {}: {}", evento.getId(), e.getMessage(), e);
            throw new NegocioException("Error al generar la lista de carga");
        }
        return baos.toByteArray();
    }

    public byte[] generarListadoInventario(List<Material> materiales, EstadoMaterial estado, String busqueda) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdf = new PdfDocument(writer);
             Document doc = new Document(pdf, PageSize.A4)) {

            doc.setMargins(36, 36, 36, 36);
            PdfFont fontNormal = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont fontNegrita = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            String fecha = LocalDateTime.now().format(FORMATO_FECHA);
            agregarCabecera(doc, fontNegrita, fontNormal, "LISTADO DE INVENTARIO", "", fecha);
            agregarFiltrosAplicados(doc, fontNormal, estado, busqueda, materiales.size());
            agregarTablaInventario(doc, fontNegrita, fontNormal, materiales);
            agregarPieDocumento(doc, fontNormal);

        } catch (IOException e) {
            log.error("Error generando listado de inventario: {}", e.getMessage(), e);
            throw new NegocioException("Error al generar el listado de inventario");
        }
        return baos.toByteArray();
    }

    public byte[] leerPdf(String rutaPdf) {
        try {
            return Files.readAllBytes(Paths.get(rutaPdf));
        } catch (IOException e) {
            throw new NegocioException("No se pudo leer el archivo PDF");
        }
    }

    private void agregarCabecera(Document doc, PdfFont fontNegrita, PdfFont fontNormal,
                                  String tipoAlbaran, String numero, String fecha) throws IOException {
        Table tablaCabecera = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .setWidth(UnitValue.createPercentValue(100));

        // Celda izquierda: logo + datos empresa
        var config = empresaService.obtenerConfig();
        Cell celdaEmpresa = new Cell().setBorder(Border.NO_BORDER);
        agregarLogo(celdaEmpresa);
        celdaEmpresa.add(new Paragraph(config.getNombre())
            .setFont(fontNegrita).setFontSize(12).setMarginTop(4));
        if (config.getDireccion() != null) {
            celdaEmpresa.add(new Paragraph(config.getDireccion())
                .setFont(fontNormal).setFontSize(8).setFontColor(ColorConstants.GRAY));
        }
        String contacto = "";
        if (config.getTelefono() != null) contacto += "Tel: " + config.getTelefono();
        if (config.getEmail() != null) contacto += (contacto.isEmpty() ? "" : "  |  ") + config.getEmail();
        if (!contacto.isEmpty()) {
            celdaEmpresa.add(new Paragraph(contacto)
                .setFont(fontNormal).setFontSize(8).setFontColor(ColorConstants.GRAY));
        }

        // Celda derecha: tipo y número de albarán
        Cell celdaAlbaran = new Cell().setBorder(Border.NO_BORDER)
            .setTextAlignment(TextAlignment.RIGHT);
        celdaAlbaran.add(new Paragraph(tipoAlbaran)
            .setFont(fontNegrita).setFontSize(16)
            .setFontColor(COLOR_CABECERA));
        if (numero != null && !numero.isBlank()) {
            celdaAlbaran.add(new Paragraph("Nº: " + numero)
                .setFont(fontNegrita).setFontSize(11));
        }
        celdaAlbaran.add(new Paragraph("Fecha: " + fecha)
            .setFont(fontNormal).setFontSize(9));

        tablaCabecera.addCell(celdaEmpresa);
        tablaCabecera.addCell(celdaAlbaran);
        doc.add(tablaCabecera);

        // Línea separadora
        doc.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine())
            .setMarginTop(8).setMarginBottom(8));
    }

    private void agregarLogo(Cell celda) {
        try {
            byte[] logoBytes = empresaService.obtenerLogoBytes();
            if (logoBytes != null) {
                Image logo = new Image(ImageDataFactory.create(logoBytes))
                    .setWidth(100).setHeight(40);
                celda.add(logo);
            }
        } catch (Exception e) {
            log.warn("No se pudo cargar el logo de empresa: {}", e.getMessage());
        }
    }

    private void agregarDatosEventoYCliente(Document doc, PdfFont fontNegrita, PdfFont fontNormal,
                                             Evento evento, Trabajador trabajador) {
        Table tablaInfo = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .setWidth(UnitValue.createPercentValue(100))
            .setMarginBottom(12);

        tablaInfo.addCell(crearCeldaSeccion("DATOS DEL CLIENTE", fontNegrita));
        tablaInfo.addCell(crearCeldaSeccion("DATOS DEL EVENTO", fontNegrita));

        Cell celdaCliente = new Cell().setPadding(8)
            .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
        celdaCliente.add(linea(fontNegrita, fontNormal, "Razón Social: ", evento.getCliente().getRazonSocial()));
        if (evento.getCliente().getNifCif() != null)
            celdaCliente.add(linea(fontNegrita, fontNormal, "NIF/CIF: ", evento.getCliente().getNifCif()));
        if (evento.getCliente().getTelefono() != null)
            celdaCliente.add(linea(fontNegrita, fontNormal, "Teléfono: ", evento.getCliente().getTelefono()));
        if (evento.getCliente().getDireccion() != null)
            celdaCliente.add(linea(fontNegrita, fontNormal, "Dirección: ", evento.getCliente().getDireccion()));

        Cell celdaEvento = new Cell().setPadding(8)
            .setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f));
        celdaEvento.add(linea(fontNegrita, fontNormal, "Evento: ", evento.getNombre()));
        if (evento.getLugar() != null)
            celdaEvento.add(linea(fontNegrita, fontNormal, "Lugar: ", evento.getLugar()));
        celdaEvento.add(linea(fontNegrita, fontNormal, "Fecha inicio: ",
            evento.getFechaInicio().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
        if (trabajador != null)
            celdaEvento.add(linea(fontNegrita, fontNormal, "Responsable: ", trabajador.getNombre()));

        tablaInfo.addCell(celdaCliente);
        tablaInfo.addCell(celdaEvento);
        doc.add(tablaInfo);
    }

    private void agregarTablaLineas(Document doc, PdfFont fontNegrita, PdfFont fontNormal,
                                     List<LineaEvento> lineas, boolean conEstadoDevolucion) {
        String titulo = conEstadoDevolucion ? "MATERIAL DEVUELTO" : "MATERIAL ASIGNADO";
        doc.add(new Paragraph(titulo)
            .setFont(fontNegrita).setFontSize(10)
            .setFontColor(COLOR_CABECERA).setMarginBottom(4));

        float[] anchos = conEstadoDevolucion
            ? new float[]{5, 35, 10, 20, 20, 10}
            : new float[]{5, 40, 10, 30, 15};

        Table tabla = new Table(UnitValue.createPercentArray(anchos))
            .setWidth(UnitValue.createPercentValue(100));

        // Cabecera de tabla
        String[] cabeceras = conEstadoDevolucion
            ? new String[]{"Nº", "Descripción", "Cant.", "Nº Serie", "Estado", "Obs."}
            : new String[]{"Nº", "Descripción", "Cant.", "Nº Serie", "Obs."};

        for (String cab : cabeceras) {
            tabla.addHeaderCell(new Cell()
                .setBackgroundColor(COLOR_CABECERA)
                .add(new Paragraph(cab).setFont(fontNegrita).setFontSize(8)
                    .setFontColor(ColorConstants.WHITE))
                .setPadding(4));
        }

        // Filas de material
        for (int i = 0; i < lineas.size(); i++) {
            LineaEvento linea = lineas.get(i);
            DeviceRgb fondo = i % 2 == 0 ? new DeviceRgb(255, 255, 255) : COLOR_FILA_PAR;

            tabla.addCell(celda(fontNormal, String.valueOf(i + 1), fondo));
            tabla.addCell(celda(fontNormal, linea.getMaterial().getNombre(), fondo));
            tabla.addCell(celda(fontNormal, String.valueOf(linea.getCantidad()), fondo));
            tabla.addCell(celda(fontNormal,
                linea.getMaterial().getNumeroSerie() != null ? linea.getMaterial().getNumeroSerie() : "—", fondo));

            if (conEstadoDevolucion) {
                tabla.addCell(celda(fontNormal, linea.getEstadoDevolucion().name(), fondo));
            }

            tabla.addCell(celda(fontNormal,
                linea.getObservaciones() != null ? linea.getObservaciones() : "", fondo));
        }

        doc.add(tabla.setMarginBottom(16));
    }

    private void agregarSeccionFirmas(Document doc, PdfFont fontNormal) {
        doc.add(new Paragraph("FIRMAS").setFont(fontNormal).setFontSize(9)
            .setFontColor(ColorConstants.GRAY).setMarginTop(20));

        Table tablaFirmas = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .setWidth(UnitValue.createPercentValue(100)).setMarginTop(8);

        Cell firmaSalida = new Cell().setBorder(Border.NO_BORDER).setPaddingRight(20);
        firmaSalida.add(new Paragraph("Firma de entrega:").setFont(fontNormal).setFontSize(8));
        firmaSalida.add(new Paragraph("\n\n\n____________________________")
            .setFont(fontNormal).setFontSize(8).setFontColor(ColorConstants.GRAY));

        Cell firmaRecepcion = new Cell().setBorder(Border.NO_BORDER).setPaddingLeft(20);
        firmaRecepcion.add(new Paragraph("Firma de recepción:").setFont(fontNormal).setFontSize(8));
        firmaRecepcion.add(new Paragraph("\n\n\n____________________________")
            .setFont(fontNormal).setFontSize(8).setFontColor(ColorConstants.GRAY));

        tablaFirmas.addCell(firmaSalida);
        tablaFirmas.addCell(firmaRecepcion);
        doc.add(tablaFirmas);
    }

    private void agregarPieDocumento(Document doc, PdfFont fontNormal) {
        doc.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine())
            .setMarginTop(20));
        doc.add(new Paragraph("Documento generado por GestorInventario v1.0  |  " + empresaService.obtenerConfig().getNombre())
            .setFont(fontNormal).setFontSize(7)
            .setFontColor(ColorConstants.GRAY)
            .setTextAlignment(TextAlignment.CENTER)
            .setMarginTop(4));
    }

    private Cell crearCeldaSeccion(String texto, PdfFont font) {
        return new Cell()
            .setBackgroundColor(COLOR_CABECERA)
            .add(new Paragraph(texto).setFont(font).setFontSize(9).setFontColor(ColorConstants.WHITE))
            .setPadding(4).setBorder(Border.NO_BORDER);
    }

    private Paragraph linea(PdfFont fontNegrita, PdfFont fontNormal, String etiqueta, String valor) {
        return new Paragraph()
            .add(new Text(etiqueta).setFont(fontNegrita).setFontSize(8))
            .add(new Text(valor != null ? valor : "").setFont(fontNormal).setFontSize(8))
            .setMarginBottom(2);
    }

    private Cell celda(PdfFont font, String texto, DeviceRgb fondo) {
        return new Cell()
            .setBackgroundColor(fondo)
            .add(new Paragraph(texto).setFont(font).setFontSize(8))
            .setPadding(3);
    }

    private void agregarTablaListaCarga(Document doc, PdfFont fontNegrita, PdfFont fontNormal,
                                          List<LineaEvento> lineas) {
        doc.add(new Paragraph("MATERIAL ASIGNADO")
            .setFont(fontNegrita).setFontSize(10)
            .setFontColor(COLOR_CABECERA).setMarginBottom(4));

        Table tabla = new Table(UnitValue.createPercentArray(new float[]{4, 32, 20, 18, 16, 10}))
            .setWidth(UnitValue.createPercentValue(100));

        for (String cab : new String[]{"Nº", "Descripción", "Marca / Modelo", "Nº Serie", "Categoría", "Cant."}) {
            tabla.addHeaderCell(new Cell()
                .setBackgroundColor(COLOR_CABECERA)
                .add(new Paragraph(cab).setFont(fontNegrita).setFontSize(8).setFontColor(ColorConstants.WHITE))
                .setPadding(4));
        }

        for (int i = 0; i < lineas.size(); i++) {
            LineaEvento l = lineas.get(i);
            DeviceRgb fondo = i % 2 == 0 ? new DeviceRgb(255, 255, 255) : COLOR_FILA_PAR;
            String marcaModelo = "";
            if (l.getMaterial().getMarca() != null) marcaModelo += l.getMaterial().getMarca();
            if (l.getMaterial().getModelo() != null) marcaModelo += (marcaModelo.isEmpty() ? "" : " ") + l.getMaterial().getModelo();

            tabla.addCell(celda(fontNormal, String.valueOf(i + 1), fondo));
            tabla.addCell(celda(fontNormal, l.getMaterial().getNombre(), fondo));
            tabla.addCell(celda(fontNormal, marcaModelo.isEmpty() ? "—" : marcaModelo, fondo));
            tabla.addCell(celda(fontNormal, l.getMaterial().getNumeroSerie() != null ? l.getMaterial().getNumeroSerie() : "—", fondo));
            tabla.addCell(celda(fontNormal, l.getMaterial().getCategoria().getNombre(), fondo));
            tabla.addCell(celda(fontNormal, String.valueOf(l.getCantidad()), fondo));
        }

        doc.add(tabla.setMarginBottom(16));
        doc.add(new Paragraph("Total: " + lineas.size() + " ítem(s)")
            .setFont(fontNegrita).setFontSize(9).setTextAlignment(TextAlignment.RIGHT));
    }

    private void agregarFiltrosAplicados(Document doc, PdfFont fontNormal,
                                          EstadoMaterial estado, String busqueda, int total) {
        StringBuilder sb = new StringBuilder("Generado el " + LocalDateTime.now().format(FORMATO_FECHA));
        if (estado != null) sb.append("  |  Estado: ").append(estado.name());
        if (busqueda != null && !busqueda.isBlank()) sb.append("  |  Búsqueda: \"").append(busqueda).append("\"");
        sb.append("  |  Total: ").append(total).append(" ítem(s)");

        doc.add(new Paragraph(sb.toString())
            .setFont(fontNormal).setFontSize(8)
            .setFontColor(ColorConstants.GRAY).setMarginBottom(10));
    }

    private void agregarTablaInventario(Document doc, PdfFont fontNegrita, PdfFont fontNormal,
                                         List<Material> materiales) {
        Table tabla = new Table(UnitValue.createPercentArray(new float[]{4, 26, 14, 11, 18, 18, 9}))
            .setWidth(UnitValue.createPercentValue(100));

        for (String cab : new String[]{"Nº", "Descripción", "Categoría", "Estado", "Marca", "Nº Serie", "Cant."}) {
            tabla.addHeaderCell(new Cell()
                .setBackgroundColor(COLOR_CABECERA)
                .add(new Paragraph(cab).setFont(fontNegrita).setFontSize(8).setFontColor(ColorConstants.WHITE))
                .setPadding(4));
        }

        for (int i = 0; i < materiales.size(); i++) {
            Material m = materiales.get(i);
            DeviceRgb fondo = i % 2 == 0 ? new DeviceRgb(255, 255, 255) : COLOR_FILA_PAR;
            String marcaModelo = "";
            if (m.getMarca() != null) marcaModelo += m.getMarca();
            if (m.getModelo() != null) marcaModelo += (marcaModelo.isEmpty() ? "" : " ") + m.getModelo();

            tabla.addCell(celda(fontNormal, String.valueOf(i + 1), fondo));
            tabla.addCell(celda(fontNormal, m.getNombre(), fondo));
            tabla.addCell(celda(fontNormal, m.getCategoria().getNombre(), fondo));
            tabla.addCell(celda(fontNormal, m.getEstado().name(), fondo));
            tabla.addCell(celda(fontNormal, marcaModelo.isEmpty() ? "—" : marcaModelo, fondo));
            tabla.addCell(celda(fontNormal, m.getNumeroSerie() != null ? m.getNumeroSerie() : "—", fondo));
            tabla.addCell(celda(fontNormal, String.valueOf(m.getCantidad()), fondo));
        }

        doc.add(tabla.setMarginBottom(12));
        doc.add(new Paragraph("Total: " + materiales.size() + " ítem(s)")
            .setFont(fontNegrita).setFontSize(9).setTextAlignment(TextAlignment.RIGHT));
    }

    private String prepararDirectorio(String nombreArchivo) {
        try {
            Path directorio = Paths.get(rutaAlmacenamiento);
            if (!Files.exists(directorio)) {
                Files.createDirectories(directorio);
            }
            return directorio.resolve(nombreArchivo).toString();
        } catch (IOException e) {
            throw new NegocioException("No se pudo crear el directorio de albaranes");
        }
    }
}
