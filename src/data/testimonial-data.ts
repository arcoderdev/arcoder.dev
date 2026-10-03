export interface TestimonialInterface {
    id: number;
    fullName: string;
    testimonial: string;
    imgSrc: string;
}

export const testimonialData: TestimonialInterface[] = [
    {
        id: 1,
        fullName: "Jorge Enrique Jiménez Moreno",
        testimonial: "Trabajar con ARCODER.DEV ha sido una revelación. Necesitábamos una solución que combinara una plataforma web robusta con una experiencia de Realidad Aumentada interactiva para nuestro nuevo producto, y superaron todas nuestras expectativas.",
        imgSrc: "/testimonial/example-1.jpg",
    },
    {
        id: 2,
        fullName: "Antonio de Jesús Loya Castillo",
        testimonial: "Excelente equipo y gran capacidad técnica. Desarrollaron nuestra plataforma con una calidad visual impresionante y cumpliendo cada objetivo antes de lo previsto.",
        imgSrc: "/testimonial/example-2.jpg",
    },
];