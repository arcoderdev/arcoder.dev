import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import type { PhysicalRock, CraneSceneProps } from "../interfaces";

export default function CraneScene({ onProgress, onLoaded }: CraneSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ==========================================
        // SCENE
        // ==========================================

        const scene = new THREE.Scene();

        // Atmospheric vertical sky gradient background
        const createSkyGradient = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 256;
            canvas.height = 512;
            const ctx = canvas.getContext("2d");
            if (!ctx) return new THREE.Color(0xe9ebea);
            const grad = ctx.createLinearGradient(0, 0, 0, 512);
            grad.addColorStop(0, "#c9deee");    // Soft sky blue at the top
            grad.addColorStop(0.35, "#deeaf2"); // Smooth atmospheric transition
            grad.addColorStop(0.7, "#ebf0f1");  // Horizon air glow
            grad.addColorStop(1.0, "#dfdbd6");  // Warm transition to ground
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 256, 512);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };
        scene.background = createSkyGradient();

        // ==========================================
        // CAMERA – framed to see the full word area
        // ==========================================

        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            200
        );
        // Start with a front-facing "2D" view
        camera.position.set(0, 6, 18);
        camera.lookAt(0, 1.5, 0);

        // ==========================================
        // MOUSE-BASED CAMERA ORBIT
        // ==========================================

        const isMobile = window.innerWidth < 768;

        const cameraOrbit = {
            radius: isMobile ? 32 : 18,          // distance from lookAt point in XZ desktop: 18 Mobile: 32
            baseHeight: 6,       // default camera Y
            lookAtY: 1.5,        // vertical center of focus
            maxAngleX: Math.PI / 10,  // ±18° horizontal rotation
            maxAngleY: 2.5,           // ±2.5 units vertical offset
            currentAngleX: 0,    // current horizontal angle
            targetAngleX: 0,     // target horizontal angle
            currentOffsetY: 0,   // current vertical offset
            targetOffsetY: 0,    // target vertical offset
            lerpSpeed: 0.04,     // smoothing factor
        };

        let mouseNormX = 0; // normalized mouse X: -1 (left) to 1 (right)
        let mouseNormY = 0; // normalized mouse Y: -1 (top) to 1 (bottom)

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseNormY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        };

        const handleMouseLeave = () => {
            mouseNormX = 0;
            mouseNormY = 0;
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        // ==========================================
        // RENDERER
        // ==========================================

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // ==========================================
        // LIGHTS
        // ==========================================

        const hemi = new THREE.HemisphereLight(0xffffff, 0x555555, 2);
        scene.add(hemi);

        const sun = new THREE.DirectionalLight(0xffffff, 3);
        sun.position.set(-5, 10, 7);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = -25;
        sun.shadow.camera.right = 25;
        sun.shadow.camera.top = 15;
        sun.shadow.camera.bottom = -5;
        scene.add(sun);

        // ==========================================
        // BACKGROUND SCENERY & HORIZON LAYERS
        // ==========================================

        const bgGroup = new THREE.Group();
        scene.add(bgGroup);

        // Distant mountain/hill silhouettes (Soft layered curves)
        const createHillLayer = (
            colorHex: number,
            points: [number, number][],
            zPos: number
        ) => {
            const shape = new THREE.Shape();
            shape.moveTo(points[0][0], -2);
            for (const pt of points) {
                shape.lineTo(pt[0], pt[1]);
            }
            shape.lineTo(points[points.length - 1][0], -2);
            shape.closePath();

            const geo = new THREE.ShapeGeometry(shape);
            const mat = new THREE.MeshBasicMaterial({
                color: colorHex,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(0, 0, zPos);
            bgGroup.add(mesh);
        };

        // Far hills layer (soft muted blue-grey)
        createHillLayer(
            0xd0dbe0,
            [
                [-50, 0], [-38, 3.8], [-26, 1.8], [-14, 4.4],
                [-3, 2.0], [10, 5.0], [22, 2.6], [35, 4.2], [50, 0]
            ],
            -28
        );

        // Mid-distance hills layer (closer with varied peaks)
        createHillLayer(
            0xc4d3db,
            [
                [-50, 0], [-40, 2.2], [-30, 4.2], [-19, 1.4],
                [-7, 3.4], [4, 1.8], [15, 3.8], [28, 1.6], [50, 0]
            ],
            -22
        );

        // Distant background mini-cranes (adds industrial skyline depth)
        const distantCraneMat = new THREE.MeshBasicMaterial({
            color: 0xb0c4cd,
            transparent: true,
            opacity: 0.6,
        });

        const createDistantCrane = (x: number, y: number, z: number, scale: number) => {
            const dc = new THREE.Group();
            const mast = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.5, 0.12), distantCraneMat);
            mast.position.y = 2.75;
            dc.add(mast);

            const jib = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 0.1), distantCraneMat);
            jib.position.set(1.2, 5.4, 0);
            dc.add(jib);

            const cjib = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.1), distantCraneMat);
            cjib.position.set(-1.1, 5.4, 0);
            dc.add(cjib);

            const apex = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.9, 4), distantCraneMat);
            apex.position.set(0, 5.85, 0);
            dc.add(apex);

            dc.scale.setScalar(scale);
            dc.position.set(x, y, z);
            bgGroup.add(dc);
        };

        createDistantCrane(-19, 0, -25, 0.85);
        createDistantCrane(24, 0, -26, 0.75);
        createDistantCrane(-6, 0, -30, 0.6);

        // ==========================================
        // BACKGROUND TREES (STYLIZED 3D FOLIAGE)
        // ==========================================

        const treeGroup = new THREE.Group();
        scene.add(treeGroup);

        const trunkMat = new THREE.MeshStandardMaterial({
            color: 0x4a3a30,
            roughness: 0.9,
        });

        // ==========================================
        // SCULPTED TERRAIN ELEVATION HELPER
        // ==========================================

        const terrainWidth = 72;
        const terrainHeight = 72;

        const getTerrainElevation = (wx: number, wz: number): number => {
            let elevation = 0;

            // 1. Background rolling hills & gentle slopes (Z < -2.0)
            if (wz < -2.0) {
                const backDist = Math.abs(wz + 2.0);
                elevation += (Math.sin(wx * 0.16) * 0.9 + Math.cos(wx * 0.11) * 0.65 + 0.6) * Math.min(1.4, backDist * 0.14);
                elevation += Math.sin(wx * 0.35 + wz * 0.28) * 0.4 * Math.min(1, backDist * 0.1);
            }

            // 2. Foreground rolling embankments & banks (Z > 2.2)
            if (wz > 2.2) {
                const frontDist = wz - 2.2;
                elevation += (Math.cos(wx * 0.14) * 0.55 + Math.sin(wx * 0.22) * 0.45) * Math.min(1.2, frontDist * 0.16);
                elevation += Math.sin(wx * 0.45 + wz * 0.35) * 0.25 * Math.min(1, frontDist * 0.1);
            }

            // 3. Lateral hilly borders (Outer X edges |X| > 13)
            if (Math.abs(wx) > 13.0) {
                const edgeDist = Math.abs(wx) - 13.0;
                elevation += (Math.sin(wz * 0.22) * 0.75 + Math.cos(wz * 0.16) * 0.55 + 0.4) * Math.min(1.6, edgeDist * 0.16);
            }

            // 4. Border edge softening / drop-off for organic irregular perimeter
            const edgeBorderX = terrainWidth / 2 - Math.abs(wx);
            const edgeBorderZ = terrainHeight / 2 - Math.abs(wz);
            const minBorderDist = Math.min(edgeBorderX, edgeBorderZ);
            if (minBorderDist < 6.0) {
                const dropFactor = (6.0 - minBorderDist) / 6.0;
                elevation -= dropFactor * dropFactor * 3.0;
            }

            return elevation;
        };

        // ==========================================
        // STYLIZED TIERED CARTOON PINE TREES
        // ==========================================

        const foliageGeo = new THREE.SphereGeometry(1, 20, 18);

        const foliageMatsPine = [
            new THREE.MeshStandardMaterial({ color: 0x3d6b49, roughness: 0.82 }),
            new THREE.MeshStandardMaterial({ color: 0x477853, roughness: 0.80 }),
            new THREE.MeshStandardMaterial({ color: 0x51855e, roughness: 0.78 }),
        ];

        const createStylizedPineTree = (
            x: number,
            z: number,
            scale: number,
            variant: number = 0
        ) => {
            const tree = new THREE.Group();

            // Trunk
            const trunkGeo = new THREE.CylinderGeometry(0.12, 0.20, 1.8, 16);
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = 0.85;
            trunk.castShadow = true;
            tree.add(trunk);

            // 4 Softly stacked rounded ellipsoidal tiers
            const matA = foliageMatsPine[variant % foliageMatsPine.length];
            const matB = foliageMatsPine[(variant + 1) % foliageMatsPine.length];
            const matC = foliageMatsPine[(variant + 2) % foliageMatsPine.length];

            const tiers = [
                { y: 1.80, rX: 1.35, rY: 0.88, mat: matA },
                { y: 2.50, rX: 1.08, rY: 0.82, mat: matB },
                { y: 3.15, rX: 0.82, rY: 0.76, mat: matC },
                { y: 3.75, rX: 0.54, rY: 0.72, mat: matB },
            ];

            for (const tier of tiers) {
                const puff = new THREE.Mesh(foliageGeo, tier.mat);
                puff.scale.set(tier.rX, tier.rY, tier.rX);
                puff.position.y = tier.y;
                puff.castShadow = true;
                puff.receiveShadow = true;
                tree.add(puff);
            }

            tree.scale.setScalar(scale);
            tree.position.set(x, getTerrainElevation(x, z), z);
            treeGroup.add(tree);
        };

        // Populate trees across horizon and along outer X edges
        // 1. Far Left edge framing trees
        createStylizedPineTree(-26.5, -4.5, 1.65, 0);
        createStylizedPineTree(-25.0, -8.5, 1.55, 1);
        createStylizedPineTree(-23.5, -2.5, 1.40, 2);
        createStylizedPineTree(-22.0, -12.0, 1.45, 0);
        createStylizedPineTree(-20.5, -6.5, 1.25, 1);
        createStylizedPineTree(-19.0, -15.0, 1.35, 2);

        // 2. Dispersed left & center background trees along the horizon
        createStylizedPineTree(-16.0, -18.0, 1.20, 0);
        createStylizedPineTree(-13.2, -14.0, 1.00, 1);
        createStylizedPineTree(-10.5, -20.0, 1.25, 2);
        createStylizedPineTree(-7.5, -16.5, 0.90, 0);
        createStylizedPineTree(-4.2, -21.0, 1.20, 1);
        createStylizedPineTree(-1.5, -17.5, 0.85, 2);
        createStylizedPineTree(1.8, -19.5, 0.95, 0);
        createStylizedPineTree(4.5, -16.0, 0.85, 1);
        createStylizedPineTree(7.8, -20.5, 1.15, 2);
        createStylizedPineTree(10.5, -15.0, 1.00, 0);
        createStylizedPineTree(13.5, -18.5, 1.25, 1);
        createStylizedPineTree(16.5, -14.0, 1.10, 2);

        // 3. Far Right edge framing trees
        createStylizedPineTree(19.0, -15.5, 1.35, 0);
        createStylizedPineTree(20.5, -7.0, 1.30, 1);
        createStylizedPineTree(22.0, -12.5, 1.45, 2);
        createStylizedPineTree(23.5, -3.0, 1.40, 0);
        createStylizedPineTree(25.2, -9.0, 1.60, 1);
        createStylizedPineTree(26.8, -4.8, 1.70, 2);

        // ==========================================
        // MATERIALS
        // ==========================================

        const black = new THREE.MeshStandardMaterial({
            color: 0x1a1d21, roughness: 0.7,
        });
        const darkGray = new THREE.MeshStandardMaterial({
            color: 0x2a2d32, roughness: 0.6,
        });
        const yellow = new THREE.MeshStandardMaterial({
            color: 0xf5a623, roughness: 0.4, metalness: 0.1,
        });
        const metal = new THREE.MeshStandardMaterial({
            color: 0x7a8490, metalness: 0.8, roughness: 0.25,
        });
        const darkMetal = new THREE.MeshStandardMaterial({
            color: 0x4a5058, metalness: 0.7, roughness: 0.3,
        });
        const glass = new THREE.MeshStandardMaterial({
            color: 0x8ec6da, transparent: true, opacity: 0.6,
            metalness: 0.3, roughness: 0.1,
        });
        const rubber = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a, roughness: 0.95,
        });
        const red = new THREE.MeshStandardMaterial({
            color: 0xcc2222, roughness: 0.5,
        });

        // ==========================================
        // CRANE (root group)
        // ==========================================

        const crane = new THREE.Group();
        scene.add(crane);

        // ==========================================
        // ORUGAS (CRAWLER TRACKS)
        // ==========================================

        const createTrack = (z: number) => {
            const g = new THREE.Group();

            const belt = new THREE.Mesh(
                new THREE.BoxGeometry(4.8, 0.55, 0.65), rubber
            );
            belt.position.set(0, 0.3, 0);
            belt.castShadow = true;
            g.add(belt);

            const plate = new THREE.Mesh(
                new THREE.BoxGeometry(4.6, 0.12, 0.6), darkGray
            );
            plate.position.set(0, 0.6, 0);
            g.add(plate);

            // Front & rear sprockets
            for (const xPos of [-2.1, 2.1]) {
                const sprocket = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.32, 0.32, 0.68, 24), metal
                );
                sprocket.rotation.x = Math.PI / 2;
                sprocket.position.set(xPos, 0.32, 0);
                sprocket.castShadow = true;
                g.add(sprocket);
            }

            // Road wheels
            for (let i = -1.4; i <= 1.4; i += 0.7) {
                const w = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.22, 0.22, 0.7, 20), darkMetal
                );
                w.rotation.x = Math.PI / 2;
                w.position.set(i, 0.28, 0);
                w.castShadow = true;
                g.add(w);
            }

            // Grousers
            for (let i = -2.2; i <= 2.2; i += 0.25) {
                const gr = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.06, 0.68), darkGray
                );
                gr.position.set(i, 0.05, 0);
                g.add(gr);
            }

            g.position.z = z;
            crane.add(g);
        };

        createTrack(1.0);
        createTrack(-1.0);

        // ==========================================
        // CHASIS
        // ==========================================

        const chassis = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 0.5, 2.4), darkGray
        );
        chassis.position.set(0, 0.85, 0);
        chassis.castShadow = true;
        crane.add(chassis);

        for (let x = -1.2; x <= 1.2; x += 0.8) {
            const brace = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.2, 2.2), darkMetal
            );
            brace.position.set(x, 0.65, 0);
            crane.add(brace);
        }

        // ==========================================
        // TURNTABLE (SLEW RING)
        // ==========================================

        const turntable = new THREE.Mesh(
            new THREE.CylinderGeometry(0.9, 0.9, 0.2, 32), metal
        );
        turntable.position.set(0, 1.2, 0);
        turntable.castShadow = true;
        crane.add(turntable);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.9, 0.06, 12, 32), darkMetal
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 1.2, 0);
        crane.add(ring);

        // ==========================================
        // SUPERSTRUCTURE
        // ==========================================

        const superstructure = new THREE.Group();
        superstructure.position.set(0, 1.3, 0);
        crane.add(superstructure);

        // Engine housing
        const engine = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 1.0, 1.8), darkGray
        );
        engine.position.set(1.0, 0.5, 0);
        engine.castShadow = true;
        superstructure.add(engine);

        // Engine vents
        for (let i = -0.3; i <= 0.3; i += 0.15) {
            const vent = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 0.04, 0.02), black
            );
            vent.position.set(1.0, 0.5 + i, 0.91);
            superstructure.add(vent);
        }

        // Engine grill
        const grill = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.06, 1.4), darkMetal
        );
        grill.position.set(1.2, 1.03, 0);
        superstructure.add(grill);

        // Exhaust
        const exhaust = new THREE.Mesh(
            new THREE.CylinderGeometry(0.07, 0.08, 0.6, 12), darkMetal
        );
        exhaust.position.set(1.8, 1.3, -0.5);
        exhaust.castShadow = true;
        superstructure.add(exhaust);

        const exhaustCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.07, 0.08, 12), black
        );
        exhaustCap.position.set(1.8, 1.63, -0.5);
        superstructure.add(exhaustCap);

        // ==========================================
        // COUNTERWEIGHT
        // ==========================================

        const cw = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.9, 1.9), metal
        );
        cw.position.set(2.3, 0.45, 0);
        cw.castShadow = true;
        superstructure.add(cw);

        for (let i = -0.3; i <= 0.3; i += 0.3) {
            const ridge = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.92, 1.92), darkMetal
            );
            ridge.position.set(2.3 + i, 0.45, 0);
            superstructure.add(ridge);
        }

        // ==========================================
        // CABIN
        // ==========================================

        const cabin = new THREE.Group();
        cabin.position.set(-0.6, 0, 0);
        superstructure.add(cabin);

        const cabinBody = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 1.4, 1.5), darkGray
        );
        cabinBody.position.set(0, 0.7, 0);
        cabinBody.castShadow = true;
        cabin.add(cabinBody);

        const cabinRoof = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.1, 1.6), black
        );
        cabinRoof.position.set(0, 1.45, 0);
        cabinRoof.castShadow = true;
        cabin.add(cabinRoof);

        // Windows
        cabin.add((() => {
            const w = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.9, 1.2), glass
            );
            w.position.set(-0.72, 0.75, 0);
            return w;
        })());

        for (const zSide of [0.76, -0.76]) {
            const w = new THREE.Mesh(
                new THREE.BoxGeometry(1.0, 0.7, 0.06), glass
            );
            w.position.set(-0.1, 0.8, zSide);
            cabin.add(w);
        }

        const skylight = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.06, 0.9), glass
        );
        skylight.position.set(-0.2, 1.42, 0);
        cabin.add(skylight);

        // ==========================================
        // DECK PLATFORM
        // ==========================================

        const deck = new THREE.Mesh(
            new THREE.BoxGeometry(4.2, 0.12, 2.2), darkMetal
        );
        deck.position.set(0.6, 0.06, 0);
        superstructure.add(deck);

        // ==========================================
        // A-FRAME (boom support tower)
        // ==========================================

        const aFrame = new THREE.Group();
        aFrame.position.set(-0.2, 1.0, 0);
        superstructure.add(aFrame);

        for (const zLeg of [0.5, -0.5]) {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 1.6, 0.15), yellow
            );
            leg.position.set(0, 0.8, zLeg);
            leg.rotation.z = 0.08;
            leg.castShadow = true;
            aFrame.add(leg);
        }

        const aFrameTop = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 1.2), yellow
        );
        aFrameTop.position.set(0.12, 1.6, 0);
        aFrameTop.castShadow = true;
        aFrame.add(aFrameTop);

        // ==========================================
        // BOOM PIVOT
        // ==========================================

        const boomPivot = new THREE.Group();
        boomPivot.position.set(-0.9, 1.0, 0);
        superstructure.add(boomPivot);

        const pivotPin = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16), metal
        );
        pivotPin.rotation.x = Math.PI / 2;
        pivotPin.castShadow = true;
        boomPivot.add(pivotPin);

        // ==========================================
        // BOOM
        // ==========================================

        const boomAngleDeg = 50;
        const boomAngleRad = THREE.MathUtils.degToRad(boomAngleDeg);

        const boom = new THREE.Group();
        // Positive rotation → boom extends to the LEFT (front of crane)
        boom.rotation.z = boomAngleRad;
        boomPivot.add(boom);

        // ==========================================
        // BOOM LATTICE STRUCTURE
        // ==========================================

        const boomLength = 6.5;
        const boomW = 0.45;
        const hw = boomW / 2;

        // Four main chords
        for (const ox of [hw, -hw]) {
            for (const oz of [hw, -hw]) {
                const chord = new THREE.Mesh(
                    new THREE.BoxGeometry(0.1, boomLength, 0.1), yellow
                );
                chord.position.set(ox, boomLength / 2, oz);
                chord.castShadow = true;
                boom.add(chord);
            }
        }

        // Diagonal lattice braces
        const numBraces = 8;
        const braceSpacing = boomLength / numBraces;

        for (let i = 0; i < numBraces; i++) {
            const yMid = (i + 0.5) * braceSpacing;
            const braceLen = Math.sqrt(
                braceSpacing * braceSpacing + boomW * boomW
            );
            const braceAngle = Math.atan2(boomW, braceSpacing);
            const sign = i % 2 === 0 ? 1 : -1;

            // Each face
            const faces: [number, number, boolean][] = [
                [0, hw, false],   // front
                [0, -hw, false],  // back
                [hw, 0, true],    // left
                [-hw, 0, true],   // right
            ];

            for (const [fx, fz, flip] of faces) {
                const brace = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, braceLen, 0.05), metal
                );
                brace.position.set(fx, yMid, fz);
                brace.rotation.z = (flip ? -sign : sign) * braceAngle;
                boom.add(brace);
            }

            // Horizontal cross members
            if (i > 0) {
                const yBase = i * braceSpacing;
                for (const fz of [hw, -hw]) {
                    const c = new THREE.Mesh(
                        new THREE.BoxGeometry(boomW, 0.05, 0.05), metal
                    );
                    c.position.set(0, yBase, fz);
                    boom.add(c);
                }
                for (const fx of [hw, -hw]) {
                    const c = new THREE.Mesh(
                        new THREE.BoxGeometry(0.05, 0.05, boomW), metal
                    );
                    c.position.set(fx, yBase, 0);
                    boom.add(c);
                }
            }
        }

        // Boom base bracket
        const boomBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.4, 0.6), yellow
        );
        boomBase.position.set(0, 0.1, 0);
        boomBase.castShadow = true;
        boom.add(boomBase);

        // ==========================================
        // BOOM TIP (SHEAVE BLOCK)
        // ==========================================

        const boomTip = new THREE.Group();
        boomTip.position.y = boomLength;
        boom.add(boomTip);

        const tipBlock = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.4, 0.55), yellow
        );
        tipBlock.castShadow = true;
        boomTip.add(tipBlock);

        // Sheave
        const sheave = new THREE.Mesh(
            new THREE.TorusGeometry(0.15, 0.04, 8, 20), metal
        );
        sheave.rotation.y = Math.PI / 2;
        sheave.position.set(0, -0.05, 0);
        boomTip.add(sheave);

        // Warning light
        const warningLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 12, 12), red
        );
        warningLight.position.set(0, 0.26, 0);
        boomTip.add(warningLight);

        // ==========================================
        // HYDRAULIC CYLINDER
        // ==========================================

        const cylGroup = new THREE.Group();
        superstructure.add(cylGroup);

        const cylBasePos = new THREE.Vector3(0.0, 0.3, 0);
        const cylAttachBoomY = 2.5;
        const boomPivotPos = new THREE.Vector3(-0.9, 1.0, 0);

        // Boom tip extends LEFT, so x component is negative
        const cylAttachWorld = new THREE.Vector3(
            boomPivotPos.x - Math.sin(boomAngleRad) * cylAttachBoomY,
            boomPivotPos.y + Math.cos(boomAngleRad) * cylAttachBoomY,
            0
        );

        const cylDir = new THREE.Vector3().subVectors(cylAttachWorld, cylBasePos);
        const cylLength = cylDir.length();
        const cylAngle = Math.atan2(cylDir.x, cylDir.y);

        // Barrel
        const cylBarrel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.12, cylLength * 0.6, 16), darkMetal
        );
        cylBarrel.position.copy(cylBasePos).add(
            cylDir.clone().normalize().multiplyScalar(cylLength * 0.3)
        );
        cylBarrel.rotation.z = -cylAngle;
        cylBarrel.castShadow = true;
        cylGroup.add(cylBarrel);

        // Rod
        const cylRod = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, cylLength * 0.55, 12), metal
        );
        cylRod.position.copy(cylBasePos).add(
            cylDir.clone().normalize().multiplyScalar(cylLength * 0.7)
        );
        cylRod.rotation.z = -cylAngle;
        cylRod.castShadow = true;
        cylGroup.add(cylRod);

        // ==========================================
        // SAFETY RAILINGS
        // ==========================================

        const createRailing = (
            x1: number, z1: number, x2: number, z2: number, h: number
        ) => {
            const dx = x2 - x1, dz = z2 - z1;
            const len = Math.sqrt(dx * dx + dz * dz);
            const rail = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, len, 8), yellow
            );
            rail.position.set((x1 + x2) / 2, h, (z1 + z2) / 2);
            rail.rotation.x = Math.PI / 2;
            rail.rotation.order = "YXZ";
            rail.rotation.y = Math.atan2(dx, dz);
            superstructure.add(rail);
        };

        createRailing(2.9, 1.0, 2.9, -1.0, 1.2);
        createRailing(0.2, 1.0, 2.9, 1.0, 1.2);
        createRailing(0.2, -1.0, 2.9, -1.0, 1.2);

        for (const x of [0.2, 1.2, 2.2, 2.9]) {
            for (const z of [1.0, -1.0]) {
                const post = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8), yellow
                );
                post.position.set(x, 0.65, z);
                post.castShadow = true;
                superstructure.add(post);
            }
        }

        // ==========================================
        // CABLE & HOOK (world space → always vertical)
        // ==========================================

        const cableGroup = new THREE.Group();
        scene.add(cableGroup);

        const cable = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, 1, 12), black
        );
        cableGroup.add(cable);

        const hook = new THREE.Group();
        scene.add(hook);

        // Hook block
        const hookBlock = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.25, 0.2), darkMetal
        );
        hook.add(hookBlock);

        // Hook bar
        const hookBar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.45, 12), black
        );
        hookBar.position.y = -0.35;
        hook.add(hookBar);

        // Hook ring
        const hookRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.16, 0.045, 12, 24, Math.PI * 1.4), yellow
        );
        hookRing.rotation.z = THREE.MathUtils.degToRad(25);
        hookRing.position.y = -0.62;
        hook.add(hookRing);

        // Safety latch
        const latch = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.2, 0.03), red
        );
        latch.position.set(0.12, -0.55, 0);
        latch.rotation.z = -0.3;
        hook.add(latch);

        // ==========================================
        // BOOM TIP WORLD POSITION HELPER
        // ==========================================

        const getBoomTipWorldPos = (): THREE.Vector3 => {
            const v = new THREE.Vector3();
            boomTip.getWorldPosition(v);
            return v;
        };

        // ==========================================
        // CABLE & HOOK UPDATE (called every frame)
        // ==========================================

        let hookWorldY = 4.0;

        const updateCableAndHook = () => {
            const tip = getBoomTipWorldPos();

            // Hook hangs vertically below boom tip
            hook.position.set(tip.x, hookWorldY, tip.z);

            // Cable from tip to hook
            const len = Math.max(tip.y - hookWorldY, 0.1);
            cable.scale.y = len;
            cable.position.set(tip.x, tip.y - len / 2, tip.z);
        };

        // ==========================================
        // ANIMATION HELPERS
        // ==========================================

        const delay = (ms: number) =>
            new Promise<void>((r) => setTimeout(r, ms));

        const moveHookTo = (targetY: number, duration: number): Promise<void> =>
            new Promise((resolve) => {
                const proxy = { y: hookWorldY };
                gsap.to(proxy, {
                    y: targetY,
                    duration,
                    ease: "power2.inOut",
                    onUpdate: () => { hookWorldY = proxy.y; },
                    onComplete: () => { hookWorldY = targetY; resolve(); },
                });
            });

        const moveCraneTo = (targetX: number, duration: number): Promise<void> =>
            new Promise((resolve) => {
                gsap.to(crane.position, {
                    x: targetX,
                    duration,
                    ease: "power2.inOut",
                    onComplete: resolve,
                });
            });

        // ==========================================
        // COMPUTE BOOM TIP X OFFSET
        // ==========================================

        // With crane at x=0, where is the boom tip in world X?
        crane.position.set(0, 0, 0);
        scene.updateMatrixWorld(true);
        const tipAtOrigin = getBoomTipWorldPos();
        const boomTipXOffset = tipAtOrigin.x;

        // Position crane so boom tip is roughly at center initially
        crane.position.x = -boomTipXOffset;

        // Initial hook height
        hookWorldY = 4.0;

        // ==========================================
        // SCULPTED TERRAIN MESH WITH ORGANIC BORDERS
        // ==========================================

        const groundSegments = 140;
        const groundGeo = new THREE.PlaneGeometry(
            terrainWidth,
            terrainHeight,
            groundSegments,
            groundSegments
        );

        const groundPosAttr = groundGeo.attributes.position;
        const gVec = new THREE.Vector3();

        for (let i = 0; i < groundPosAttr.count; i++) {
            gVec.fromBufferAttribute(groundPosAttr, i);
            const wx = gVec.x;
            const wz = -gVec.y;
            gVec.z = getTerrainElevation(wx, wz);
            groundPosAttr.setXYZ(i, gVec.x, gVec.y, gVec.z);
        }

        groundGeo.computeVertexNormals();

        const ground = new THREE.Mesh(
            groundGeo,
            new THREE.MeshStandardMaterial({
                color: 0x655046,
                roughness: 0.9,
                flatShading: false,
            })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // ==========================================
        // 3D GROUND ROCKS (ORGANIC, WEATHERED NATURAL STONES)
        // ==========================================

        const rockGroup = new THREE.Group();
        scene.add(rockGroup);

        const rockMaterials = [
            // Warm brown & earthy clay tones
            new THREE.MeshStandardMaterial({ color: 0x54433b, roughness: 0.85, flatShading: false }), // Deep warm coffee brown
            new THREE.MeshStandardMaterial({ color: 0x6b574c, roughness: 0.82, flatShading: false }), // Medium earthy brown
            new THREE.MeshStandardMaterial({ color: 0x7a6559, roughness: 0.80, flatShading: false }), // Warm sandstone brown
            new THREE.MeshStandardMaterial({ color: 0x8a7467, roughness: 0.78, flatShading: false }), // Soft tan / clay stone

            // Soft muted charcoals & non-pitch blacks
            new THREE.MeshStandardMaterial({ color: 0x2e2b2a, roughness: 0.88, flatShading: false }), // Soft dark charcoal
            new THREE.MeshStandardMaterial({ color: 0x383533, roughness: 0.84, flatShading: false }), // Muted volcanic basalt
            new THREE.MeshStandardMaterial({ color: 0x433e3c, roughness: 0.82, flatShading: false }), // Dark warm slate
            new THREE.MeshStandardMaterial({ color: 0x4e4845, roughness: 0.80, flatShading: false }), // Soft mineral graphite
        ];

        // Create organic weathered rock geometries with vertex noise and smooth normals
        const createOrganicRockGeometry = () => {
            const geo = new THREE.DodecahedronGeometry(1, 2);
            const posAttr = geo.attributes.position;
            const v = new THREE.Vector3();

            const noiseFactor = 0.18 + Math.random() * 0.12;

            for (let i = 0; i < posAttr.count; i++) {
                v.fromBufferAttribute(posAttr, i);
                const len = v.length();
                const noise =
                    Math.sin(v.x * 2.6 + v.y * 3.1) * 0.16 +
                    Math.cos(v.y * 2.7 + v.z * 2.5) * 0.13 +
                    Math.sin(v.z * 3.3 + v.x * 2.2) * 0.11;
                v.normalize().multiplyScalar(len + noise * noiseFactor);
                posAttr.setXYZ(i, v.x, v.y, v.z);
            }

            geo.computeVertexNormals();
            return geo;
        };

        const organicRockGeometries = [
            createOrganicRockGeometry(),
            createOrganicRockGeometry(),
            createOrganicRockGeometry(),
            createOrganicRockGeometry(),
            createOrganicRockGeometry(),
        ];

        const physicalRocks: PhysicalRock[] = [];

        const createRock = (
            x: number,
            z: number,
            sx: number,
            sy: number,
            sz: number,
            rotY: number = 0,
            matIdx: number = 0
        ) => {
            const geo = organicRockGeometries[Math.floor(Math.random() * organicRockGeometries.length)];
            const mat = rockMaterials[matIdx % rockMaterials.length];
            const rock = new THREE.Mesh(geo, mat);
            rock.scale.set(sx, sy * 0.65, sz);
            rock.rotation.set(
                (Math.random() - 0.5) * 0.35,
                rotY || Math.random() * Math.PI * 2,
                (Math.random() - 0.5) * 0.35
            );
            const baseHeight = sy * 0.45;
            const origY = baseHeight + getTerrainElevation(x, z);
            rock.position.set(x, origY, z);
            rock.castShadow = true;
            rock.receiveShadow = true;
            rockGroup.add(rock);

            physicalRocks.push({
                mesh: rock,
                origY: baseHeight,
                radius: Math.max(sx, sz) * 0.8,
                vx: 0,
                vy: 0,
                vz: 0,
                rotVx: 0,
                rotVz: 0,
            });

            return rock;
        };

        // Dispersed natural rocks spread across the terrain
        const rockLayout: [number, number, number][] = [
            // ── FRONT OF THE Z-AXIS (CLOSEST TO CAMERA / FOREGROUND, Z: 4.0 to 6.5) ──
            [-19.5, 5.8, 1.05],
            [-18.0, 4.4, 0.75],
            [-16.5, 6.2, 1.15],
            [-15.0, 4.8, 0.80],
            [-13.5, 5.6, 0.90],
            [-12.0, 4.2, 0.65],
            [-10.5, 5.4, 0.78],
            [-9.0, 4.5, 0.58],
            [-7.5, 5.9, 0.88],
            [-5.8, 4.6, 0.62],
            [-4.0, 5.5, 0.75],
            [-2.2, 4.4, 0.50],
            [-0.5, 5.2, 0.68],
            [1.2, 4.5, 0.55],
            [2.8, 5.5, 0.72],
            [4.5, 4.4, 0.60],
            [6.2, 5.6, 0.85],
            [7.8, 4.5, 0.65],
            [9.5, 5.8, 0.92],
            [11.2, 4.4, 0.72],
            [13.0, 5.6, 0.95],
            [14.8, 4.6, 0.70],
            [16.5, 6.0, 1.10],
            [18.0, 4.6, 0.85],
            [19.5, 5.8, 1.05],

            // ── MID-FOREGROUND (Z: 2.2 to 3.5) ──
            [-18.5, 3.2, 0.85],
            [-17.0, 2.6, 0.65],
            [-15.5, 3.5, 0.95],
            [-14.2, 2.2, 0.55],
            [-13.0, 3.0, 0.70],
            [-11.5, 2.4, 0.48],
            [-10.2, 3.2, 0.60],
            [-3.2, 3.2, 0.38],
            [-0.8, 2.8, 0.32],
            [1.5, 3.0, 0.35],
            [4.0, 2.6, 0.40],
            [5.2, 2.8, 0.65],
            [7.8, 2.4, 0.55],
            [12.0, 2.2, 0.60],
            [15.8, 3.2, 0.90],
            [17.0, 2.5, 0.75],
            [18.2, 3.4, 0.85],

            // ── MIDGROUND & HORIZON (Z: -2.8 to 1.8) ──
            [-17.8, -1.8, 0.70],
            [-15.2, -2.5, 0.85],
            [-13.5, -1.2, 0.50],
            [-11.8, -2.8, 0.75],
            [-9.8, -1.6, 0.60],
            [-8.5, 0.5, 0.42],
            [-7.2, -2.2, 0.68],
            [-6.4, 1.4, 0.72],
            [-5.5, -0.8, 0.40],
            [-4.5, 2.0, 0.35],
            [-2.0, -2.6, 0.55],
            [0.2, -2.4, 0.48],
            [2.8, -2.5, 0.52],
            [6.5, -1.6, 0.70],
            [8.8, -2.8, 0.75],
            [9.6, 1.2, 0.65],
            [10.8, -1.5, 0.85],
            [13.2, -2.4, 0.72],
            [14.5, 1.5, 0.50],
            [16.5, -1.8, 0.65],
            [18.0, -0.8, 0.95],
            [19.2, 2.0, 0.58],
        ];

        for (const [rx, rz, rs] of rockLayout) {
            createRock(
                rx,
                rz,
                rs * (0.85 + Math.random() * 0.3),
                rs * (0.5 + Math.random() * 0.25),
                rs * (0.85 + Math.random() * 0.3),
                Math.random() * Math.PI * 2,
                Math.floor(Math.random() * rockMaterials.length)
            );

            // Natural accompanying smaller pebbles
            if (Math.random() > 0.35) {
                const poX = rx + (Math.random() - 0.5) * 1.5;
                const poZ = rz + (Math.random() - 0.5) * 1.3;
                const ps = rs * (0.3 + Math.random() * 0.25);
                createRock(
                    poX,
                    poZ,
                    ps * 1.1,
                    ps * 0.55,
                    ps * 0.9,
                    Math.random() * Math.PI * 2,
                    Math.floor(Math.random() * rockMaterials.length)
                );
            }

            if (Math.random() > 0.65) {
                const poX2 = rx + (Math.random() - 0.5) * 1.8;
                const poZ2 = rz + (Math.random() - 0.5) * 1.5;
                const ps2 = rs * (0.2 + Math.random() * 0.2);
                createRock(
                    poX2,
                    poZ2,
                    ps2 * 1.0,
                    ps2 * 0.5,
                    ps2 * 0.85,
                    Math.random() * Math.PI * 2,
                    Math.floor(Math.random() * rockMaterials.length)
                );
            }
        }

        // ==========================================
        // 3D CONSTRUCTION BARRIER SIGN ("SITIO WEB EN CONSTRUCCIÓN")
        // ==========================================

        const createSignTexture = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 680;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Background dark board
            ctx.fillStyle = "#181a1d";
            ctx.fillRect(0, 0, 1024, 680);

            // Draw hazard stripes banner
            const drawHazardBanner = (startY: number, height: number) => {
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, startY, 1024, height);
                ctx.clip();

                ctx.fillStyle = "#181a1d";
                ctx.fillRect(0, startY, 1024, height);

                ctx.fillStyle = "#f5a623";
                const stripeW = 58;
                const gap = 58;
                const step = stripeW + gap;

                for (let x = -800; x < 1600; x += step) {
                    ctx.beginPath();
                    ctx.moveTo(x, startY + height);
                    ctx.lineTo(x + stripeW, startY + height);
                    ctx.lineTo(x + stripeW + height * 0.8, startY);
                    ctx.lineTo(x + height * 0.8, startY);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            };

            // Top and bottom hazard bands
            drawHazardBanner(0, 125);
            drawHazardBanner(555, 125);

            // Center typography
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";

            // "SITIO WEB EN"
            ctx.font = "bold 44px 'Poppins', sans-serif";
            ctx.fillText("SITIO WEB EN", 512, 290);

            // "CONSTRUCCIÓN"
            ctx.font = "900 58px 'Poppins', sans-serif";
            ctx.fillText("CONSTRUCCIÓN", 512, 380);

            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            return tex;
        };

        const signGroup = new THREE.Group();

        const signTexture = createSignTexture();
        const signPostMat = new THREE.MeshStandardMaterial({
            color: 0x181a1d,
            roughness: 0.75,
        });

        const signBoardMats = [
            signPostMat, // right
            signPostMat, // left
            signPostMat, // top
            signPostMat, // bottom
            new THREE.MeshStandardMaterial({
                map: signTexture ?? undefined,
                roughness: 0.35,
                metalness: 0.05,
            }), // front face
            signPostMat, // back
        ];

        // Main sign board
        const boardWidth = 3.6;
        const boardHeight = 2.4;
        const boardDepth = 0.12;

        const signBoard = new THREE.Mesh(
            new THREE.BoxGeometry(boardWidth, boardHeight, boardDepth),
            signBoardMats
        );
        signBoard.position.y = 2.4;
        signBoard.castShadow = true;
        signBoard.receiveShadow = true;
        signGroup.add(signBoard);

        // Two vertical legs
        const legGeo = new THREE.BoxGeometry(0.24, 2.4, 0.16);
        const legLeft = new THREE.Mesh(legGeo, signPostMat);
        legLeft.position.set(-1.15, 1.2, 0);
        legLeft.castShadow = true;
        legLeft.receiveShadow = true;
        signGroup.add(legLeft);

        const legRight = new THREE.Mesh(legGeo, signPostMat);
        legRight.position.set(1.15, 1.2, 0);
        legRight.castShadow = true;
        legRight.receiveShadow = true;
        signGroup.add(legRight);

        // Base ground bar
        const baseBar = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.22, 0.45),
            signPostMat
        );
        baseBar.position.set(0, 0.11, 0);
        baseBar.castShadow = true;
        baseBar.receiveShadow = true;
        signGroup.add(baseBar);

        // Position sign: behind ARCODER letters on mobile, left side on desktop
        const signX = isMobile ? 0 : -8.2;
        const signZ = isMobile ? -2 : 2.2;
        signGroup.position.set(signX, getTerrainElevation(signX, signZ), signZ);
        signGroup.rotation.y = isMobile ? 0 : 0.06;
        scene.add(signGroup);

        // ==========================================
        // DUST / SHOCKWAVE IMPACT EFFECT ON LANDING
        // ==========================================

        const dustMat = new THREE.MeshBasicMaterial({
            color: 0x9b8577,
            transparent: true,
            opacity: 0.75,
        });

        const shockwaveMat = new THREE.MeshBasicMaterial({
            color: 0xc4b3a5,
            transparent: true,
            opacity: 0.65,
            side: THREE.DoubleSide,
        });

        const triggerImpactEffect = (posX: number, posZ: number) => {
            // 1. Expanding ground shockwave ring
            const ringGeo = new THREE.RingGeometry(0.2, 0.45, 32);
            const ring = new THREE.Mesh(ringGeo, shockwaveMat.clone());
            ring.rotation.x = -Math.PI / 2;
            ring.position.set(posX, 0.015, posZ);
            scene.add(ring);

            gsap.to(ring.scale, {
                x: 3.6,
                y: 3.6,
                z: 3.6,
                duration: 0.42,
                ease: "power1.out",
            });

            gsap.to(ring.material, {
                opacity: 0,
                duration: 0.42,
                ease: "power2.out",
                onComplete: () => {
                    scene.remove(ring);
                    ring.geometry.dispose();
                    (ring.material as THREE.Material).dispose();
                },
            });

            // 2. Radial puff particles bursting outward
            const puffCount = 10;
            const puffGeo = new THREE.SphereGeometry(0.12, 8, 8);

            for (let i = 0; i < puffCount; i++) {
                const angle = (i / puffCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
                const speed = 0.55 + Math.random() * 0.85;
                const puff = new THREE.Mesh(puffGeo, dustMat.clone());
                puff.position.set(posX, 0.08, posZ);
                const pScale = 0.75 + Math.random() * 0.5;
                puff.scale.setScalar(pScale);
                scene.add(puff);

                const targetPX = posX + Math.cos(angle) * speed;
                const targetPZ = posZ + Math.sin(angle) * speed;
                const targetPY = 0.12 + Math.random() * 0.28;

                gsap.to(puff.position, {
                    x: targetPX,
                    z: targetPZ,
                    y: targetPY,
                    duration: 0.38 + Math.random() * 0.12,
                    ease: "power2.out",
                });

                gsap.to(puff.scale, {
                    x: 0.01,
                    y: 0.01,
                    z: 0.01,
                    duration: 0.42,
                    ease: "power1.in",
                });

                gsap.to(puff.material, {
                    opacity: 0,
                    duration: 0.42,
                    onComplete: () => {
                        scene.remove(puff);
                        puff.geometry.dispose();
                        (puff.material as THREE.Material).dispose();
                    },
                });
            }

            // 3. Shockwave impulse to nearby rocks
            for (const rock of physicalRocks) {
                const rDist = Math.hypot(rock.mesh.position.x - posX, rock.mesh.position.z - posZ);
                if (rDist < 3.0) {
                    const factor = 1 - rDist / 3.0;
                    const pushAngle = Math.atan2(rock.mesh.position.z - posZ, rock.mesh.position.x - posX);
                    rock.vx += Math.cos(pushAngle) * factor * 0.045;
                    rock.vz += Math.sin(pushAngle) * factor * 0.045;
                    rock.vy += factor * 0.06;
                    rock.rotVx = (Math.random() - 0.5) * 0.18;
                    rock.rotVz = (Math.random() - 0.5) * 0.18;
                }
            }
        };

        const word = "ARCODER";
        const letterSpacing = 1.3;
        const startX = -((word.length - 1) * letterSpacing) / 2;

        // ==========================================
        // OFF-SCREEN POSITION
        // ==========================================

        const offScreenX = 30;

        // ==========================================
        // FONT & LETTER ANIMATION
        // ==========================================

        onProgress?.(60);

        const loadingManager = new THREE.LoadingManager(
            () => {
                onProgress?.(100);
                onLoaded?.();
            },
            (_url, itemsLoaded, itemsTotal) => {
                const p = 60 + (itemsLoaded / itemsTotal) * 40;
                onProgress?.(p);
            }
        );

        const fontLoader = new FontLoader(loadingManager);

        fontLoader.load(
            "/fonts/helvetiker_bold.typeface.json",

            (font) => {
                console.log("🔤 Fuente cargada — iniciando animación ARCODER");
                onProgress?.(100);
                onLoaded?.();

                // Letter material
                const letterMat = new THREE.MeshStandardMaterial({
                    color: 0x15528b,
                    metalness: 0.3,
                    roughness: 0.4,
                });

                // Create a letter mesh
                const createLetter = (char: string): THREE.Mesh => {
                    const geo = new TextGeometry(char, {
                        font,
                        size: 1.0,
                        depth: 0.3,
                        curveSegments: 10,
                        bevelEnabled: true,
                        bevelThickness: 0.05,
                        bevelSize: 0.04,
                        bevelSegments: 4,
                    });

                    geo.computeBoundingBox();
                    if (geo.boundingBox) {
                        const c = geo.boundingBox.getCenter(new THREE.Vector3());
                        geo.translate(-c.x, -c.y, -c.z);
                    }

                    const mesh = new THREE.Mesh(geo, letterMat);
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    return mesh;
                };

                // ============================================
                // MAIN ANIMATION SEQUENCE
                // ============================================

                const runSequence = async () => {
                    // ── 1. Show crane briefly ──
                    await delay(1500);

                    // ── 2. Crane exits screen to the right ──
                    console.log("🚜 Grúa saliendo de pantalla…");
                    await moveCraneTo(offScreenX, 2.5);
                    await delay(600);

                    // ── 3. For each letter in ARCODER ──
                    for (let i = 0; i < word.length; i++) {
                        const char = word[i];
                        const targetX = startX + i * letterSpacing;

                        // Crane X so boom tip is above targetX
                        const craneTargetX = targetX - boomTipXOffset;

                        console.log(
                            `📦 Letra "${char}" → posición ${targetX.toFixed(1)}`
                        );

                        // Create letter, attach to hook
                        const letter = createLetter(char);
                        hook.add(letter);
                        letter.position.set(0, -1.0, 0);

                        // Raise hook high (letter travels at top)
                        hookWorldY = 5.0;

                        // Crane starts off-screen right
                        crane.position.x = offScreenX;

                        // ── Enter with letter ──
                        await moveCraneTo(craneTargetX, 2.0);

                        // ── Lower hook ──
                        await moveHookTo(1.5, 1.2);

                        // ── Place letter on ground ──
                        const worldPos = new THREE.Vector3();
                        letter.getWorldPosition(worldPos);

                        hook.remove(letter);
                        scene.add(letter);
                        letter.position.set(targetX, 0.55, 0);

                        // Trigger ground collision effect (dust poof + shockwave ring + pebble hops)
                        triggerImpactEffect(targetX, 0);

                        // Small landing bounce
                        gsap.from(letter.position, {
                            y: 0.8,
                            duration: 0.35,
                            ease: "bounce.out",
                        });

                        await delay(350);

                        // ── Raise hook ──
                        await moveHookTo(5.0, 0.8);

                        // ── Exit ──
                        await moveCraneTo(offScreenX, 1.8);

                        await delay(400);
                    }

                    // ── 4. All letters placed ──
                    console.log("✅ ARCODER completado!");

                    // Brief pause, then maybe a celebratory camera move
                    await delay(500);
                };

                runSequence();
            },

            undefined,

            (error) => {
                console.error("❌ Error cargando fuente:", error);
            }
        );

        // ==========================================
        // RENDER LOOP
        // ==========================================

        let lastCraneX = crane.position.x;
        let animationFrameId: number;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Update camera orbit based on mouse position
            cameraOrbit.targetAngleX = mouseNormX * cameraOrbit.maxAngleX;
            cameraOrbit.targetOffsetY = -mouseNormY * cameraOrbit.maxAngleY; // negative so up = higher
            cameraOrbit.currentAngleX += (cameraOrbit.targetAngleX - cameraOrbit.currentAngleX) * cameraOrbit.lerpSpeed;
            cameraOrbit.currentOffsetY += (cameraOrbit.targetOffsetY - cameraOrbit.currentOffsetY) * cameraOrbit.lerpSpeed;

            camera.position.x = Math.sin(cameraOrbit.currentAngleX) * cameraOrbit.radius;
            camera.position.z = Math.cos(cameraOrbit.currentAngleX) * cameraOrbit.radius;
            camera.position.y = cameraOrbit.baseHeight + cameraOrbit.currentOffsetY;
            camera.lookAt(0, cameraOrbit.lookAtY, 0);

            // ==========================================
            // NATURAL CRANE <-> ROCKS COLLISION & PHYSICS
            // ==========================================
            const craneVx = crane.position.x - lastCraneX;
            lastCraneX = crane.position.x;

            const craneHalfLen = 2.4;
            const craneHalfWidth = 1.35;

            for (const rock of physicalRocks) {
                const rPos = rock.mesh.position;
                const dx = rPos.x - crane.position.x;
                const dz = rPos.z - crane.position.z;

                const overlapX = (craneHalfLen + rock.radius) - Math.abs(dx);
                const overlapZ = (craneHalfWidth + rock.radius) - Math.abs(dz);

                if (overlapX > 0 && overlapZ > 0) {
                    // Collision detected: push rock outward away from crane tracks smoothly
                    const pushDirX = dx >= 0 ? 1 : -1;
                    const pushDirZ = dz >= 0 ? 1 : -1;

                    // Mass factor: larger rocks have higher inertia
                    const mass = Math.max(0.5, rock.radius * 2.0);
                    const force = 1 / mass;

                    const speedImpulse = Math.abs(craneVx) > 0.001 ? Math.abs(craneVx) * 1.2 : 0.04;

                    rock.vx += pushDirX * (overlapX * 0.045 + speedImpulse * 0.4) * force;
                    rock.vz += pushDirZ * (overlapZ * 0.065 + 0.02) * force;

                    // Gentle hop and rolling torque
                    if (rock.mesh.position.y <= rock.origY + 0.04) {
                        rock.vy = (0.05 + Math.random() * 0.04) * force;
                        rock.rotVx = -pushDirZ * 0.15 * force;
                        rock.rotVz = pushDirX * 0.15 * force;
                    }
                }

                // Physics simulation (friction, bounce, rolling)
                if (
                    Math.abs(rock.vx) > 0.0002 ||
                    Math.abs(rock.vz) > 0.0002 ||
                    Math.abs(rock.vy) > 0.0002 ||
                    rock.mesh.position.y > rock.origY
                ) {
                    rock.mesh.position.x += rock.vx;
                    rock.mesh.position.z += rock.vz;
                    rock.mesh.position.y += rock.vy;

                    // Gravity
                    rock.vy -= 0.005;

                    // Ground bounce and damping against organic terrain surface
                    const groundLevel = rock.origY + getTerrainElevation(rock.mesh.position.x, rock.mesh.position.z);
                    if (rock.mesh.position.y <= groundLevel) {
                        rock.mesh.position.y = groundLevel;
                        rock.vy = -rock.vy * 0.25;
                        if (Math.abs(rock.vy) < 0.008) rock.vy = 0;
                    }

                    // Natural rolling rotation aligned with velocity
                    rock.mesh.rotation.x += rock.rotVx + rock.vz * 0.45;
                    rock.mesh.rotation.z += rock.rotVz - rock.vx * 0.45;

                    // Organic surface friction
                    rock.vx *= 0.89;
                    rock.vz *= 0.89;
                    rock.rotVx *= 0.86;
                    rock.rotVz *= 0.86;
                }
            }

            // Update world matrices so getBoomTipWorldPos is accurate
            scene.updateMatrixWorld(true);
            updateCableAndHook();

            renderer.render(scene, camera);
        };

        animate();

        // ==========================================
        // RESIZE
        // ==========================================

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w === 0 || h === 0) return;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        globalThis.addEventListener("resize", handleResize);

        // ==========================================
        // CLEANUP
        // ==========================================

        return () => {
            globalThis.removeEventListener("resize", handleResize);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
            gsap.killTweensOf(crane.position);
            gsap.killTweensOf({});
            renderer.dispose();

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    // ==========================================
    // CONTAINER
    // ==========================================

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 min-h-dvh z-0"
        />
    );
}