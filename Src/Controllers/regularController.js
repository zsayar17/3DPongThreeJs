import * as Event from '../Core/event.js'
import * as Constants from '../Constants/constants.js'
import { BaseController } from './baseController.js';

class RegularController extends BaseController
{

    constructor(keyLeft, keyRight)
    {
        super();

        this.controllerType = Constants.controllerTypes.RegularController;
        this.keyLeft = keyLeft;
        this.keyRight = keyRight;
    }

    controlPaddle(pitch)
    {
        var direction = 1;

        direction = pitch.side == Constants.Side.Left ? 1 : -1;
        if (Event.isKeyPress(this.keyLeft))
            return 1 * direction;
        if (Event.isKeyPress(this.keyRight))
            return -1 * direction;
    }
}

export { RegularController };
