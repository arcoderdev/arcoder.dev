import { useEffect, useRef, useState } from "react";

const socialLinks = [
    { name: "Facebook", icon: "/icons/facebook.svg", href: "https://www.facebook.com/arcoder.dev" },
    { name: "Instagram", icon: "/icons/instagram.svg", href: "https://www.instagram.com/arcoder.dev" },
    { name: "GitHub", icon: "/icons/github.svg", href: "https://github.com/arcoderdev" },
];

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setEntered(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    return (
        <footer
            ref={footerRef}
            className={`z-50 bg-transparent text-white flex flex-col items-center justify-center px-6 pt-10 pb-7 gap-5 transition-all duration-700 ease-out relative ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >

            {/* Title */}
            <p className="text-base font-normal m-0 tracking-wide text-[#e8e2dc]">
                Síguenos en nuestras redes
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5 md:gap-7">
                {socialLinks.map((social, index) => (
                    <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`footer-social-${social.name.toLowerCase()}`}
                        aria-label={`Seguir en ${social.name}`}
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-115 hover:bg-white/10 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2.5 scale-80"}`}
                        style={!entered ? { transitionDelay: `${0.15 + index * 0.1}s` } : undefined}
                    >
                        <img
                            src={social.icon}
                            alt={social.name}
                            className="size-6 md:size-7 brightness-85 transition-[filter] duration-300 ease-out"
                        />
                    </a>
                ))}
            </div>

            {/* Copyright */}
            <p className="text-sm md:text-base text-center font-light mt-2 text-white/50 tracking-wide">
                © 2026 ARcoder.dev. Todos los derechos reservados.
            </p>
        </footer>
    );
}
