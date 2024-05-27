import * as Constants from '../Constants/constants.js'
import { BaseController } from './baseController.js';

import * as Event from '../Core/event.js'

class RemoteController extends BaseController
{
    constructor()
    {
        super();

        this.controllerType = Constants.controllerTypes.RemoteController;
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

export { RemoteController };
