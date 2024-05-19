import * as THREE from '../../Requirments/three.module.js';
import * as Scene from '../Core/scene.js';
import * as CostumMath from '../Utilis/costumMath.js';

class BaseObject
{
    constructor()
    {
        this.baseGroup = null;
        this.object = null;
        this.material = null;

        this.width;
        this.height;
        this.depth;

        this.position = null;
    }

    addObjectToGroup(group)
    {
        group.add(this.object);
    }

    kickObjectFromGroup(group)
    {
        group.remove(this.object);
    }

    getWorldPosition()
    {
        var vector = new THREE.Vector3();

        this.object.getWorldPosition(vector);
        vector.x = CostumMath.roundToPrecision(vector.x, 3);
        vector.y = CostumMath.roundToPrecision(vector.y, 3);
        vector.z = CostumMath.roundToPrecision(vector.z, 3);

        return vector;
    }

    intersectionByDifferentObject(object)
    {
        var box1, box2;

        box1 = new THREE.Box3().setFromObject(this.object);
        box2 = new THREE.Box3().setFromObject(object.object);

        return box1.intersectsBox(box2);
    }

    shadowEnable()
    {
        this.object.castShadow = true;
        this.object.receiveShadow = true;
    }

    addToScene()
    {
        Scene.addElementToScene(this.object);
    }
}

export { BaseObject };
