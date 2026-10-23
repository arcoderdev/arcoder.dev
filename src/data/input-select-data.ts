
export interface InputSelectOption {
    label: string
    value: string
}

export interface InputSelectData {
    id: string
    label: string
    options: InputSelectOption[]
}

export const inputRangeData: InputSelectData = {
    id: 'min_budget',
    label: 'Presupuesto minino (Opcional)',
    options: [
        { label: 'Menos de $5,000', value: 'Menos de $5,000' },
        { label: '$5,000 - $10,000', value: '$5,000 - $10,000' },
        { label: '$10,000 - $20,000', value: '$10,000 - $20,000' },
        { label: 'Más de $20,000', value: 'Más de $20,000' },
    ]
}

export const desiredTime: InputSelectData = {
    id: 'desired_time',
    label: 'Plazo deseado',
    options: [
        { label: 'Urgente (menos de 1 mes)', value: 'Urgente (menos de 1 mes)' },
        { label: 'Corto (1-3 meses)', value: 'Corto (1-3 meses)' },
        { label: 'Medio (3-6 meses)', value: 'Medio (3-6 meses)' },
        { label: 'Largo (más de 6 meses)', value: 'Largo (más de 6 meses)' },
    ]
}