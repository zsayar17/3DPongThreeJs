import * as THREE from '../../Requirments/three.module.js';
import { BaseObject } from './baseObject.js';

class Plane extends BaseObject
{
    constructor(width, height, material = null)
    {
        var geometry;

        super();
        geometry = new THREE.PlaneGeometry(width, height);

        geometry.rotateX(-Math.PI / 2)
        this.material = material == null ? new THREE.MeshStandardMaterial({color: 0xffffff}) : material;
        this.object = new THREE.Mesh(geometry, this.material);

        this.width = width;
        this.depth = height;
        this.height = 0;

        this.position = this.object.position;

        //this.addToScene();
        this.shadowEnable();
    }
}

export { Plane };
