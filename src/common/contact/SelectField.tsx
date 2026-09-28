import type { InputSelectData } from "@data/input-select-data";
import type { JSX } from "preact";

interface SelectFieldProps {
    name: string
    placeholder?: string
    data: InputSelectData
    value?: string
    onChange?: (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => void
    onBlur?: (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => void
    disabled?: boolean
    className?: string
    required?: boolean
    hasError?: boolean
}

export default function SelectField({
    data,
    onChange,
    onBlur,
    name,
    placeholder = 'Selecciona una opción',
    disabled = false,
    className = '',
    required = false,
    value,
    hasError = false
}: SelectFieldProps) {
    return (
        <select
            name={name}
            id={name}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            class={`w-full p-3 bg-white/10 rounded-md backdrop-blur-xl outline-none border-2 transition-colors duration-300 text-base appearance-auto ${
                disabled
                    ? 'bg-white/10 cursor-not-allowed text-white/20 border-transparent'
                    : hasError
                    ? 'border-rose-500/80 focus:border-rose-400 bg-rose-500/5 text-white'
                    : 'border-transparent hover:border-blue-page-100 focus:border-blue-page-300 active:border-blue-page-300 cursor-pointer text-white'
            } ${className}`}
        >
            <option value="" disabled class="bg-blue-page-900 text-white/50">
                {placeholder}
            </option>
            {data.options.map((option, _i) => (
                <option key={_i} value={option.value} class="bg-blue-page-900 text-white select-none">
                    {option.label}
                </option>
            ))}
        </select>
    )
}
