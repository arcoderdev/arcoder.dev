import { useState, useEffect, useMemo } from "preact/hooks";
import { filterData, projectsData } from "@data/projects-data";
import Filter from "./content/Filter";
import ProjectsGrid from "./content/ProjectsGrid";
import Pagination from "./content/Pagination";
import ProjectsSkeleton from "./content/Skeleton";
import Blob from "@assets/projects/blob.svg";

interface ProjectsSectionProps {
    initialCategory?: string;
    initialPage?: number;
}

const ITEMS_PER_PAGE = 4;

export default function ProjectsSection({
    initialCategory = "all",
    initialPage = 1,
}: ProjectsSectionProps) {
    const blobSrc = typeof Blob === "string" ? Blob : (Blob as any)?.src || Blob;
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    // Sincronizar de inmediato con los parámetros de la URL al montar en el cliente
    useEffect(() => {
        const syncFromURL = () => {
            const params = new URLSearchParams(window.location.search);
            const categoryFromUrl = params.get("category") || "all";
            const pageFromUrl = parseInt(params.get("page") || "1", 10);

            // Si la categoría no existe en los filtros, redirigir a /projects
            if (categoryFromUrl !== "all" && !filterData.some((item) => item.id === categoryFromUrl)) {
                if (typeof window !== "undefined") {
                    window.location.replace("/projects");
                }
                return;
            }

            setSelectedCategory(categoryFromUrl);
            setCurrentPage(isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl);
            setIsLoading(false);
        };

        syncFromURL();
        window.addEventListener("popstate", syncFromURL);
        return () => window.removeEventListener("popstate", syncFromURL);
    }, []);

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            if (category === "all") {
                url.searchParams.delete("category");
            } else {
                url.searchParams.set("category", category);
            }
            url.searchParams.delete("page");
            window.history.pushState({ category, page: 1 }, "", url);

            const section = document.getElementById("projects");
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            if (page === 1) {
                url.searchParams.delete("page");
            } else {
                url.searchParams.set("page", page.toString());
            }
            window.history.pushState({ category: selectedCategory, page }, "", url);

            // Desplazar suavemente hacia la sección de proyectos
            const section = document.getElementById("projects");
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    // 1. Filtrar proyectos por categoría
    const filteredProjects = useMemo(() => {
        if (selectedCategory === "all") {
            return projectsData;
        }
        return projectsData.filter((project) => project.category === selectedCategory);
    }, [selectedCategory]);

    // 2. Calcular total de páginas según la cantidad de proyectos filtrados
    const totalPages = useMemo(() => {
        return Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    }, [filteredProjects.length]);

    // 3. Obtener únicamente los proyectos de la página actual (máximo 4)
    const paginatedProjects = useMemo(() => {
        const validPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
        const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
        return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProjects, currentPage, totalPages]);

    return (
        <section id="projects" class="relative mt-14 2xl:mt-28 py-6 md:py-24">
            <img
                src={blobSrc}
                alt="Blob 1"
                class="absolute aspect-364/464 w-[364px] h-auto top-50 -left-30 z-[-2] pointer-events-none select-none blur-[150px]"
            />

            <div class="max-w-360 mx-auto px-6 2xl:px-0 w-full flex flex-col gap-16">
                {isLoading ? (
                    <ProjectsSkeleton />
                ) : (
                    <>
                        <Filter
                            categories={filterData}
                            selectedCategory={selectedCategory}
                            onSelectCategory={handleSelectCategory}
                        />

                        <ProjectsGrid projects={paginatedProjects} />

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                category={selectedCategory}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
