import type { JSX } from "preact";
import type { Aplication } from "@data/aplications.data";
import { aplications } from "@data/aplications.data";
import { useEffect, useState } from "preact/hooks";

export default function ItemAplications(): JSX.Element {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % aplications.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const activeItem = aplications[currentIndex] || aplications[0];

    return (
        <div class="relative max-w-100 w-full aspect-square">
            {aplications.map((app, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        key={app.id}
                        class={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                            isActive
                                ? "opacity-100 scale-100 z-10 pointer-events-auto"
                                : "opacity-0 scale-95 z-0 pointer-events-none"
                        }`}
                    >
                        <img
                            src={app.image}
                            width={400}
                            height={400}
                            class="w-full h-full aspect-square object-cover"
                            alt={`${app.name} para realidad virtual`}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                        />
                    </div>
                );
            })}

            {/* Badge único que se desplaza suavemente entre las coordenadas activas */}
            <div class="hero-badges-layer absolute inset-0 pointer-events-none z-20">
                <div
                    class="hero-badge-slot absolute"
                    style={{
                        top: activeItem.position.top,
                        left: activeItem.position.left,
                        transition: "top 700ms cubic-bezier(0.4, 0, 0.2, 1), left 700ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                >
                    <div class="hero-badge-float">
                        <div class="hero-badge-pill pointer-events-auto">
                            <span key={activeItem.id} class="hero-badge-text">
                                {activeItem.name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hero-badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    padding: 4px 12px;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(255, 255, 255, 0.21);
                    border-radius: 9999px;
                    box-shadow:
                        0 8px 24px -2px rgba(0, 0, 0, 0.5),
                        inset 0 1px 1px 0 rgba(255, 255, 255, 0.25);
                    transition:
                        transform 0.25s ease,
                        border-color 0.25s ease,
                        background-color 0.25s ease,
                        box-shadow 0.25s ease;
                    user-select: none;
                }

                @keyframes badgeTextFade {
                    0% {
                        opacity: 0;
                        transform: translateY(3px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-badge-text {
                    display: inline-block;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: normal;
                    letter-spacing: normal;
                    white-space: nowrap;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
                    animation: badgeTextFade 0.35s ease-out;
                }
            `}</style>
        </div>
    );
}
