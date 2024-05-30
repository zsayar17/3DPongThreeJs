import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js'

import { Box } from '../Primitives/box.js'
import { Sphere } from '../Primitives/sphere.js'

import * as CostumMath from '../Utilis/costumMath.js'

import * as Identity from '../Identity/Identity.js';

class Paddle extends Box
{
    constructor(basePitch, size)
    {
        super(size.width, size.height, size.depth, Constants.Textures.Ball);

        this.baseMaterial = Constants.Textures.Ball;
        this.basePitch = basePitch;
        this.position.x = this.basePitch.goal.position.x + (this.basePitch.goal.depth) + this.width;
        this.position.y = this.basePitch.height / 2;
        this.position.z = 0

        this.isFreezed = false;

        this.boostSpeedRate = 1;
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

        if (this.isFreezed) return;

        direction = this.basePitch.yRotation == 0 ? 1 : -1;
        oldPosition = this.position.clone();
        this.position.z -= this.boostSpeedRate * Constants.PaddleEnvironment.MoveSpeed * direction * moveDirection * CostumMath.getDeltaTime();

        if (this.intersectionByDifferentObject(this.basePitch.walls[0]) || this.intersectionByDifferentObject(this.basePitch.walls[1]))
            this.position.copy(oldPosition);
    }

    setByServer()
    {
        var info = Identity.fetchPaddleInfo(this.basePitch.id);

        if (info == null) return;

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
