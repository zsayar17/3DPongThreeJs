import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js'

import { Box } from '../Primitives/box.js'

class Paddle extends Box
{
    constructor(basePitch, size)
    {
        super(size.width, size.height, size.depth);

        this.object.material.color.setHex(0xff0f0f);
        this.object.material.emissive = new THREE.Color(this.object.material.color.getHex());
        this.object.material.emissiveIntensity = Constants.paddleEmissiveIntensity;

        this.basePitch = basePitch;
        this.position.x = this.basePitch.goal.position.x + (this.basePitch.goal.width) / 2 + this.width;
        this.position.y = this.basePitch.height / 2;
        this.position.z = 0
    }

    static getSize(pitch)
    {
        return {
            width: pitch.thickness * Constants.paddleThicknessRateByPitch,
            height: pitch.height * Constants.paddleHeightRateByPitch,
            depth: pitch.depth * Constants.paddleDepthRateByPitch
        };
    }

    move(moveDirection)
    {

        var oldPosition;
        var direction;

        direction = this.basePitch.yRotation == 0 ? 1 : -1;
        oldPosition = this.position.clone();
        this.position.z -= Constants.paddleMoveSpeed * direction * moveDirection;

        if (this.intersectionByDifferentObject(this.basePitch.walls[0]) || this.intersectionByDifferentObject(this.basePitch.walls[1]))
            this.position.copy(oldPosition);
    }
}

export { Paddle };
