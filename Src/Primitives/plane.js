import * as THREE from '../../Requirments/three.module.js';
import { BaseObject } from './baseObject.js';

class Plane extends BaseObject
{
    constructor(width, height, material = null)
    {
        var geometry;

        super();

        this.material = new THREE.MeshStandardMaterial({color: 0xffffff});

        geometry = new THREE.PlaneGeometry(width, height);
        geometry.rotateX(-Math.PI / 2);

        this.object = new THREE.Mesh(geometry, this.material);
        this.setText("");

        this.width = width;
        this.depth = height;
        this.height = 0;

        this.position = this.object.position;

        this.shadowEnable();
    }


    setText(text, rotateAngle = Math.PI / 2) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = 256;
        canvas.height = 256;

        var texture = new THREE.CanvasTexture(canvas);

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(rotateAngle);

        context.fillStyle = 'black';
        context.font = '64px Arial';

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 0, 0); // Metni canvas'a yaz


        this.material.map = texture;

    }
}

export { Plane };
