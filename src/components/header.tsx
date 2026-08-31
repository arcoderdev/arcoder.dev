import { useEffect, useState } from "react";

export default function Header() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <header
            className={`z-50 pointer-events-none transition-all duration-600 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
        >
            <div className="mx-auto flex items-center justify-between px-6 md:px-8 h-20 max-w-312">
                {/* Logo with cloud behind */}
                <div className="relative flex items-end  gap-2.5 pointer-events-auto">
                    {/* Logo SVG */}
                    <img
                        src="/logo.png"
                        alt="ARcoder logo"
                        className="relative z-1 w-13 h-auto"
                    />
                    {/* Brand text */}
                    <span className="hidden md:block relative z-1 font-semibold text-lg text-[#1a1d21] tracking-tight leading-3">
                        ARcoder
                    </span>
                </div>

                {/* CTA Button */}
                <a
                    href="https://www.facebook.com/arcoder.dev"
                    id="header-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Quiero conocer más"
                    className="pointer-events-auto inline-flex items-center justify-center px-7 py-3 bg-[#1a1d21] text-white text-sm font-medium rounded-full no-underline cursor-pointer shadow-md transition-all duration-300 ease-out hover:bg-[#2a2d32] hover:-translate-y-0.5 hover:shadow-lg"
                >
                    Quiero conocer más
                </a>
            </div>
        </header>
    );
}
