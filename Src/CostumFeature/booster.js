import { BaseFeature } from './baseFeature.js';
import * as Constants from '../Constants/constants.js';
import * as CostumMath from '../Utilis/costumMath.js';

class Booster extends BaseFeature
{
    constructor (baseStage, radius, position = new THREE.Vector3(0, 0, 0))
    {
        super(baseStage, radius, position, Constants.Textures.Wall);

        this.boost_paddle = null;
        this.timeDuration = 0;
    }

    ballCollisionWithStage()
    {
        super.ballCollisionWithStage();

        if (this.last_touch == null) return;

        this.boost_paddle = this.last_touch;

        this.boost_paddle.boostSpeedRate = Constants.FeatureAttributes.BoostSpeedRate;
        this.boost_paddle.object.material = this.object.material;

        this.setActive(false);
    }

    checkFeature()
    {
        if (this.boost_paddle == null) return;

        if (this.timeDuration < Constants.FeatureAttributes.BoostTime)
        {
            this.timeDuration += CostumMath.getDeltaTime();
            return;
        }

        this.clearFeature();
    }

    isClear()
    {
        return this.boost_paddle == null;
    }

    clearFeature()
    {
        this.timeDuration = 0;
        this.boost_paddle.object.material = this.boost_paddle.baseMaterial;
        this.boost_paddle.boostSpeedRate = 1;
        this.boost_paddle = null;
        this.setVisible(false);
    }
}

export { Booster };
