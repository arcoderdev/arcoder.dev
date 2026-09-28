import type { JSX } from "preact"

interface PrivacyFieldProps {
    name?: string
    checked?: boolean
    onChange?: (e: JSX.TargetedEvent<HTMLInputElement, Event>) => void
    required?: boolean
    className?: string
    error?: string
    disabled?: boolean
}

export default function PrivacyField({
    name = 'privacy',
    checked,
    onChange,
    required = true,
    className = '',
    disabled = false,
    error
}: PrivacyFieldProps) {
    return (
        <div class={`w-full flex flex-col gap-1.5 ${className}`}>
            <label htmlFor={name} class={`inline-flex items-center gap-2.5 text-white w-full justify-start select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                    type="checkbox"
                    name={name}
                    id={name}
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    class="accent-blue-page-300 size-4 cursor-pointer rounded disabled:cursor-not-allowed not-disabled:cursor-pointer"
                />
                <p class="text-xs md:text-sm text-white/90">
                    He leído y acepto la <a href="/privacidad" class="underline hover:text-blue-page-100 transition-colors">Política de privacidad.</a>
                </p>
            </label>
            {error && (
                <span class="text-xs text-rose-400 font-medium transition-all duration-200 flex items-center gap-1.5 mt-0.5 animate-fadeIn">
                    <svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </span>
            )}
        </div>
    )
}
