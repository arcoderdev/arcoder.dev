interface Position {
    top: string;
    left: string;
}

export interface Aplication {
    id: number;
    image: string;
    name: string;
    description: string;
    position: Position;
}

export const aplications: Aplication[] = [
    {
        id: 1,
        image: "/experiencias-inmersivas/aplicaciones/universidad.png",
        name: "Universidades",
        description: "Universidades",
        position: {
            top: "65%",
            left: "10%",
        }

    },
    {
        id: 2,
        image: "/experiencias-inmersivas/aplicaciones/museo.png",
        name: "Museos",
        description: "Museos",
        position: {
            top: "15%",
            left: "20%",
        }
    },
    {
        id: 3,
        image: "/experiencias-inmersivas/aplicaciones/paisajes.png",
        name: "Paisajismos",
        description: "Paisajismos",
        position: {
            top: "75%",
            left: "70%",
        }
    },
    {
        id: 4,
        image: "/experiencias-inmersivas/aplicaciones/hotel.png",
        name: "Hoteles",
        description: "Hoteles",
        position: {
            top: "25%",
            left: "10%",
        }
    },
];