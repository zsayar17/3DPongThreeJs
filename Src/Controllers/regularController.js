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
        if (Event.isKeyPress(Constants.KEYLEFT))
            return 1;
        if (Event.isKeyPress(Constants.KEYRIGHT))
            return -1;
    }
}

export { RegularController };
