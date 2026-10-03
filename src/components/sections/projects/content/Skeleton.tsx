export default function ProjectsSkeleton() {
    return (
        <div class="w-full flex flex-col gap-16 animate-pulse">
            <div class="w-full overflow-x-auto flex items-center justify-between gap-5 pb-2 scroll-filter">
                {[160, 170, 140, 120, 150, 180, 200].map((width, i) => (
                    <div
                        key={i}
                        style={{ width: `${width}px` }}
                        class="h-12 shrink-0 rounded-lg bg-white/10 backdrop-blur-xl"
                    />
                ))}
            </div>

            {/* Skeleton de la cuadrícula de proyectos (máximo 4) */}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10">
                {[1, 2].map((i) => (
                    <div key={i} class="flex flex-col items-start gap-8">
                        <div class="w-full aspect-16/10 rounded-[40px] bg-white/5 border border-white/10" />
                        <div class="flex flex-col gap-3 w-full">
                            <div class="h-6 w-3/4 rounded-md bg-white/15" />
                            <div class="h-4 w-full rounded-md bg-white/10" />
                            <div class="h-4 w-5/6 rounded-md bg-white/10" />
                        </div>
                        <div class="h-12 w-44 rounded-4xl bg-white/10 border border-white/10" />
                    </div>
                ))}
            </div>
        </div>
    );
}