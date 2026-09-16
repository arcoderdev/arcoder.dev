import { type FooterData } from "@interfaces/footer.interface";
import FacebookIcon from "@icons/FacebookIcon.astro";
import InstagramIcon from "@icons/InstagramIcon.astro";

export const footerContent: FooterData = {
    "website_name": "ARcoder.dev",
    "website_tagline": "Donde la visión digital se convierte en realidad.",
    "navigation_items": [
        {
            "display_name": "Nosotros",
            "pages_links": [
                {
                    "display_name": "Quiénes somos",
                    "url": "#"
                },
                {
                    "display_name": "Nuestro equipo",
                    "url": "#"
                }
            ]
        },
        {
            "display_name": "Servicios",
            "pages_links": [
                {
                    "display_name": "Arte 3D",
                    "url": "#"
                },
                {
                    "display_name": "Diseño de experiencia",
                    "url": "#"
                },
                {
                    "display_name": "Recorridos virtuales",
                    "url": "#"
                },
                {
                    "display_name": "Edición de imágenes y videos",
                    "url": "#"
                },
                {
                    "display_name": "Software a la medida",
                    "url": "#"
                },
                {
                    "display_name": "Páginas Web",
                    "url": "#"
                },
                {
                    "display_name": "Implementación de realidad aumentada y virtual",
                    "url": "#"
                }
            ]
        },
        {
            "display_name": "Explora",
            "pages_links": [
                {
                    "display_name": "Inicio",
                    "url": "#"
                },
                {
                    "display_name": "Nuestro portafolio",
                    "url": "#"
                },
                {
                    "display_name": "Agenda tu sesión",
                    "url": "#"
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
    ]
}