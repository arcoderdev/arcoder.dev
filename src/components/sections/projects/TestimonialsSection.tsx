import { useEffect, useRef, useState } from "preact/hooks";
import Heading from "./testimonials/Heading";
import Testimonial from "./testimonials/Testimonial";
import { testimonialData } from "@data/testimonial-data";

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [autoplayPaused, setAutoplayPaused] = useState<boolean>(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (autoplayPaused || testimonialData.length < 2) return;

        timeoutRef.current = window.setTimeout(() => {
            timeoutRef.current = null;
            setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
        }, 5000);

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [autoplayPaused, currentIndex]);

    const pauseAutoplay = () => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setAutoplayPaused(true);
    };

    const handleNextItem = () => {
        if (currentIndex < testimonialData.length - 1) {
            pauseAutoplay();
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePreviousItem = () => {
        if (currentIndex > 0) {
            pauseAutoplay();
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const currentItemActive = testimonialData[currentIndex] || testimonialData[0];

    return (
        <section id="testimonials" class="relative mt-14 2xl:mt-28 py-6 md:py-11">
            <div class={"max-w-360 mx-auto gap-14 flex flex-col px-6 2xl:px-0"}>
                <Heading
                    title="Lo que dicen nuestros clientes"
                    description="La voz de nuestros socios. Descubre las experiencias y los resultados que hemos logrado al transformar las visiones de nuestros clientes en realidades digitales exitosas."
                />

                <Testimonial
                    testimonialData={currentItemActive}
                    handleNextItem={handleNextItem}
                    handlePreviousItem={handlePreviousItem}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === testimonialData.length - 1}
                />
            </div>
        </section>
    );
}
