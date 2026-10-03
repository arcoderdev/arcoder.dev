import { useState } from "preact/hooks";
import Heading from "./testimonials/Heading";
import Testimonial from "./testimonials/Testimonial";
import { testimonialData } from "@data/testimonial-data";

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleNextItem = () => {
        if (currentIndex < testimonialData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePreviousItem = () => {
        if (currentIndex > 0) {
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
                    key={currentItemActive.id}
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
