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

export const initialFormData: ContactFormData = {
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