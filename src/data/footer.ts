import { type FooterData } from "@interfaces/footer.interface";
import FacebookIcon from "@icons/FacebookIcon.svg";
import InstagramIcon from "@icons/InstagramIcon.svg";

export const footerContent: FooterData = {
    "website_name": "ARcoder.dev",
    "website_tagline": "Donde la visión digital se convierte en realidad.",
    "navigation_items": [
        {
            "display_name": "Nosotros",
            "pages_links": [
                {
                    "display_name": "Quiénes somos",
                    "url": "/about"
                },
                {
                    "display_name": "Nuestro equipo",
                    "url": "/about#team"
                }
            ]
        },
        {
            "display_name": "Servicios",
            "pages_links": [
                {
                    "display_name": "Arte 3D",
                    "url": "/#arte3D"
                },
                {
                    "display_name": "Diseño de experiencia",
                    "url": "/#uxUi"
                },
                {
                    "display_name": "Recorridos virtuales",
                    "url": "/#recorridos"
                },
                {
                    "display_name": "Edición de imágenes y videos",
                    "url": "/#edicion"
                },
                {
                    "display_name": "Software a la medida",
                    "url": "/#software-a-la-medida"
                },
                {
                    "display_name": "Páginas Web",
                    "url": "/#paginas-web"
                },
                {
                    "display_name": "Implementación de realidad aumentada y virtual",
                    "url": "/#realidad-aumentada-y-virtual"
                }
            ]
        },
        {
            "display_name": "Explora",
            "pages_links": [
                {
                    "display_name": "Inicio",
                    "url": "/"
                },
                {
                    "display_name": "Nuestro portafolio",
                    "url": "/projects"
                },
                {
                    "display_name": "Agenda tu sesión",
                    "url": "#contact-section"
                }
            ]
        },
        {
            "display_name": "Contacto",
            "pages_links": [
                {
                    "display_name": "contacto@arcoder.dev",
                    "url": "mailto:contacto@arcoder.dev"
                },
                {
                    "display_name": "+52 999 547 1550",
                    "url": "tel:+529995471550"
                }
            ]
        }
    ],
    "social_links": [
        {
            "display_name": "ARcoder",
            "url": "https://www.facebook.com/arcoder.dev",
            "icon": FacebookIcon
        },
        {
            "display_name": "ARcoder",
            "url": "https://www.instagram.com/arcoder.dev/",
            "icon": InstagramIcon
        }
    ],
    "extra_links": [
        {
            "display_name": "Privacidad",
            "url": "/legal/privacy"
        }
    ]
}