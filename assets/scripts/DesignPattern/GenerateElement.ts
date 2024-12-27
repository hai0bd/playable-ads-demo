import { Node, Prefab } from "cc";

export class GenerateElements {
    prefab: Prefab;
    testNull: Prefab;
    parent: Node;
    distance: number;
    posX: number = 0;

    constructor(prefab: Prefab, parent: Node) {
        this.prefab = prefab;
        this.parent = parent;
    }

    checkOverride(posZ: number): boolean {
        if (this.posX == 0) {
            if (posZ >= -30 && posZ <= 30) return true;
        }
        return false;
    }
}