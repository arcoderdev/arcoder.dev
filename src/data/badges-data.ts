interface Badge {
    id: string;
    label: string;
    color: string;
    glowColor: string;
    top: string;
    left: string;
    depth: string;
    parallaxFactor: number;
    floatDuration: string;
    floatDelay: string;
    entranceDelay: string;
}

export const badges: Badge[] = [
    {
        id: "badge-360",
        label: "360°",
        color: "#7EC5FF",
        glowColor: "rgba(56, 189, 248, 0.6)",
        top: "17%",
        left: "19%",
        depth: "55px",
        parallaxFactor: 1.4,
        floatDuration: "3.6s",
        floatDelay: "0s",
        entranceDelay: "500ms",
    },
    {
        id: "badge-interactivo",
        label: "Interactivo",
        color: "#FF7E80",
        glowColor: "rgba(248, 113, 113, 0.6)",
        top: "23%",
        left: "64%",
        depth: "65px",
        parallaxFactor: 1.6,
        floatDuration: "4.2s",
        floatDelay: "0.5s",
        entranceDelay: "700ms",
    },
    {
        id: "badge-disponible",
        label: "Disponible 24/7",
        color: "#FF7EEE",
        glowColor: "rgba(244, 114, 182, 0.6)",
        top: "55%",
        left: "2%",
        depth: "45px",
        parallaxFactor: 1.2,
        floatDuration: "3.9s",
        floatDelay: "0.2s",
        entranceDelay: "900ms",
    },
    {
        id: "badge-webgl",
        label: "WebGL",
        color: "#85FF7E",
        glowColor: "rgba(74, 222, 128, 0.6)",
        top: "65%",
        left: "67%",
        depth: "60px",
        parallaxFactor: 1.5,
        floatDuration: "4.5s",
        floatDelay: "0.7s",
        entranceDelay: "1100ms",
    },
    {
        id: "badge-instalaciones",
        label: "Cero instalaciones",
        color: "#FFEC7E",
        glowColor: "rgba(250, 204, 21, 0.6)",
        top: "75%",
        left: "23%",
        depth: "50px",
        parallaxFactor: 1.3,
        floatDuration: "3.7s",
        floatDelay: "0.4s",
        entranceDelay: "1300ms",
    },
];