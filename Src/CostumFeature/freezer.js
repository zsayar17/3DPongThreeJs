
import { BaseFeature } from './baseFeature.js';
import * as Constants from '../Constants/constants.js';
import * as CostumMath from '../Utilis/costumMath.js';

class Freezer extends BaseFeature
{
    constructor (baseStage, radius, position = new THREE.Vector3(0, 0, 0))
    {
        super(baseStage, radius, position, Constants.Textures.Snow);

        this.freeze_paddle = null;
        this.timeDuration = 0;
    }

    ballCollisionWithStage()
    {
        super.ballCollisionWithStage();

        if (this.last_touch == null) return;

        this.freeze_paddle = this.baseStage.pitches[(this.last_touch.basePitch.side + 1) % 2].paddle;

        this.freeze_paddle.isFreezed = true;
        this.freeze_paddle.object.material = this.object.material;

        this.setActive(false);
    }

    checkFeature()
    {
        if (this.freeze_paddle == null) return;

        if (this.timeDuration < Constants.FeatureAttributes.FreezeTime)
        {
            this.timeDuration += CostumMath.getDeltaTime();
            return;
        }

        this.clearFeature();
    }

    isClear()
    {
        return this.freeze_paddle == null;
    }

    clearFeature()
    {
        this.freeze_paddle.isFreezed = false;
        this.timeDuration = 0;
        this.freeze_paddle.object.material = this.freeze_paddle.baseMaterial;
        this.freeze_paddle = null;
    }
}

export { Freezer };
