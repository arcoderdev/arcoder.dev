import type { JSX } from "preact"
import { useState, useEffect } from "preact/hooks"

interface TextareaFieldProps {
    name: string
    placeholder: string
    disabled?: boolean
    value?: string
    onChange?: (e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => void
    onInput?: (e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => void
    onBlur?: (e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => void
    required?: boolean
    rows?: number
    className?: string
    hasCounter?: boolean
    limit?: number
    charCount?: number
    hasError?: boolean
}

export default function TextareaField({
    name,
    placeholder,
    disabled = false,
    value,
    onChange,
    onInput,
    onBlur,
    required = false,
    rows = 4,
    className = '',
    hasCounter = false,
    limit = 1000,
    charCount,
    hasError = false
}: TextareaFieldProps) {
    const [internalCount, setInternalCount] = useState(value?.length || 0)
    const currentCount = charCount ?? internalCount

    useEffect(() => {
        if (value !== undefined) {
            setInternalCount(value.length)
        }
    }, [value])

    const handleInput = (e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
        setInternalCount(e.currentTarget.value.length)
        if (onInput) onInput(e)
    }

    const handleChange = (e: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
        setInternalCount(e.currentTarget.value.length)
        if (onChange) onChange(e)
    }

    return (
        <div class="w-full flex flex-col gap-2">
            <textarea
                name={name}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleChange}
                onInput={handleInput}
                onBlur={onBlur}
                required={required}
                value={value}
                rows={rows}
                maxLength={limit}
                class={`w-full max-h-60 p-3 border-2 rounded-md text-white placeholder:text-white/20 outline-none transition-colors duration-300 font-base resize-none ${disabled
                        ? 'bg-white/10 cursor-not-allowed border-white/20'
                        : hasError
                        ? 'border-rose-500/80 focus:border-rose-400 bg-rose-500/5'
                        : 'border-white/20 hover:border-blue-page-100 focus:border-blue-page-300 active:border-blue-page-300'
                    } ${className}`}
            />
            {hasCounter && (
                <div class="ml-auto text-white/20">
                    <span class="text-base">{currentCount} / {limit}</span>
                </div>
            )}
        </div>
    )
}
