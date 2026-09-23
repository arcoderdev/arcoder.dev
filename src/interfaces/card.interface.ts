import type { Monitor } from "@lucide/astro";

export interface Details {
    /** Icono para detalles */
    icon: typeof Monitor;
    /** Texto: ejemplo - Apps para escritorio */
    labelText: string;
}

export interface CardData {
    /** Imagen de la tarjeta */
    imageSrc: string;
    /** Detalles: icono y texto */
    details: Details[];
    /** Icono para la etiqueta */
    icon?: typeof Monitor;
    /** Etiqueta: ejemplo - Desarrollamos */
    labelBadge: string;
    /** Título de la tarjeta */
    title: string;
    /** Descripción */
    description: string;
    /** Color del fondo */
    classColor?: string;
}