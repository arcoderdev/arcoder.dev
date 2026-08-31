import type * as THREE from "three";

export interface LoaderProps {
    progress: number;
    loaded: boolean;
}

export interface PhysicalRock {
    mesh: THREE.Mesh;
    origY: number;
    radius: number;
    vx: number;
    vy: number;
    vz: number;
    rotVx: number;
    rotVz: number;
}

export interface CraneSceneProps {
    onProgress?: (progress: number) => void;
    onLoaded?: () => void;
}
