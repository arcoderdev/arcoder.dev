import type { JSX } from "preact"

interface TextFieldProps {
    type?: "email" | "text"
    name: string
    placeholder: string
    disabled?: boolean
    value?: string
    onChange?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    onInput?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    onBlur?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    required?: boolean
    className?: string
    hasError?: boolean
}

export default function TextField({
    name,
    placeholder,
    disabled = false,
    value,
    onChange,
    onInput,
    onBlur,
    type = 'text',
    required = false,
    className = '',
    hasError = false
}: TextFieldProps) {
    return (
        <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            class={`w-full p-3 border-2 rounded-md text-white placeholder:text-white/20 outline-none transition-colors duration-300 font-base ${
                disabled
                    ? 'bg-white/10 cursor-not-allowed border-white/20'
                    : hasError
                    ? 'border-rose-500/80 focus:border-rose-400 bg-rose-500/5'
                    : 'border-white/20 hover:border-blue-page-100 focus:border-blue-page-300 active:border-blue-page-300'
            } ${className}`}
            disabled={disabled}
            onChange={onChange}
            onInput={onInput}
            onBlur={onBlur}
            required={required}
            autoComplete={"off"}
            value={value}
        />
    )
}
