import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js'

import { Box } from '../Primitives/box.js'
import * as CostumMath from '../Utilis/costumMath.js'

import * as Identity from '../Identity/Identity.js';

class Paddle extends Box
{
    constructor(basePitch, size)
    {
        super(size.width, size.height, size.depth);

        this.object.material.color.setHex(0xff0f0f);
        this.object.material.emissive = new THREE.Color(this.object.material.color.getHex());
        this.object.material.emissiveIntensity = Constants.PaddleEnvironment.EmissiveIntensity;

        this.basePitch = basePitch;
        this.position.x = this.basePitch.goal.position.x + (this.basePitch.goal.width) / 2 + this.width;
        this.position.y = this.basePitch.height / 2;
        this.position.z = 0
    }

    static getSize(pitch)
    {
        return {
            width: pitch.thickness * Constants.PaddleEnvironment.ThicknessRateByPitch,
            height: pitch.height * Constants.PaddleEnvironment.HeightRateByPitch,
            depth: pitch.depth * Constants.PaddleEnvironment.DepthRateByPitch
        };
    }

    move(moveDirection)
    {

        var oldPosition;
        var direction;

        direction = this.basePitch.yRotation == 0 ? 1 : -1;
        oldPosition = this.position.clone();
        this.position.z -= Constants.PaddleEnvironment.MoveSpeed * direction * moveDirection * CostumMath.getDeltaTime();

        if (this.intersectionByDifferentObject(this.basePitch.walls[0]) || this.intersectionByDifferentObject(this.basePitch.walls[1]))
            this.position.copy(oldPosition);
    }

    setByServer()
    {
        this.object.position.copy(Identity.fetchPaddleInfo(this.basePitch.id).position);
    }

    setInfos()
    {
        Identity.setPaddlesInfo({
            position: this.object.position
        });
    }
}

export { Paddle };
