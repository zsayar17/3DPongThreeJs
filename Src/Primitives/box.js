import * as THREE from '../../Requirments/three.module.js';

import { BaseObject } from './baseObject.js';

class Box extends BaseObject
{
    constructor(width, height, depth, material = null)
    {
        var geometry;

        super();
        geometry = new THREE.BoxGeometry(width, height, depth);
        this.material = material == null ? new THREE.MeshStandardMaterial({color: 0x00ff00}) : material;
        this.object = new THREE.Mesh(geometry, this.material);

        this.width = width;
        this.height = height;
        this.depth = depth;

        this.position = this.object.position;

        //this.addToScene();
        this.shadowEnable();
    }
}

export { Box };
