
function Square() {
    return (
        <div class="size-25 lg:size-50 bg-white/5 rounded-xl shadow-[0px_4px_4px_0px_rgba(255,255,255,0.05)] border border-white/5 backdrop-blur-xl"></div>
    )
}


export default function UserPreview({ srcImage, altImage }: { srcImage: string, altImage: string }) {
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
                        <img class="size-25 lg:size-50 rounded-xl object-cover object-bottom blur-[10px]" alt={altImage} src={srcImage} />
                        <img class="size-25 lg:size-50 rounded-xl object-cover object-bottom absolute inset-0" alt={altImage} src={srcImage} />
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
