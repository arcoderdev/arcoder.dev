import { useState, useEffect, useRef } from 'preact/hooks'
import type { JSX } from 'preact'
import ContainerField from './ContainerField'
import MultipleField from './MultipleField'
import PhoneField from './PhoneField'
import PrivacyField from './PrivacyField'
import SelectField from './SelectField'
import TextareaField from './TextareaField'
import TextField from './TextField'
import { desiredTime, inputRangeData } from "@data/input-select-data"
import { servicesInterestData } from "@data/services-data"
import { validateField } from '@utils/formValidation'
import SuccessMessage from './SuccessMessage'

export interface PhoneData {
    lada: string
    number: string
}

export interface ContactFormData {
    fullname: string
    email: string
    phone: PhoneData
    company: string
    services_interest: string[]
    project_description: string
    min_budget: string
    desired_time: string
    privacy: boolean
}

type FormErrors = Partial<Record<keyof ContactFormData, string>>
type TouchedFields = Partial<Record<keyof ContactFormData, boolean>>

const initialFormData: ContactFormData = {
    fullname: '',
    email: '',
    phone: {
        lada: '+52',
        number: ''
    },
    company: '',
    services_interest: [],
    project_description: '',
    min_budget: '',
    desired_time: '',
    privacy: false
}

export default function ContactForm({ className }: { className?: string }) {
    const [formData, setFormData] = useState<ContactFormData>(initialFormData)
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<TouchedFields>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false)
    const successMessageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isSubmittedSuccess && successMessageRef.current) {
            successMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [isSubmittedSuccess])

    const validateForm = (data: ContactFormData): FormErrors => {
        const newErrors: FormErrors = {}
        const keys = Object.keys(data) as (keyof ContactFormData)[]

        for (const key of keys) {
            const error = validateField(key, data[key])
            if (error) {
                newErrors[key] = error
            }
        }

        return newErrors
    }

    const handleFieldChange = (field: keyof ContactFormData, value: any, markAsTouched = false) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        if (markAsTouched) {
            setTouched(prev => ({ ...prev, [field]: true }))
        }

        const fieldError = validateField(field, value)
        setErrors(prev => {
            const next = { ...prev }
            if (fieldError) {
                if (touched[field] || markAsTouched) {
                    next[field] = fieldError
                }
            } else {
                delete next[field]
            }
            return next
        })
    }

    // Manejador de blur (al perder foco)
    const handleBlur = (field: keyof ContactFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        const val = currentValue !== undefined ? currentValue : formData[field]
        const fieldError = validateField(field, val)
        setErrors(prev => {
            const next = { ...prev }
            if (fieldError) {
                next[field] = fieldError
            } else {
                delete next[field]
            }
            return next
        })
    }

    // Envío del formulario
    const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>) => {
        e.preventDefault()

        const currentErrors = validateForm(formData)
        setErrors(currentErrors)

        // Marcar todos como tocados para mostrar errores
        const allTouched: TouchedFields = {}
            ; (Object.keys(formData) as (keyof ContactFormData)[]).forEach(k => {
                allTouched[k] = true
            })
        setTouched(allTouched)

        if (Object.keys(currentErrors).length > 0) {
            // Hacer scroll hacia el primer campo con error
            const firstErrorKey = Object.keys(currentErrors)[0]
            const errorElement = document.getElementById(firstErrorKey)
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                if ('focus' in errorElement) {
                    (errorElement as HTMLElement).focus()
                }
            }
            return
        }

        setIsSubmitting(true)

        try {
            // Simular envío o integración
            await new Promise(resolve => setTimeout(resolve, 1200))
            setIsSubmittedSuccess(true)
            console.log("DATOS DEL FORMULARIO:", formData)
            setFormData(initialFormData)
            setErrors({})
            setTouched({})
        } catch (error) {
            console.error('Error al enviar el formulario:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            class={`flex items-center justify-center flex-col gap-8 w-full p-4 md:p-6 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.25)] outline -outline-offset-1 outline-white/10 backdrop-blur-sm rounded-3xl bg-linear-130 from-white/0 via-white/5 to-white/0 ${className}`}
        >
            {isSubmittedSuccess && (<SuccessMessage setIsSubmittedSuccess={setIsSubmittedSuccess} elementRef={successMessageRef} />)}

            <div class={"w-full flex flex-col md:flex-row lg:flex-col xl:flex-row items-start justify-between gap-8"}>
                <ContainerField id='fullname' label='Nombre completo' error={touched.fullname ? errors.fullname : undefined}>
                    <TextField
                        name='fullname'
                        placeholder='Pedro Pérez'
                        value={formData.fullname}
                        onInput={(e) => handleFieldChange('fullname', e.currentTarget.value)}
                        onBlur={(e) => handleBlur('fullname', e.currentTarget.value)}
                        hasError={Boolean(touched.fullname && errors.fullname)}
                        required
                        disabled={isSubmitting}
                    />
                </ContainerField>

                <ContainerField id='email' label='Correo electrónico' error={touched.email ? errors.email : undefined}>
                    <TextField
                        name='email'
                        type='email'
                        placeholder='tucorreo@ejemplo.com'
                        value={formData.email}
                        onInput={(e) => handleFieldChange('email', e.currentTarget.value)}
                        onBlur={(e) => handleBlur('email', e.currentTarget.value)}
                        hasError={Boolean(touched.email && errors.email)}
                        required
                        disabled={isSubmitting}
                    />
                </ContainerField>
            </div>

            <div class={"w-full flex flex-col md:flex-row lg:flex-col xl:flex-row items-start justify-between gap-8"}>
                <ContainerField id='phone' label='Número de teléfono' error={touched.phone ? errors.phone : undefined}>
                    <PhoneField
                        name='phone'
                        placeholder='000 000 00 00'
                        value={formData.phone.number}
                        lada={formData.phone.lada}
                        onLadaChange={(lada) => handleFieldChange('phone', { ...formData.phone, lada })}
                        onInput={(e) => handleFieldChange('phone', { ...formData.phone, number: e.currentTarget.value })}
                        onBlur={(e) => handleBlur('phone', { ...formData.phone, number: e.currentTarget.value })}
                        hasError={Boolean(touched.phone && errors.phone)}
                        required
                        disabled={isSubmitting}
                    />
                </ContainerField>

                <ContainerField id='company' label='Empresa (opcional)'>
                    <TextField
                        name='company'
                        placeholder='Nombre de tu empresa'
                        value={formData.company}
                        onInput={(e) => handleFieldChange('company', e.currentTarget.value)}
                        onBlur={(e) => handleBlur('company', e.currentTarget.value)}
                        disabled={isSubmitting}
                    />
                </ContainerField>
            </div>

            <ContainerField id={servicesInterestData.id} label={servicesInterestData.label} error={touched.services_interest ? errors.services_interest : undefined}>
                <MultipleField
                    name={servicesInterestData.id}
                    data={servicesInterestData}
                    values={formData.services_interest}
                    onChange={(values) => {
                        handleFieldChange('services_interest', values, true)
                    }}
                    disabled={isSubmitting}
                />
            </ContainerField>

            <ContainerField id='project_description' label='Describe tu proyecto/idea' error={touched.project_description ? errors.project_description : undefined}>
                <TextareaField
                    name='project_description'
                    placeholder='Cuéntanos más sobre tu proyecto, objetivos, desafíos, etc.'
                    value={formData.project_description}
                    onInput={(e) => handleFieldChange('project_description', e.currentTarget.value)}
                    onBlur={(e) => handleBlur('project_description', e.currentTarget.value)}
                    hasError={Boolean(touched.project_description && errors.project_description)}
                    hasCounter
                    required
                    disabled={isSubmitting}
                />
            </ContainerField>

            <div class={"w-full flex flex-col md:flex-row lg:flex-col xl:flex-row items-start justify-between gap-8"}>
                <ContainerField id={inputRangeData.id} label={inputRangeData.label}>
                    <SelectField
                        name={inputRangeData.id}
                        data={inputRangeData}
                        value={formData.min_budget}
                        onChange={(e) => handleFieldChange('min_budget', e.currentTarget.value)}
                        disabled={isSubmitting}
                    />
                </ContainerField>

                <ContainerField id={desiredTime.id} label={desiredTime.label} error={touched.desired_time ? errors.desired_time : undefined}>
                    <SelectField
                        name={desiredTime.id}
                        data={desiredTime}
                        value={formData.desired_time}
                        onChange={(e) => {
                            handleFieldChange('desired_time', e.currentTarget.value, true)
                        }}
                        onBlur={(e) => handleBlur('desired_time', e.currentTarget.value)}
                        hasError={Boolean(touched.desired_time && errors.desired_time)}
                        required
                        disabled={isSubmitting}
                    />
                </ContainerField>
            </div>

            <PrivacyField
                name='privacy'
                checked={formData.privacy}
                onChange={(e) => {
                    handleFieldChange('privacy', e.currentTarget.checked, true)
                }}
                error={touched.privacy ? errors.privacy : undefined}
                required
                disabled={isSubmitting}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                class={`w-full px-3 py-3 md:py-5 text-black bg-white text-xl font-medium transform transition ease-in-out cursor-pointer not-disabled:hover:bg-blue-page-100 active:bg-blue-page-100 outline-none rounded-md flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70`}
            >
                {isSubmitting ? (
                    <>
                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Enviando solicitud...</span>
                    </>
                ) : (
                    'Solicitar cotización'
                )}
            </button>
        </form>
    )
}
