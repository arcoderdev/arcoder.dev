import type { ContactFormData } from "@common/contact/ContactForm"

export const validateField = (field: keyof ContactFormData, value: any): string | undefined => {
    switch (field) {
        case 'fullname':
            if (typeof value !== 'string' || !value.trim()) {
                return 'El nombre completo es obligatorio.'
            }
            if (value.trim().length < 3) {
                return 'El nombre debe tener al menos 3 caracteres.'
            }
            return undefined

        case 'email':
            if (typeof value !== 'string' || !value.trim()) {
                return 'El correo electrónico es obligatorio.'
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                return 'Ingresa un correo electrónico válido.'
            }
            return undefined

        case 'phone': {
            const rawNumber = typeof value === 'object' && value !== null ? value.number : value
            if (typeof rawNumber !== 'string' || !rawNumber.trim()) {
                return 'El número de teléfono es obligatorio.'
            }
            const digits = rawNumber.replace(/\D/g, '')
            if (digits.length < 8 || digits.length > 15) {
                return 'Ingresa un número telefónico válido (entre 8 y 15 dígitos).'
            }
            return undefined
        }

        case 'company':
            return undefined

        case 'services_interest':
            if (!Array.isArray(value) || value.length === 0) {
                return 'Por favor selecciona al menos un servicio de interés.'
            }
            return undefined

        case 'project_description':
            if (typeof value !== 'string' || !value.trim()) {
                return 'La descripción del proyecto es obligatoria.'
            }
            if (value.trim().length < 10) {
                return 'Cuéntanos un poco más sobre tu proyecto (mínimo 10 caracteres).'
            }
            return undefined

        case 'min_budget':
            return undefined

        case 'desired_time':
            if (!value || value === 'disabled') {
                return 'Selecciona un plazo estimado de entrega.'
            }
            return undefined

        case 'privacy':
            if (!value) {
                return 'Debes aceptar la política de privacidad para continuar.'
            }
            return undefined

        default:
            return undefined
    }
}