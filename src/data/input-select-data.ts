
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
            { label: 'Menos de $5,000', value: '5000' },
            { label: '$5,000 - $10,000', value: '10000' },
            { label: '$10,000 - $20,000', value: '20000' },
            { label: 'Más de $20,000', value: '20001' },
        ]
}

export const desiredTime: InputSelectData = {
        id: 'desired_time',
        label: 'Plazo deseado',
        options: [
            { label: 'Urgente (menos de 1 mes)', value: 'less_than_month' },
            { label: 'Corto (1-3 meses)', value: '1_3_months' },
            { label: 'Medio (3-6 meses)', value: '3_6_months' },
            { label: 'Largo (más de 6 meses)', value: 'more_than_6_months' },
        ]
    }