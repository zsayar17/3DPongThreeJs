import * as THREE from '../../Requirments/three.module.js';
import { BaseObject } from './baseObject.js';

class Sphere extends BaseObject
{
    constructor(radius, material = null)
    {
        var geometry;

        super();
        geometry = new THREE.SphereGeometry(radius, 32, 32);
        this.material = material == null ? new THREE.MeshStandardMaterial({color: 0x00ff00}) : material;
        this.object = new THREE.Mesh(geometry, this.material);

        this.width = radius;
        this.height = radius;
        this.depth = radius;

        this.position = this.object.position;

        //this.addToScene();
        this.shadowEnable();
    }
}

export { Sphere };
