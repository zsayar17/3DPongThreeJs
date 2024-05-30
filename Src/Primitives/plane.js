import * as THREE from '../../Requirments/three.module.js';
import { BaseObject } from './baseObject.js';

import * as Materials from '../Core/material.js';

class Plane extends BaseObject
{
    constructor(width, height, material = null)
    {
        var geometry;

        super();

        this.material = material == null ? Materials.crateRegularMaterial(0xffffff) : material;

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


    setText(text, color, rotateAngle = Math.PI / 2) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        canvas.width = 256;
        canvas.height = 256;

        var texture = new THREE.CanvasTexture(canvas);

        context.fillStyle = 'darkgrey';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(rotateAngle);

        context.fillStyle = color;
        context.font = '48px Arial';

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for (var i = 0; i < text.length; i++)
        {
            context.fillText(text[i], 0, 0);
            context.translate(0, 56);
        }

        this.material.map = texture;
    }
}

export { Plane };
