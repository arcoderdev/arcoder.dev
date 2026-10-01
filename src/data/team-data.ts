import FacebookIcon from "@icons/FacebookIcon.svg"
import InstagramIcon from "@icons/InstagramIcon.svg"
import TiktokIcon from "@icons/TiktokIcon.svg"
import YoutubeIcon from "@icons/YoutubeIcon.svg"
import GithubIcon from "@icons/GithubIcon.svg"

interface SocialMedia {
    icon: typeof FacebookIcon,
    name: string,
    url: string
}

export interface TeamMember {
    id: number;
    fullName: string;
    shortName: string;
    description: string;
    positions: string[];
    image: string;
    socialMedias: SocialMedia[];
    color: string;
}

export const teamData: TeamMember[] = [
    {
        id: 1,
        fullName: "Jorge Enrique Jiménez Moreno",
        shortName: "Jorge Jiménez",
        description: "Me destaco por resolver problemas complejos de forma creativa y eficiente. Soy una persona orientada a resultados, en constante aprendizaje y con la habilidad de adaptarme rápidamente a los cambios y nuevos retos.",
        positions: ["Diseñador", "Editor de Videos", "Diseñador 3D", "Desarrollador AR/VR"],
        image: "/team/jorge-jimenez.webp",
        socialMedias: [
            {
                icon: FacebookIcon,
                name: "Facebook",
                url: "https://www.facebook.com/TheSeven741"
            },
            {
                icon: InstagramIcon,
                name: "Instagram",
                url: "https://www.instagram.com/seven_741"
            },
            {
                icon: TiktokIcon,
                name: "Tiktok",
                url: "https://www.tiktok.com/@dragonpunchspiderz"
            },
            {
                icon: YoutubeIcon,
                name: "Youtube",
                url: "https://www.youtube.com/@dragonpunchz"
            }
        ],
        color: "#90CAF9"
    },
    {
        id: 2,
        fullName: "Antonio de Jesús Loya Castillo",
        shortName: "Antonio Loya",
        description: "Una mezcla de curiosidad insaciable y enfoque práctico. Me apasiona conectar puntos que otros no ven, aprender algo nuevo cada día y aportar una perspectiva auténtica y vibrante en todo lo que hago.",
        positions: ["Desarrollador Web", "Desarrollador de Apps", "Desarrollador AR/VR"],
        image: "/team/antonio-loya.webp",
        socialMedias: [
            {
                icon: InstagramIcon,
                name: "Instagram",
                url: "https://www.instagram.com/_antonioloya"
            },
            {
                icon: GithubIcon,
                name: "GitHub",
                url: "https://github.com/AntonioLoya"
            },
        ],
        color: "#90CAF9"
    },
    {
        id: 3,
        fullName: "César Adrián Hernández Hernández",
        shortName: "Adrián Hernández",
        description: "Me considero una persona enfocada en el crecimiento personal y profesional. Valoro la comunicación abierta, el trabajo en equipo y la disciplina, buscando siempre dejar un impacto positivo en mi entorno.",
        positions: ["Desarrollador Web", "Diseñador UX/UI"],
        image: "/team/adrian-hdz.webp",
        socialMedias: [
            {
                icon: InstagramIcon,
                name: "Instagram",
                url: "https://www.instagram.com/adrianh_2_"
            },
            {
                icon: GithubIcon,
                name: "GitHub",
                url: "https://github.com/adrianhdez2"
            },
        ],
        color: "#90CAF9"
    }
]