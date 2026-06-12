package com.empresa.gestorinventario.config;

import com.empresa.gestorinventario.model.entity.*;
import com.empresa.gestorinventario.model.enums.*;
import com.empresa.gestorinventario.model.enums.TipoCliente;
import com.empresa.gestorinventario.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class SeedDataLoader implements ApplicationRunner {

    private final CategoriaMaterialRepository categoriaRepo;
    private final MaterialRepository materialRepo;
    private final ClienteRepository clienteRepo;
    private final TrabajadorRepository trabajadorRepo;
    private final EventoRepository eventoRepo;
    private final MantenimientoRepository mantenimientoRepo;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (materialRepo.count() >= 80) {
            log.info("SeedDataLoader: datos suficientes, saltando.");
            return;
        }
        log.info("SeedDataLoader: insertando datos de ejemplo...");
        seedCategorias();
        seedMaterial();
        seedClientes();
        seedTrabajadores();
        seedEventos();
        seedMantenimiento();
        log.info("SeedDataLoader: completado.");
    }

    private Map<String, CategoriaMaterial> getCategorias() {
        return categoriaRepo.findAll().stream()
            .collect(Collectors.toMap(CategoriaMaterial::getNombre, Function.identity()));
    }

    private void seedCategorias() {
        List<String[]> cats = List.of(
            new String[]{"PA",           "Sistemas de sonido principal y subwoofers"},
            new String[]{"Iluminación",  "Focos, movers y controladores de luz"},
            new String[]{"Backline",     "Guitarras, bajos, baterías y amplificadores"},
            new String[]{"Cables",       "Cableado de señal y alimentación"},
            new String[]{"Fungibles",    "Material de un solo uso o reposición frecuente"},
            new String[]{"Video",        "Proyectores, pantallas y equipos de vídeo"},
            new String[]{"Estructuras",  "Truss, soportes y gradas"},
            new String[]{"Control",      "Mesas de mezclas y racks de procesado"}
        );
        for (String[] c : cats) {
            if (categoriaRepo.findAll().stream().noneMatch(x -> x.getNombre().equals(c[0]))) {
                categoriaRepo.save(CategoriaMaterial.builder().nombre(c[0]).descripcion(c[1]).build());
            }
        }
    }

    private void seedMaterial() {
        Map<String, CategoriaMaterial> cats = getCategorias();

        List<Material> items = List.of(
            // PA
            mat(cats, "PA", "L-Acoustics K2", "L-Acoustics", "K2", "LA-K2-001", 2, new BigDecimal("18500"), LocalDate.of(2021, 3, 10), false),
            mat(cats, "PA", "L-Acoustics K2", "L-Acoustics", "K2", "LA-K2-002", 2, new BigDecimal("18500"), LocalDate.of(2021, 3, 10), false),
            mat(cats, "PA", "L-Acoustics KS28 Sub", "L-Acoustics", "KS28", "LA-KS28-001", 1, new BigDecimal("9800"), LocalDate.of(2021, 3, 10), false),
            mat(cats, "PA", "L-Acoustics KS28 Sub", "L-Acoustics", "KS28", "LA-KS28-002", 1, new BigDecimal("9800"), LocalDate.of(2021, 3, 10), false),
            mat(cats, "PA", "d&b audiotechnik Y7P", "d&b audiotechnik", "Y7P", "DB-Y7P-001", 1, new BigDecimal("4200"), LocalDate.of(2022, 6, 1), false),
            mat(cats, "PA", "d&b audiotechnik Y7P", "d&b audiotechnik", "Y7P", "DB-Y7P-002", 1, new BigDecimal("4200"), LocalDate.of(2022, 6, 1), false),
            mat(cats, "PA", "d&b audiotechnik Y-SUB", "d&b audiotechnik", "Y-SUB", "DB-YSUB-001", 1, new BigDecimal("5100"), LocalDate.of(2022, 6, 1), false),
            mat(cats, "PA", "QSC KLA12 Line Array", "QSC", "KLA12", "QSC-KLA-001", 1, new BigDecimal("2100"), LocalDate.of(2023, 2, 14), false),
            mat(cats, "PA", "QSC KLA12 Line Array", "QSC", "KLA12", "QSC-KLA-002", 1, new BigDecimal("2100"), LocalDate.of(2023, 2, 14), false),
            mat(cats, "PA", "RCF TTL 55-A Monitor", "RCF", "TTL 55-A", "RCF-MON-001", 1, new BigDecimal("980"), LocalDate.of(2020, 8, 5), false),
            mat(cats, "PA", "RCF TTL 55-A Monitor", "RCF", "TTL 55-A", "RCF-MON-002", 1, new BigDecimal("980"), LocalDate.of(2020, 8, 5), false),
            mat(cats, "PA", "RCF TTL 55-A Monitor", "RCF", "TTL 55-A", "RCF-MON-003", 1, new BigDecimal("980"), LocalDate.of(2020, 8, 5), false),

            // Control
            mat(cats, "Control", "Yamaha CL5 Digital Console", "Yamaha", "CL5", "YAM-CL5-001", 1, new BigDecimal("22000"), LocalDate.of(2021, 9, 15), false),
            mat(cats, "Control", "Yamaha QL5 Digital Console", "Yamaha", "QL5", "YAM-QL5-001", 1, new BigDecimal("12000"), LocalDate.of(2022, 1, 20), false),
            mat(cats, "Control", "DiGiCo SD9", "DiGiCo", "SD9", "DIG-SD9-001", 1, new BigDecimal("28000"), LocalDate.of(2020, 5, 3), false),
            mat(cats, "Control", "Allen & Heath dLive C2500", "Allen & Heath", "dLive C2500", "AH-DLC-001", 1, new BigDecimal("16500"), LocalDate.of(2023, 4, 11), false),
            mat(cats, "Control", "Rack procesado Lake LM 44", "Lake", "LM 44", "LK-LM44-001", 1, new BigDecimal("4800"), LocalDate.of(2021, 7, 8), false),
            mat(cats, "Control", "BSS BLU-160 Procesador", "BSS", "BLU-160", "BSS-160-001", 1, new BigDecimal("2300"), LocalDate.of(2022, 10, 1), false),

            // Iluminación
            mat(cats, "Iluminación", "Martin MAC Aura XB", "Martin", "MAC Aura XB", "MAR-AURA-001", 1, new BigDecimal("3200"), LocalDate.of(2022, 3, 18), false),
            mat(cats, "Iluminación", "Martin MAC Aura XB", "Martin", "MAC Aura XB", "MAR-AURA-002", 1, new BigDecimal("3200"), LocalDate.of(2022, 3, 18), false),
            mat(cats, "Iluminación", "Martin MAC Aura XB", "Martin", "MAC Aura XB", "MAR-AURA-003", 1, new BigDecimal("3200"), LocalDate.of(2022, 3, 18), false),
            mat(cats, "Iluminación", "Martin MAC Aura XB", "Martin", "MAC Aura XB", "MAR-AURA-004", 1, new BigDecimal("3200"), LocalDate.of(2022, 3, 18), false),
            mat(cats, "Iluminación", "Robe Robin BMFL", "Robe", "Robin BMFL", "ROB-BMFL-001", 1, new BigDecimal("7800"), LocalDate.of(2021, 11, 2), false),
            mat(cats, "Iluminación", "Robe Robin BMFL", "Robe", "Robin BMFL", "ROB-BMFL-002", 1, new BigDecimal("7800"), LocalDate.of(2021, 11, 2), false),
            mat(cats, "Iluminación", "Chauvet COLORado 2", "Chauvet", "COLORado 2", "CHA-COL-001", 1, new BigDecimal("1200"), LocalDate.of(2023, 1, 5), false),
            mat(cats, "Iluminación", "Chauvet COLORado 2", "Chauvet", "COLORado 2", "CHA-COL-002", 1, new BigDecimal("1200"), LocalDate.of(2023, 1, 5), false),
            mat(cats, "Iluminación", "GrandMA3 Full-Size", "MA Lighting", "grandMA3 Full", "GMA-FS-001", 1, new BigDecimal("45000"), LocalDate.of(2023, 6, 20), false),
            mat(cats, "Iluminación", "GrandMA3 Light", "MA Lighting", "grandMA3 Light", "GMA-LT-001", 1, new BigDecimal("18000"), LocalDate.of(2022, 8, 30), false),
            mat(cats, "Iluminación", "Hazer JEM ZR44", "JEM", "ZR44", "JEM-ZR44-001", 1, new BigDecimal("1800"), LocalDate.of(2020, 4, 12), false),

            // Backline
            mat(cats, "Backline", "Fender Stratocaster American Pro", "Fender", "Stratocaster AP", "FEND-STRAT-001", 1, new BigDecimal("1800"), LocalDate.of(2019, 6, 10), false),
            mat(cats, "Backline", "Gibson Les Paul Standard", "Gibson", "Les Paul Standard", "GIB-LP-001", 1, new BigDecimal("2400"), LocalDate.of(2020, 2, 28), false),
            mat(cats, "Backline", "Fender Jazz Bass American", "Fender", "Jazz Bass AP", "FEND-JB-001", 1, new BigDecimal("1600"), LocalDate.of(2019, 9, 5), false),
            mat(cats, "Backline", "Marshall JCM2000 TSL100", "Marshall", "JCM2000 TSL100", "MAR-JCM-001", 1, new BigDecimal("1200"), LocalDate.of(2018, 7, 15), false),
            mat(cats, "Backline", "Mesa Boogie Mark V", "Mesa Boogie", "Mark V", "MES-MKV-001", 1, new BigDecimal("2100"), LocalDate.of(2021, 4, 3), false),
            mat(cats, "Backline", "Ampeg SVT-4 Pro Bass Amp", "Ampeg", "SVT-4 Pro", "AMP-SVT4-001", 1, new BigDecimal("1400"), LocalDate.of(2020, 11, 22), false),
            mat(cats, "Backline", "DW Collector's Series Batería", "DW", "Collector's Series", "DW-COLL-001", 1, new BigDecimal("4800"), LocalDate.of(2022, 3, 1), false),
            mat(cats, "Backline", "Roland SPD-SX Pad de Percusión", "Roland", "SPD-SX", "ROL-SPD-001", 1, new BigDecimal("900"), LocalDate.of(2021, 8, 14), false),
            mat(cats, "Backline", "Nord Stage 3 88", "Nord", "Stage 3 88", "NOR-NS388-001", 1, new BigDecimal("3800"), LocalDate.of(2023, 2, 9), false),
            mat(cats, "Backline", "Moog Minimoog Model D", "Moog", "Minimoog Model D", "MOO-MINI-001", 1, new BigDecimal("3500"), LocalDate.of(2022, 9, 17), false),

            // Cables
            mat(cats, "Cables", "Cable XLR Neutrik 10m", "Neutrik", "NC3MXX-B/NC3FXX-B", null, 20, new BigDecimal("28"), LocalDate.of(2021, 1, 15), false),
            mat(cats, "Cables", "Cable XLR Neutrik 5m", "Neutrik", "NC3MXX-B/NC3FXX-B", null, 30, new BigDecimal("18"), LocalDate.of(2021, 1, 15), false),
            mat(cats, "Cables", "Cable XLR Neutrik 20m", "Neutrik", "NC3MXX-B/NC3FXX-B", null, 10, new BigDecimal("42"), LocalDate.of(2021, 1, 15), false),
            mat(cats, "Cables", "Cable Speakon 4P 10m", "Neutrik", "NL4FX/NL4FC", null, 15, new BigDecimal("35"), LocalDate.of(2021, 2, 8), false),
            mat(cats, "Cables", "Multípara 16ch 30m", "Canare", "L-4E6S", "CAN-MUL-001", 3, new BigDecimal("480"), LocalDate.of(2020, 6, 20), false),
            mat(cats, "Cables", "Cable de alimentación Schuko 10m", null, null, null, 25, new BigDecimal("12"), LocalDate.of(2022, 3, 5), true),
            mat(cats, "Cables", "Rack de cables Truss 2x6", null, null, "RACK-CAB-001", 2, new BigDecimal("650"), LocalDate.of(2021, 5, 10), false),

            // Video
            mat(cats, "Video", "Panasonic PT-RZ770 Proyector Laser", "Panasonic", "PT-RZ770", "PAN-RZ770-001", 1, new BigDecimal("12000"), LocalDate.of(2022, 7, 4), false),
            mat(cats, "Video", "Panasonic PT-RZ770 Proyector Laser", "Panasonic", "PT-RZ770", "PAN-RZ770-002", 1, new BigDecimal("12000"), LocalDate.of(2022, 7, 4), false),
            mat(cats, "Video", "Pantalla Da-Lite 4x3 100\"", "Da-Lite", "Professional Series", "DAL-100-001", 1, new BigDecimal("950"), LocalDate.of(2021, 10, 12), false),
            mat(cats, "Video", "Roland V-1SDI Video Switcher", "Roland", "V-1SDI", "ROL-V1SDI-001", 1, new BigDecimal("4200"), LocalDate.of(2023, 3, 28), false),
            mat(cats, "Video", "Barco UDX-4K22 Proyector", "Barco", "UDX-4K22", "BAR-UDX-001", 1, new BigDecimal("28000"), LocalDate.of(2023, 9, 1), false),

            // Estructuras
            mat(cats, "Estructuras", "Tramo Truss F34 1m", "ProTruss", "F34/100", null, 20, new BigDecimal("85"), LocalDate.of(2019, 3, 15), false),
            mat(cats, "Estructuras", "Tramo Truss F34 2m", "ProTruss", "F34/200", null, 16, new BigDecimal("140"), LocalDate.of(2019, 3, 15), false),
            mat(cats, "Estructuras", "Esquinero Truss F34 90°", "ProTruss", "F34-C90", null, 8, new BigDecimal("95"), LocalDate.of(2019, 3, 15), false),
            mat(cats, "Estructuras", "Motor Lodestar 500kg", "Lodestar", "CM-LH-500", "LODE-500-001", 1, new BigDecimal("2800"), LocalDate.of(2020, 9, 20), false),
            mat(cats, "Estructuras", "Motor Lodestar 500kg", "Lodestar", "CM-LH-500", "LODE-500-002", 1, new BigDecimal("2800"), LocalDate.of(2020, 9, 20), false),
            mat(cats, "Estructuras", "Motor Lodestar 500kg", "Lodestar", "CM-LH-500", "LODE-500-003", 1, new BigDecimal("2800"), LocalDate.of(2020, 9, 20), false),
            mat(cats, "Estructuras", "Motor Lodestar 500kg", "Lodestar", "CM-LH-500", "LODE-500-004", 1, new BigDecimal("2800"), LocalDate.of(2020, 9, 20), false),

            // Fungibles
            mat(cats, "Fungibles", "Cinta Gaffer 50mm negra", null, null, null, 50, new BigDecimal("6"), null, true),
            mat(cats, "Fungibles", "Brida nylon 300mm pack/100", null, null, null, 20, new BigDecimal("4"), null, true),
            mat(cats, "Fungibles", "Pilas AA Duracell pack/10", "Duracell", null, null, 30, new BigDecimal("8"), null, true),
            mat(cats, "Fungibles", "Bombilla PAR64 1000W", null, null, null, 12, new BigDecimal("22"), LocalDate.of(2023, 5, 10), true)
        );

        for (Material m : items) {
            boolean existe = m.getNumeroSerie() != null
                ? materialRepo.findAll().stream().anyMatch(x -> m.getNumeroSerie().equals(x.getNumeroSerie()))
                : materialRepo.findAll().stream().anyMatch(x -> m.getNombre().equals(x.getNombre()) && x.getMarca() != null && x.getMarca().equals(m.getMarca()) && m.getMarca() != null);
            if (!existe) {
                materialRepo.save(m);
            }
        }
    }

    private Material mat(Map<String, CategoriaMaterial> cats, String catNombre, String nombre,
                         String marca, String modelo, String serie, int cantidad,
                         BigDecimal valor, LocalDate fechaAdq, boolean fungible) {
        return Material.builder()
            .categoria(cats.get(catNombre))
            .nombre(nombre)
            .marca(marca)
            .modelo(modelo)
            .numeroSerie(serie)
            .cantidad(cantidad)
            .estado(EstadoMaterial.DISPONIBLE)
            .valorUnitario(valor)
            .fechaAdquisicion(fechaAdq)
            .esFungible(fungible)
            .stockMinimo(fungible ? 5 : 0)
            .build();
    }

    private void seedClientes() {
        List<String[]> clientes = List.of(
            new String[]{"Sala Caracol", "B-12345678", "914 123 456", "reservas@caracol.es", "C/ Bernardo López García 5, Madrid", "EMPRESA"},
            new String[]{"Moby Dick Club", "B-23456789", "914 234 567", "info@mobydick.es", "C/ San Dimas 4, Madrid", "EMPRESA"},
            new String[]{"FIB Festival Internacional Benicàssim", "A-34567890", "964 300 400", "produccion@fib.es", "Recinto FIB, Benicàssim", "EMPRESA"},
            new String[]{"Arenal Sound", "B-45678901", "962 200 300", "info@arenalsound.com", "Playa de l'Arenal, Burriana", "EMPRESA"},
            new String[]{"Mad Cool Festival", "A-56789012", "911 000 200", "produccion@madcool.es", "Valdebebas, Madrid", "EMPRESA"},
            new String[]{"Ayuntamiento de Madrid", "P-2800100-B", "915 888 888", "eventos@madrid.es", "Pl. de la Villa 1, Madrid", "EMPRESA"},
            new String[]{"Palau de la Música Catalana", "G-08004123", "932 957 200", "concerts@palaumusica.cat", "C/ Palau de la Música 4-6, Barcelona", "EMPRESA"},
            new String[]{"Sala Apolo Barcelona", "B-08004567", "934 414 001", "info@sala-apolo.com", "C/ Nou de la Rambla 113, Barcelona", "EMPRESA"},
            new String[]{"Teatro Real Madrid", "S-2800001-F", "915 160 606", "comunicacion@teatro-real.com", "Pl. de Oriente s/n, Madrid", "EMPRESA"},
            new String[]{"Fundación Iker Casillas", "G-80123456", "912 345 678", "eventos@fundacioniker.org", "C/ Fuencarral 6, Madrid", "EMPRESA"},
            new String[]{"Carlos Rueda Producciones", "47123456-T", "666 111 222", "carlos.rueda@gmail.com", "Alcobendas, Madrid", "PARTICULAR"},
            new String[]{"María José Sánchez", "52234567-A", "622 333 444", "mj.sanchez@hotmail.com", "Getafe, Madrid", "PARTICULAR"},
            new String[]{"Eventos Mediterráneo S.L.", "B-46789012", "963 100 200", "info@eventosmed.es", "Av. del Puerto 123, Valencia", "EMPRESA"},
            new String[]{"Universidad Autónoma de Madrid", "Q-2800003-H", "914 975 000", "actos@uam.es", "C/ Einstein 3, Madrid", "EMPRESA"},
            new String[]{"Vodafone Yu Music", "A-67890123", "912 200 300", "booking@yumusic.es", "Paseo de la Castellana 141, Madrid", "EMPRESA"}
        );

        for (String[] c : clientes) {
            if (clienteRepo.findAll().stream().noneMatch(x -> x.getRazonSocial().equals(c[0]))) {
                clienteRepo.save(Cliente.builder()
                    .razonSocial(c[0])
                    .nifCif(c[1])
                    .telefono(c[2])
                    .email(c[3])
                    .direccion(c[4])
                    .tipo(TipoCliente.valueOf(c[5]))
                    .activo(true)
                    .build());
            }
        }
    }

    private void seedTrabajadores() {
        List<String> nombres = List.of(
            "Miguel Ángel Torres", "Laura Fernández", "Javier Molina",
            "Ana Belén Ruiz", "Pablo Serrano", "Carmen López"
        );
        for (String nombre : nombres) {
            if (trabajadorRepo.findAll().stream().noneMatch(t -> t.getNombre().equals(nombre))) {
                trabajadorRepo.save(Trabajador.builder().nombre(nombre).activo(true).build());
            }
        }
    }

    private void seedEventos() {
        List<Cliente> clientes = clienteRepo.findAll();
        List<Material> material = materialRepo.findAll();
        if (clientes.isEmpty() || material.isEmpty()) return;

        // Función helper para buscar cliente por nombre parcial
        java.util.function.Function<String, Cliente> cli = (partial) -> clientes.stream()
            .filter(c -> c.getRazonSocial().contains(partial))
            .findFirst().orElse(clientes.get(0));

        java.util.function.Function<String, Material> mat = (partial) -> material.stream()
            .filter(m -> m.getNombre().contains(partial))
            .findFirst().orElse(null);

        List<Object[]> eventos = List.of(
            // [nombre, lugar, cliente_partial, inicio, fin, estado]
            new Object[]{"Concierto Año Nuevo Palacio", "Palacio de Deportes, Madrid", "Palau", LocalDateTime.of(2026, 1, 10, 20, 0), LocalDateTime.of(2026, 1, 11, 1, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Gala Premios Anuales UAM", "Auditorio UAM, Madrid", "Autónoma", LocalDateTime.of(2026, 1, 24, 19, 0), LocalDateTime.of(2026, 1, 24, 23, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Sala Caracol Live Feb", "Sala Caracol, Madrid", "Caracol", LocalDateTime.of(2026, 2, 7, 22, 0), LocalDateTime.of(2026, 2, 8, 2, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Teatro Real Ópera Temporada", "Teatro Real, Madrid", "Teatro Real", LocalDateTime.of(2026, 2, 14, 20, 30), LocalDateTime.of(2026, 2, 15, 0, 30), EstadoEvento.FINALIZADO},
            new Object[]{"Festival Invierno Getafe", "Polideportivo Getafe", "María José", LocalDateTime.of(2026, 2, 22, 18, 0), LocalDateTime.of(2026, 2, 22, 23, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Moby Dick Rock Night Marzo", "Moby Dick Club, Madrid", "Moby Dick", LocalDateTime.of(2026, 3, 5, 23, 0), LocalDateTime.of(2026, 3, 6, 4, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Evento Corporativo Vodafone", "Torre Vodafone, Madrid", "Vodafone", LocalDateTime.of(2026, 3, 18, 19, 0), LocalDateTime.of(2026, 3, 18, 23, 30), EstadoEvento.FINALIZADO},
            new Object[]{"Sala Apolo Concierto Rock", "Sala Apolo, Barcelona", "Apolo", LocalDateTime.of(2026, 3, 27, 21, 0), LocalDateTime.of(2026, 3, 28, 2, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Ayuntamiento Madrid Semana Santa", "Plaza Mayor, Madrid", "Ayuntamiento", LocalDateTime.of(2026, 4, 2, 20, 0), LocalDateTime.of(2026, 4, 2, 23, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Concierto Solidario Fundación IK", "Auditorio Mapfre, Madrid", "Casillas", LocalDateTime.of(2026, 4, 11, 19, 0), LocalDateTime.of(2026, 4, 11, 23, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Sala Caracol Abril Late", "Sala Caracol, Madrid", "Caracol", LocalDateTime.of(2026, 4, 18, 22, 0), LocalDateTime.of(2026, 4, 19, 2, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Eventos Mediterráneo Valencia Fest", "Marina de Valencia", "Mediterráneo", LocalDateTime.of(2026, 4, 25, 17, 0), LocalDateTime.of(2026, 4, 26, 1, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Teatro Real Recital Piano", "Teatro Real, Madrid", "Teatro Real", LocalDateTime.of(2026, 5, 3, 20, 30), LocalDateTime.of(2026, 5, 3, 23, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Mad Cool Preshow", "Valdebebas, Madrid", "Mad Cool", LocalDateTime.of(2026, 5, 14, 18, 0), LocalDateTime.of(2026, 5, 14, 23, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Festival Ciudad Madrid Mayo", "Parque del Retiro, Madrid", "Ayuntamiento", LocalDateTime.of(2026, 5, 25, 17, 0), LocalDateTime.of(2026, 5, 25, 22, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Moby Dick Noche de Jazz", "Moby Dick Club, Madrid", "Moby Dick", LocalDateTime.of(2026, 5, 30, 22, 30), LocalDateTime.of(2026, 5, 31, 3, 0), EstadoEvento.FINALIZADO},
            new Object[]{"Arenal Sound Preventa", "Burriana, Castellón", "Arenal Sound", LocalDateTime.of(2026, 6, 6, 17, 0), LocalDateTime.of(2026, 6, 6, 23, 30), EstadoEvento.FINALIZADO},
            new Object[]{"Sala Caracol Junio Night", "Sala Caracol, Madrid", "Caracol", LocalDateTime.of(2026, 6, 20, 22, 0), LocalDateTime.of(2026, 6, 21, 2, 0), EstadoEvento.PLANIFICADO},
            new Object[]{"Vodafone Yu Showcase Verano", "WiZink Center, Madrid", "Vodafone", LocalDateTime.of(2026, 7, 4, 20, 0), LocalDateTime.of(2026, 7, 4, 24, 0), EstadoEvento.PLANIFICADO},
            new Object[]{"FIB 2026 Día 1", "Recinto FIB, Benicàssim", "FIB", LocalDateTime.of(2026, 7, 17, 17, 0), LocalDateTime.of(2026, 7, 18, 5, 0), EstadoEvento.PLANIFICADO},
            new Object[]{"FIB 2026 Día 2", "Recinto FIB, Benicàssim", "FIB", LocalDateTime.of(2026, 7, 18, 17, 0), LocalDateTime.of(2026, 7, 19, 5, 0), EstadoEvento.PLANIFICADO},
            new Object[]{"Arenal Sound 2026 Main Stage", "Playa Arenal, Burriana", "Arenal Sound", LocalDateTime.of(2026, 8, 1, 17, 0), LocalDateTime.of(2026, 8, 3, 5, 0), EstadoEvento.PLANIFICADO},
            new Object[]{"Mad Cool Festival Agosto", "Valdebebas, Madrid", "Mad Cool", LocalDateTime.of(2026, 8, 20, 18, 0), LocalDateTime.of(2026, 8, 22, 4, 0), EstadoEvento.PLANIFICADO}
        );

        for (Object[] ev : eventos) {
            String nombre = (String) ev[0];
            if (eventoRepo.findAll().stream().anyMatch(e -> e.getNombre().equals(nombre))) continue;

            Cliente cliente = cli.apply((String) ev[2]);
            EstadoEvento estado = (EstadoEvento) ev[5];

            Evento evento = Evento.builder()
                .nombre(nombre)
                .lugar((String) ev[1])
                .cliente(cliente)
                .fechaInicio((LocalDateTime) ev[3])
                .fechaFin((LocalDateTime) ev[4])
                .estado(estado)
                .build();
            eventoRepo.save(evento);
        }
    }

    private void seedMantenimiento() {
        List<Material> materiales = materialRepo.findAll();
        if (materiales.isEmpty()) return;

        java.util.function.Function<String, Material> findMat = (partial) -> materiales.stream()
            .filter(m -> m.getNombre().contains(partial))
            .findFirst().orElse(null);

        List<Object[]> registros = List.of(
            new Object[]{"Marshall JCM2000", "Ruido en canal limpio al subir volumen master", "ElectrónicaSonido S.L.", LocalDate.of(2026, 3, 10), null, new BigDecimal("280"), EstadoMantenimiento.REPARADO},
            new Object[]{"Robe Robin BMFL", "Prisma atascado — no gira correctamente", "Robe Service Center", LocalDate.of(2026, 4, 5), null, new BigDecimal("950"), EstadoMantenimiento.REPARADO},
            new Object[]{"Yamaha CL5", "Fader de canal 12 sin respuesta", null, LocalDate.of(2026, 5, 20), null, null, EstadoMantenimiento.EN_REVISION},
            new Object[]{"Panasonic PT-RZ770", "Lamp warning — revisar módulo láser", "VideoTécnica Madrid", LocalDate.of(2026, 6, 1), null, null, EstadoMantenimiento.REPARANDO},
            new Object[]{"Motor Lodestar 500kg", "Revisión anual obligatoria + certificado de carga", null, LocalDate.of(2026, 6, 8), null, new BigDecimal("180"), EstadoMantenimiento.EN_REVISION}
        );

        for (Object[] r : registros) {
            Material mat = findMat.apply((String) r[0]);
            if (mat == null) continue;
            LocalDate fechaEntrada = (LocalDate) r[3];
            boolean existe = mantenimientoRepo.findAll().stream()
                .anyMatch(m -> m.getMaterial().getId().equals(mat.getId()) && m.getFechaEntrada().equals(fechaEntrada));
            if (!existe) {
                mantenimientoRepo.save(Mantenimiento.builder()
                    .material(mat)
                    .descripcion((String) r[1])
                    .tecnicoExterno((String) r[2])
                    .fechaEntrada(fechaEntrada)
                    .coste((BigDecimal) r[5])
                    .estado((EstadoMantenimiento) r[6])
                    .build());
            }
        }
    }
}
