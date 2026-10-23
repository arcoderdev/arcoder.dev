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
        { label: 'Arte 3D', value: 'Arte 3D' },
        { label: 'Recorridos virtuales', value: 'Recorridos virtuales' },
        { label: 'Edición de imágenes y videos', value: 'Edición de imágenes y videos' },
        { label: 'Páginas Web', value: 'Páginas Web' },
        { label: 'Software a la medida', value: 'Software a la medida' },
        { label: 'Mantenimiento y soporte', value: 'Mantenimiento y soporte' },
        { label: 'Otros', value: 'otros' },
    ]
}
