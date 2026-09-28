export interface MultipleOption {
    label: string
    value: string
}

export interface MultipleSelectData {
    id: string
    label: string
    options: MultipleOption[]
}

export const servicesInterestData: MultipleSelectData = {
    id: 'services_interest',
    label: 'Tipo de servicio de interés:',
    options: [
        { label: 'Arte 3D', value: 'arte_3d' },
        { label: 'Recorridos virtuales', value: 'recorridos_virtuales' },
        { label: 'Edición de imágenes y videos', value: 'edicion_imagenes_videos' },
        { label: 'Páginas Web', value: 'paginas_web' },
        { label: 'Software a la medida', value: 'software_medida' },
        { label: 'Mantenimiento y soporte', value: 'mantenimiento_soporte' },
        { label: 'Otros', value: 'otros' },
    ]
}
