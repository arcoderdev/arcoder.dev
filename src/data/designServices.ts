export type ServiceId = "arte3D" | "uxUi" | "recorridos" | "edicion";

export interface DesignService {
  id: ServiceId;
  title: string;
  description: string;
}

export const designServices: DesignService[] = [
  {
    id: "arte3D",
    title: "Arte 3D",
    description: "Desde el concept art hasta el modelado de alta poligonización, creamos activos 3D que dan vida a mundos virtuales y experiencias de Realidad Aumentada.",
  },
  {
    id: "uxUi",
    title: "Diseño de experiencia (UX/UI)",
    description: "Interfaces intuitivas y atractivas que no solo se ven bien, sino que son un placer de usar. Pensamos en cada interacción para garantizar una experiencia de usuario excepcional.",
  },
  {
    id: "recorridos",
    title: "Diseño de Recorridos Virtuales",
    description: "Conceptualizamos y creamos los mundos inmersivos para tus recorridos virtuales, diseñando cada detalle para una exploración sin límites.",
  },
  {
    id: "edicion",
    title: "Edición de imágenes y videos",
    description: "La estética importa. Elevamos tu contenido visual con edición de imágenes de alta calidad y producción de video cautivadora que refuerza tu mensaje.",
  },
];
