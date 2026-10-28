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
        id: "pagina-web-de-experiencias-de-realidad-virtual",
        srcImage: "/projects/cover_experiencias.webp",
        category: filterData[2].id,
        title: "Pagina Web de Experiencias de Realidad Virtual",
        description: "Desarrollamos una página web innovadora para mostrar experiencias de realidad virtual. La web permite a los usuarios explorar y experimentar con contenido inmersivo, brindando una experiencia única y envolvente.",
        link: "https://www.arcoder.dev/experiencias-inmersivas",
    },
]