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

    intersectionByDifferentObject(box) {
        box.object.updateMatrixWorld(true);
        this.object.updateMatrixWorld(true);

        box.object.updateMatrix();
        this.object.updateMatrix();

        const sphere = this.object;
        const box3 = new THREE.Box3().setFromObject(box.object);

        const sphereBox = new THREE.Box3().setFromCenterAndSize(
            sphere.position,
            new THREE.Vector3(this.width, this.height, this.depth)
        );

        return sphereBox.intersectsBox(box3);
    }
}

export { Sphere };
