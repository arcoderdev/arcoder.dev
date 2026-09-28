import { useState } from 'preact/hooks'
import { type MultipleSelectData } from '@data/services-data'

interface MultipleFieldProps {
    name: string
    data: MultipleSelectData
    values?: string[]
    defaultValues?: string[]
    onChange?: (values: string[]) => void
    disabled?: boolean
    className?: string
}

export default function MultipleField({
    name,
    data,
    values,
    defaultValues = [],
    onChange,
    disabled = false,
    className = ''
}: MultipleFieldProps) {
    const [internalSelected, setInternalSelected] = useState<string[]>(defaultValues)
    const selectedValues = values ?? internalSelected

    const handleToggle = (optionValue: string) => {
        if (disabled) return
        const next = selectedValues.includes(optionValue)
            ? selectedValues.filter(v => v !== optionValue)
            : [...selectedValues, optionValue]

        setInternalSelected(next)
        if (onChange) onChange(next)
    }

    return (
        <div class={`flex flex-wrap gap-5 items-center ${className}`}>
            {data.options.map((option) => {
                const isSelected = selectedValues.includes(option.value)

                return (
                    <label
                        key={option.value}
                        class={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-base font-normal transition transform ease-in-out duration-200 select-none ${disabled
                            ? 'opacity-50 cursor-not-allowed bg-white/5 border border-white/10 text-white/40'
                            : isSelected
                                ? 'bg-blue-page-300/60 border border-white/20 text-white cursor-pointer'
                                : 'bg-transparent border border-white/20 text-white/50 hover:border-blue-page-300/60 hover:text-white cursor-pointer'
                            }`}
                    >
                        <input
                            type="checkbox"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            disabled={disabled}
                            onChange={() => handleToggle(option.value)}
                            class="sr-only"
                        />
                        <span>{option.label}</span>
                        {isSelected && (
                            <svg
                                class="size-5 shrink-0 stroke-3 text-white transform transition duration-200"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </label>
                )
            })}
        </div>
    )
}
