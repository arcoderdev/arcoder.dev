import { filterData, type Filter as FilterType } from "@data/projects-data";

interface FilterProps {
    categories?: FilterType[];
    selectedCategory?: string;
    onSelectCategory?: (category: string) => void;
}

export default function Filter({
    categories = filterData,
    selectedCategory = "all",
    onSelectCategory
}: FilterProps) {
    const handleCategoryClick = (category: string, e: MouseEvent) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        if (onSelectCategory) {
            e.preventDefault();
            onSelectCategory(category);
        }
    };

    return (
        <article
            class="w-full overflow-x-auto snap-center scroll-smooth gap-5 flex items-center scroll-filter pb-2"
        >
            {categories.map((item) => {
                const isActive = item.id === selectedCategory;
                return (
                    <a
                        key={item.id}
                        href={item.id === "all" ? "/projects" : `?category=${item.id}`}
                        data-category-filter={item.id}
                        onClick={(e) => handleCategoryClick(item.id, e)}
                        class={`filter-btn px-8 py-3 text-center rounded-lg text-white text-sm md:text-base min-w-fit cursor-pointer transition-colors duration-200 backdrop-blur-xl outline-none active:outline-none focus:outline-none ${
                            isActive ? "bg-blue-page-500" : "bg-white/10"
                        }`}
                    >
                        {item.label}
                    </a>
                );
            })}
        </article>
    );
}
