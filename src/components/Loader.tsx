import { useEffect, useState } from "react";
import type { LoaderProps } from "../interfaces";

export default function Loader({ progress, loaded }: LoaderProps) {
    const [displayProgress, setDisplayProgress] = useState(0);
    const [removed, setRemoved] = useState(false);

    // Smoothly interpolate display progress towards target
    useEffect(() => {
        const target = Math.min(100, Math.max(0, progress));
        const interval = setInterval(() => {
            setDisplayProgress((prev) => {
                if (prev < target) {
                    const step = Math.max(0.75, (target - prev) * 0.18);
                    const next = Math.min(target, prev + step);
                    return next;
                }
                return prev;
            });
        }, 16);

        return () => clearInterval(interval);
    }, [progress]);

    // Derived completion state (no synchronous setState inside effect)
    const isComplete = loaded && displayProgress >= 98;

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                setRemoved(true);
            }, 850);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    if (removed) return null;

    const clampedProgress = Math.min(100, Math.round(displayProgress));

    return (
        <div
            className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0e1014] transition-all duration-700 ease-out select-none ${
                isComplete ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
            }`}
        >

            {/* Word ARCODER with seamless dynamic text gradient fill */}
            <div className="w-[90vw] max-w-190 flex items-center justify-center">
                <svg
                    viewBox="0 0 840 130"
                    className="w-full h-auto overflow-visible select-none"
                >
                    <defs>
                        <linearGradient id="arcoderLoaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset={`${clampedProgress}%`} stopColor="#063B70" />
                            <stop offset={`${clampedProgress}%`} stopColor="#ffffff" />
                        </linearGradient>
                    </defs>
                    <text
                        x="50%"
                        y="50%"
                        dominantBaseline="central"
                        textAnchor="middle"
                        fill="url(#arcoderLoaderGrad)"
                        stroke="url(#arcoderLoaderGrad)"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        fontSize="80"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 900,
                            letterSpacing: "0.2em",
                            paintOrder: "stroke fill",
                        }}
                    >
                        ARCODER
                    </text>
                </svg>
            </div>

            {/* Progress counter & minimalist bar */}
            <div className="mt-8 flex flex-col items-center gap-2.5">
                <span className="text-xs font-mono tracking-widest text-[#9aa3af]/80">
                    {clampedProgress}%
                </span>
                <div className="w-40 h-0.75 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#063B70] transition-all duration-100 ease-out rounded-full shadow-[0_0_8px_#063B70]"
                        style={{ width: `${clampedProgress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
