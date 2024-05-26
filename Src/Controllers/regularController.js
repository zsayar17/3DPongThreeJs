import * as Event from '../Core/event.js'
import * as Constants from '../Constants/constants.js'
import { BaseController } from './baseController.js';

class RegularController extends BaseController
{

    constructor()
    {
        super();

        this.controllerType = Constants.controllerTypes.RegularController;
    }

    controlPaddle(pitch)
    {
        var direction = 1;

        direction = pitch.side == Constants.Side.Left ? 1 : -1;
        if (Event.isKeyPress(Constants.Keys.Left))
            return 1 * direction;
        if (Event.isKeyPress(Constants.Keys.Right))
            return -1 * direction;
    }
}

export { RegularController };
