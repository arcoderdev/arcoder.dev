
export default function Heading({ title, description }: { title: string, description: string }) {
    return (
        <div class="text-white">
            <h3 class="text-2xl lg:text-4xl font-bold text-left leading-relaxed mb-1 uppercase">
                {title}
            </h3>
            <p class="font-medium text-base lg:text-xl text-white/80 leading-relaxed">
                {description}
            </p>
        </div>
    )
}
