# ARcoder — Próximamente / Coming Soon

¡Hola! Bienvenido al repositorio de nuestro sitio web interactivo de lanzamiento para **[ARcoder](https://arcoder.dev)**. Creamos una experiencia inmersiva en 3D desarrollada con Three.js y React, donde una grúa de construcción ensambla proceduralmente el logotipo de nuestra marca con animaciones cinematográficas, efectos de iluminación y controles de órbita responsivos.

---

## ✨ Lo que Construimos

- **Escena 3D Interactiva:**
  - Desarrollamos una construcción procedural con una grúa de torre animada que ensambla bloques de roca/concreto en 3D.
  - Implementamos una órbita dinámica de cámara que responde al movimiento del cursor e interacciones táctiles en móviles.
  - Configuramos renderizado con sombras suaves (`PCFSoftShadowMap`), gradiente atmosférico y niebla volumétrica.
- **Animaciones y Efectos:**
  - Orquestamos tiempos y transformaciones precisas utilizando **GSAP**.
  - Diseñamos un loader estilizado con una barra de progreso que refleja la carga real de nuestras tipografías y geometrías 3D.
- **Diseño & Responsive:**
  - Diseñamos una interfaz moderna y fluida con **Tailwind CSS v4**.
  - Adaptamos la experiencia para que luzca increíble en dispositivos móviles, tablets y pantallas de escritorio.

---

## 🛠️ Nuestro Stack Tecnológico

### Core & Frameworks
- **[React 19](https://react.dev/)** — Nuestra librería base para la construcción de interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** — Tipado estático para garantizar la robustez y mantenibilidad de nuestro código.
- **[Vite 8](https://vite.dev/)** — Nuestro entorno de desarrollo ultrarrápido y empaquetador para producción.

### 3D & Animación
- **[Three.js](https://threejs.org/)** — El motor WebGL con el que renderizamos la escena tridimensional, geometrías y materiales.
- **[GSAP (GreenSock Animation Platform)](https://gsap.com/)** — La herramienta que elegimos para lograr animaciones fluidas y secuencias cinemáticas.

### Estilos & Tipografía
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Para estilizar nuestra interfaz de forma ágil mediante utilidades modernas con `@tailwindcss/vite`.
- **[@fontsource/poppins](https://fontsource.org/fonts/poppins)** — Nuestra tipografía principal cargada de manera local.

---

## 📁 Cómo Organizamos el Proyecto

```text
├── public/
│   ├── fonts/             # Tipografías 3D (JSON typeface para TextGeometry)
│   ├── icons/             # Iconos SVG de nuestras redes sociales
│   ├── favicon.svg        # Favicon del sitio
│   ├── logo.png           # Nuestro logotipo institucional
│   └── logo_og.jpeg       # Imagen para Open Graph y Twitter Cards
├── src/
│   ├── components/
│   │   ├── CraneScene.tsx # Nuestra escena principal WebGL con Three.js y la grúa
│   │   ├── Loader.tsx     # Pantalla de carga animada
│   │   ├── header.tsx     # Encabezado con branding y botón de contacto
│   │   └── footer.tsx     # Pie de página con enlaces a redes y copyright
│   ├── interfaces/        # Definición de tipos e interfaces TypeScript
│   ├── App.tsx            # Componente contenedor principal
│   └── main.tsx           # Punto de entrada de nuestra aplicación
├── index.html             # Plantilla HTML con configuración SEO y meta tags
├── package.json           # Dependencias y scripts del proyecto
├── tsconfig.json          # Configuración de TypeScript
└── vite.config.ts         # Configuración de Vite y plugins
```

---

## 🚀 Cómo Probar Nuestro Proyecto

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18.0 o superior recomendada)
- Un gestor de paquetes como `npm`, `pnpm` o `yarn`

### Instalación y Ejecución

1. Clona nuestro repositorio:
   ```bash
   git clone https://github.com/arcoderdev/prueba-modelo.git
   cd prueba-modelo
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Levanta el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la experiencia.

---

## 📦 Scripts que Utilizamos

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia nuestro entorno de desarrollo con recarga rápida (HMR). |
| `npm run build` | Compila TypeScript y genera el bundle optimizado para producción en `dist/`. |
| `npm run preview` | Permite previsualizar localmente la versión de producción generada. |
| `npm run lint` | Ejecuta ESLint para analizar y mantener la calidad del código. |

---
