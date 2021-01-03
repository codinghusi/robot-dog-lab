import { Object3D, Scene } from 'three';
import { Initializer } from './initializer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function storeAtPath(obj: any, path: string[], value: any) {
    path.forEach((name, i) => {
        if (i < path.length - 1) {
            if (!(name in obj)) {
                obj[name] = {};
            }
            obj = obj[name];
        } else {
            obj[name] = value;
        }
    });
}

function flattenObjs(obj: Object3D, accumulator: any = {}) {
    storeAtPath(accumulator, [obj.type, obj.name], obj);
    // accumulator[obj.name] = obj;
    obj.children.forEach(child => flattenObjs(child, accumulator));
    return accumulator;
}

class LoadedMesh {
    public parts: any;
    constructor(public obj: Object3D) {
        this.parts = flattenObjs(obj);
    }
}

interface LoadMapping {
    [key: string]: string;
}

interface LoadedMeshes {
    [key: string]: LoadedMesh;
}


export class MeshLoader {
    public initializer = new Initializer();
    public meshes: LoadedMeshes = {};
    public gltfLoader = new GLTFLoader();

    constructor(public scene: Scene, mapping?: LoadMapping) {
        if (mapping) {
            this.load(mapping);
        }
    }

    load(mapping: LoadMapping) {
        Object.entries(mapping).forEach(([key, path]) => this.loadOne(key, path));
    }

    private loadOne(key: string, path: string) {
        const process = this.initializer.add();
        const ext = path.slice(path.lastIndexOf('.') + 1);
        const self = this;

        if (ext === 'glb') {
            this.gltfLoader.load(path, (gltf) => {
                console.log("loaded", gltf.scene);
            
                const obj = gltf.scene;
                const loaded = new LoadedMesh(obj);
                self.meshes[key] = loaded;
                self.scene.add(obj);
            
                process.finish();
            }, undefined, console.error);
        } else {
            throw `loader for extension '${ext}' not found`
        }
    }

    ready() {
        return this.initializer.ready();
    }
}