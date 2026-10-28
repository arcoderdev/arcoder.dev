
import { useEffect, useRef, useState } from "preact/hooks";

function Square() {
    return (
        <div class="size-25 lg:size-50 bg-white/5 rounded-xl shadow-[0px_4px_4px_0px_rgba(255,255,255,0.05)] border border-white/5 backdrop-blur-xl"></div>
    )
}


export default function UserPreview({ srcImage, altImage }: { srcImage: string, altImage: string }) {
    const [displayedSrc, setDisplayedSrc] = useState(srcImage);
    const [previousSrc, setPreviousSrc] = useState<string | null>(null);
    const [showNewImage, setShowNewImage] = useState(true);
    const displayedSrcRef = useRef(srcImage);

    useEffect(() => {
        if (srcImage === displayedSrcRef.current) return;

        setPreviousSrc(displayedSrcRef.current);
        displayedSrcRef.current = srcImage;
        setDisplayedSrc(srcImage);
        setShowNewImage(false);

        const animationFrame = window.requestAnimationFrame(() => {
            setShowNewImage(true);
        });
        const timeoutId = window.setTimeout(() => {
            setPreviousSrc(null);
        }, 700);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.clearTimeout(timeoutId);
        };
    }, [srcImage]);

    return (
        <div class="w-69.25 min-w-69.25 h-60.75 lg:w-127.5 lg:h-111.25 lg:min-w-127.5 overflow-hidden relative flex items-center justify-center">
            <div class="w-full h-full absolute overflow-hidden inset-0 z-0">
                <div class="w-full h-full scale-[106%] z-[1] absolute inset-0 radialImage"></div>

                {/* left */}
                <div class={"-left-8 -top-12.5 lg:-left-17.25 lg:-bottom-38.75 absolute flex flex-col gap-6"}>
                    <Square />
                    <Square />
                    <Square />
                </div>

                {/* center */}
                <div class={"left-21.5 -top-16 lg:left-38.75 lg:-top-23 absolute flex flex-col gap-6"}>
                    <Square />

                    <div class={"relative"}>
                        <img
                            class="size-25 lg:size-50 rounded-xl object-cover object-bottom blur-[10px] transition-opacity duration-700 ease-in-out"
                            alt=""
                            aria-hidden="true"
                            src={displayedSrc}
                            style={{ opacity: showNewImage ? 1 : 0 }}
                        />
                        {previousSrc && (
                            <img
                                class="size-25 lg:size-50 rounded-xl object-cover object-bottom blur-[10px] absolute inset-0 transition-opacity duration-700 ease-in-out"
                                alt=""
                                aria-hidden="true"
                                src={previousSrc}
                                style={{ opacity: showNewImage ? 0 : 1 }}
                            />
                        )}
                        <img
                            class="size-25 lg:size-50 rounded-xl object-cover object-bottom absolute inset-0 transition-opacity duration-700 ease-in-out"
                            alt={altImage}
                            src={displayedSrc}
                            style={{ opacity: showNewImage ? 1 : 0 }}
                        />
                        {previousSrc && (
                            <img
                                class="size-25 lg:size-50 rounded-xl object-cover object-bottom absolute inset-0 transition-opacity duration-700 ease-in-out"
                                alt=""
                                aria-hidden="true"
                                src={previousSrc}
                                style={{ opacity: showNewImage ? 0 : 1 }}
                            />
                        )}
                    </div>

                    <Square />
                </div>

                {/* right */}
                <div class={"-right-8.25 -top-20.75 lg:-right-17.25 lg:-top-38.5 absolute flex flex-col gap-6"}>
                    <Square />
                    <Square />
                    <Square />
                </div>

                <div class="w-44 h-40 bg-blue-page-300/60 blur-[250px] -z-[2]"></div>
            </div>
        </div>
    )
}
