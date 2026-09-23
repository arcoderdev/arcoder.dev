import type { CardData } from "@interfaces/card.interface";
import { Monitor, TabletSmartphone, Shield, MonitorSmartphone, Zap, Box, Gamepad2, RectangleGoggles } from "@lucide/astro";

export const cardData: CardData[] = [
    {
        imageSrc: "/desarrollamos/software.webp",
        details: [
            { icon: Monitor, labelText: "Apps para escritorio" },
            { icon: TabletSmartphone, labelText: "Apps para dispositivos móviles" },
        ],
        labelBadge: "Desarrollamos",
        title: "Software a la medida",
        description: "Construimos software a la medida para desktop y dispositivos móviles, optimizado para rendimiento y escalabilidad, resolviendo tus desafíos más complejos con soluciones innovadoras.",
        classColor: "#062543"
    },
    {
        imageSrc: "/desarrollamos/paginas-web.webp",
        details: [
            { icon: Zap, labelText: "Carga instantánea" },
            { icon: Shield, labelText: "Seguridad avanzada" },
            { icon: MonitorSmartphone, labelText: "Diseño multiplataforma" },
        ],
        labelBadge: "Desarrollamos",
        title: "Páginas Web",
        description: "No solo diseñamos webs atractivas, las programamos para ser rápidas, seguras y dinámicas, ofreciendo experiencias de usuario fluidas y optimizadas para cualquier dispositivo.",
        classColor: "#063B70"
    },
    {
        imageSrc: "/desarrollamos/ra-vr.webp",
        details: [
            { icon: Box, labelText: "Gráficos 3D de alta fidelidad" },
            { icon: RectangleGoggles, labelText: "Experiencias multiplataforma" },
            { icon: Gamepad2, labelText: "Interacciones intuitivas" },
        ],
        labelBadge: "Desarrollamos",
        title: "Implementación de realidad aumentada y virtual",
        description: "Llevamos tus diseños de Realidad Aumentada y Virtual a la vida, con implementaciones técnicas impecables que ofrecen inmersión y funcionalidad sin precedentes.",
        classColor: "#062543"
    }
]