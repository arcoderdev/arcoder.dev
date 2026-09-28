import { useState, useRef, useEffect } from 'preact/hooks'
import type { JSX } from 'preact'
import phoneCodesData from '../../data/phoneCodes.json'

export interface CountryCode {
    name: string
    code: string
    dialCode: string
    flag: string
}

interface PhoneFieldProps {
    name: string
    placeholder?: string
    disabled?: boolean
    value?: string
    lada?: string
    onLadaChange?: (lada: string) => void
    onChange?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    onInput?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    onBlur?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    defaultCountryCode?: string
    required?: boolean
    className?: string
    hasError?: boolean
}

export default function PhoneField({
    name,
    placeholder = '000 000 00 00',
    disabled = false,
    value,
    lada,
    onLadaChange,
    onChange,
    onInput,
    onBlur,
    defaultCountryCode = 'MX',
    required = false,
    className = '',
    hasError = false
}: PhoneFieldProps) {
    const countries = phoneCodesData as CountryCode[]
    const defaultCountry = countries.find(c => c.code === defaultCountryCode) || countries[0]

    const initialCountry = lada
        ? countries.find(c => c.dialCode === lada) || defaultCountry
        : defaultCountry

    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initialCountry)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (lada && lada !== selectedCountry.dialCode) {
            const found = countries.find(c => c.dialCode === lada)
            if (found) {
                setSelectedCountry(found)
            }
        }
    }, [lada])

    const handleSelectCountry = (country: CountryCode) => {
        setSelectedCountry(country)
        setIsOpen(false)
        if (onLadaChange) {
            onLadaChange(country.dialCode)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    return (
        <div ref={dropdownRef} class="relative w-full">
            {/* Input oculto para enviar la clave de país/lada seleccionada en formularios */}
            <input type="hidden" name={`${name}_code`} value={selectedCountry.dialCode} />
            <input type="hidden" name={`${name}_country`} value={selectedCountry.code} />

            {/* Contenedor principal con borde y hover/focus unificado */}
            <div
                class={`flex items-center w-full border-2 rounded-md transition-colors duration-300 ${disabled
                    ? 'bg-white/10 cursor-not-allowed border-white/10'
                    : hasError
                        ? 'border-rose-500/80 focus-within:border-rose-400 bg-rose-500/5'
                        : 'border-white/20 hover:border-blue-page-100 focus-within:border-blue-page-300 active:border-blue-page-300'
                    } ${className}`}
            >
                {/* Selector de ladas (botón izquierdo) */}
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsOpen(prev => !prev)}
                    aria-label={`Seleccionar lada telefónica, actual: ${selectedCountry.name} ${selectedCountry.dialCode}`}
                    aria-expanded={isOpen}
                    class={`w-24 flex items-center justify-between gap-2.5 px-3.5 py-3 border-r border-white/20 bg-white/4 transition-colors rounded-l-sm shrink-0 text-white font-base select-none outline-none focus:outline-none ${disabled
                        ? 'cursor-not-allowed opacity-60'
                        : 'cursor-pointer hover:bg-white/8'
                        }`}
                >
                    <span class="tracking-wide text-white text-base">
                        {selectedCountry.dialCode}
                    </span>
                    <svg
                        class={`size-4 text-white/80 transition-transform duration-200 stroke-3 ${isOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {/* Campo de número telefónico */}
                <input
                    type="tel"
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    class="w-full p-3 bg-transparent text-white placeholder:text-white/20 outline-none font-base disabled:cursor-not-allowed"
                    disabled={disabled}
                    onChange={onChange}
                    onInput={onInput}
                    onBlur={onBlur}
                    required={required}
                    maxLength={10}
                    value={value}
                    autocomplete={'off'}
                />
            </div>

            {/* Dropdown flotante con las ladas disponibles */}
            {isOpen && (
                <div class="scroll absolute top-[calc(100%+6px)] left-0 w-52 max-h-60 overflow-y-auto rounded-md bg-black-page-800 border border-white/20 shadow-2xl z-50 py-1.5 backdrop-blur-md">
                    <ul class="flex flex-col m-0 p-0 list-none">
                        {countries.map((country) => {
                            const isSelected = country.code === selectedCountry.code
                            return (
                                <li key={country.code}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCountry(country)}
                                        class={`flex items-center justify-between w-full px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer ${isSelected
                                            ? 'bg-blue-page-700/50 text-white font-medium'
                                            : 'text-white/90 hover:bg-white/10'
                                            }`}
                                    >
                                        <div class="flex items-center gap-2.5 min-w-0 pr-2">
                                            <span class="truncate text-xs">{country.name}</span>
                                        </div>
                                        <span class="text-white/60 font-mono text-xs shrink-0">
                                            {country.dialCode}
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </div>
    )
}
