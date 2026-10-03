import { useEffect, useState, useMemo } from "preact/hooks";

interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    category?: string;
    onPageChange?: (page: number) => void;
}

type PaginationItem = number | "...";

function getPaginationRange(
    currentPage: number,
    totalPages: number,
    siblings: number = 1
): PaginationItem[] {
    const totalNumbers = siblings * 2 + 5;

    // Si el total de páginas cabe sin recortar
    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Caso 1: Solo elipsis a la derecha (ej: 1 2 3 4 5 ... 34)
    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblings;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, "...", totalPages];
    }

    // Caso 2: Solo elipsis a la izquierda (ej: 1 ... 30 31 32 33 34)
    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * siblings;
        const rightRange = Array.from(
            { length: rightItemCount },
            (_, i) => totalPages - rightItemCount + i + 1
        );
        return [1, "...", ...rightRange];
    }

    // Caso 3: Elipsis a ambos lados (ej: 1 ... 10 11 12 ... 34)
    if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
            { length: rightSiblingIndex - leftSiblingIndex + 1 },
            (_, i) => leftSiblingIndex + i
        );
        return [1, "...", ...middleRange, "...", totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
}

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    category = "all",
    onPageChange
}: PaginationProps) {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const paginationRange = useMemo(() => {
        return getPaginationRange(currentPage, totalPages, 1);
    }, [currentPage, totalPages]);

    const handlePageClick = (page: number, e: MouseEvent) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        if (onPageChange) {
            e.preventDefault();
            onPageChange(page);
        }
    };

    const getHref = (page: number) => {
        const params = new URLSearchParams();
        if (category && category !== "all") {
            params.set("category", category);
        }
        if (page > 1) {
            params.set("page", page.toString());
        }
        const queryString = params.toString();
        return queryString ? `?${queryString}` : "/projects";
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <article class="w-full items-center justify-between sm:justify-center flex gap-8 md:gap-5">
            <button
                type="button"
                onClick={(e) => handlePageClick(currentPage - 1, e)}
                disabled={currentPage <= 1}
                class="text-white text-sm md:text-base inline-flex items-center gap-1 pl-3 pr-5 py-2 bg-blue-page-500/50 rounded-lg disabled:opacity-40 disabled:text-white/60 disabled:cursor-not-allowed not-disabled:cursor-pointer transition-colors duration-500 not-disabled:hover:bg-blue-page-500"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 md:size-5"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Anterior</span>
            </button>

            {isMobile ? (
                <div class="text-white text-sm">
                    <span class="font-bold">{currentPage}</span> de {totalPages}
                </div>
            ) : (
                <div class="flex items-center gap-3 lg:gap-5 pages">
                    {paginationRange.map((item, index) => {
                        if (item === "...") {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    class="text-white/50 px-2 py-2 text-center text-sm md:text-base select-none font-medium tracking-widest"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNumber = item as number;
                        const isActive = pageNumber === currentPage;
                        return (
                            <a
                                key={pageNumber}
                                href={getHref(pageNumber)}
                                onClick={(e) => handlePageClick(pageNumber, e)}
                                class={`text-white px-4 md:px-6 2xl:px-8 py-2 min-w-10 md:min-w-12 rounded-lg text-center cursor-pointer transition-colors duration-200 text-sm md:text-base ${isActive ? "bg-blue-page-500" : "bg-white/10 backdrop-blur-xl"
                                    }`}
                            >
                                {pageNumber}
                            </a>
                        );
                    })}
                </div>
            )}

            <button
                type="button"
                onClick={(e) => handlePageClick(currentPage + 1, e)}
                disabled={currentPage >= totalPages}
                class="text-white text-sm md:text-base inline-flex items-center gap-1 pl-5 pr-3 py-2 bg-blue-page-500/50 rounded-lg disabled:opacity-40 disabled:text-white/60 disabled:cursor-not-allowed not-disabled:cursor-pointer not-disabled:hover:bg-blue-page-500 transition-colors duration-500"
            >
                <span>Siguiente</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 md:size-5"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>
        </article>
    );
}
