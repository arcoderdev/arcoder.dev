import type { RefObject } from 'preact'

interface Props {
    elementRef?: RefObject<HTMLDivElement>
    setIsSubmittedSuccess: (value: boolean) => void
}

export default function SuccessMessage({ elementRef, setIsSubmittedSuccess }: Props) {
    return (
        <div ref={elementRef} id={"success-message"} class="w-full p-4 rounded-xl bg-blue-page-900/90 border border-blue-page-300/40 text-white flex items-start gap-3 shadow-lg animate-fadeIn">
            <svg class="size-6 text-blue-page-300 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div class="flex-1 text-sm md:text-base">
                <p class="font-medium text-blue-page-100">¡Solicitud recibida con éxito!</p>
                <p class="text-white/80 mt-1">Gracias por contactarnos. Nuestro equipo revisará los detalles de tu proyecto y te responderemos a la brevedad.</p>
                <button
                    type="button"
                    onClick={() => setIsSubmittedSuccess(false)}
                    class="mt-3 text-xs md:text-sm text-blue-page-300 hover:text-white underline cursor-pointer"
                >
                    Enviar otra solicitud
                </button>
            </div>
        </div>
    )
}
