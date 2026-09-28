import type { ComponentChildren } from 'preact'

interface ContainerFieldProps {
    id: string
    label: string
    children: ComponentChildren
    className?: string
    error?: string
}

export default function ContainerField({ id, label, children, className = '', error }: ContainerFieldProps) {
    return (
        <div class={"w-full text-white flex flex-col items-start justify-start gap-1.5 " + className}>
            <label htmlFor={id} class={"font-base flex items-center justify-between w-full"}>
                <span>{label}:</span>
            </label>
            {children}
            {error && (
                <span class="text-xs text-rose-400 font-medium transition-all duration-200 flex items-start gap-1.5 mt-0.5 animate-fadeIn">
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
