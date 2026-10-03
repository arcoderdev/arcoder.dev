import { projectsData, type Project } from "@data/projects-data";

interface ProjectsGridProps {
    projects?: Project[];
}

export default function ProjectsGrid({ projects = projectsData }: ProjectsGridProps) {
    return (
        <div>
            {projects.length > 0 ? (
                <div
                    id="projects-grid"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10"
                >
                    {projects.map((project, index) => (
                        <article
                            key={`${project.id}-${project.category}-${index}`}
                            data-project-card
                            data-category={project.category}
                            class="project-card group flex flex-col items-start justify-start gap-8"
                        >
                            <div class="relative w-full aspect-16/10 overflow-hidden bg-black/40 rounded-xl md:rounded-[40px]">
                                <img
                                    src={project.srcImage}
                                    alt={project.title}
                                    loading="lazy"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 origin-center"
                                />
                            </div>

                            <div class="flex flex-col gap-3 flex-1">
                                <h3 class="text-base lg:text-xl 2xl:text-2xl font-medium text-white">
                                    {project.title}
                                </h3>

                                <p class="text-base text-white/80 flex-1">
                                    {project.description}
                                </p>
                            </div>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center text-white border border-white hover:bg-white hover:text-black w-fit rounded-4xl px-6 py-3 gap-3 text-base transition-colors duration-500 ease-in-out"
                            >
                                Ver proyecto
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="size-4 transition-transform group-hover:translate-x-0.5"
                                >
                                    <path d="M18 8L22 12L18 16" />
                                    <path d="M2 12H22" />
                                </svg>
                            </a>
                        </article>
                    ))}
                </div>
            ) : null}

            {/* Estado vacío cuando no hay proyectos */}
            <div
                id="projects-empty"
                class={`${projects.length === 0 ? "flex" : "hidden"
                    } py-20 text-center flex-col items-center justify-center`}
            >
                <div
                    class="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                </div>
                <h4 class="text-lg font-medium text-white mb-1">
                    No hay proyectos disponibles
                </h4>
                <p class="text-sm text-gray-400 max-w-sm mx-auto">
                    Aún no hemos publicado proyectos en esta categoría. Vuelve a
                    consultar pronto.
                </p>
            </div>
        </div>
    );
}
