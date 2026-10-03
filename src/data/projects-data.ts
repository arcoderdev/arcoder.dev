export interface Filter {
    label: string
    id: string
}

export interface Project {
    id: string
    srcImage: string
    category: string
    title: string
    description: string
    link: string
}

export const filterData: Filter[] = [
    {
        id: "all",
        label: "Todos los proyectos",
    },
    {
        id: "realidad-aumentada",
        label: "Realidad Aumentada",
    },
    {
        id: "pagina-web",
        label: "Páginas Web",
    },
    {
        id: "diseno-3d",
        label: "Diseño 3D",
    },
    {
        id: "realidad-virtual",
        label: "Realidad Virtual",
    },
    {
        id: "aplicaciones-moviles",
        label: "Aplicaciones móviles",
    },
    {
        id: "aplicaciones-escritorio",
        label: "Aplicaciones de escritorio",
    },

]

export const projectsData: Project[] = [
    {
        id: "pagina-web-de-casa-universitaria-cacao-y-chocolate",
        srcImage: "/projects/cover.png",
        category: filterData[2].id,
        title: "Pagina Web de Casa Universitaria Cacao y Chocolate",
        description: "Desarrollo completo de un sitio web moderno y responsivo, diseñado para la Casa Universitaria Cacao y Chocolate. Presenta de forma elegante su misión educativa y ofrece recursos interactivos sobre el mundo del cacao.",
        link: "ujat.mx",
    },
]