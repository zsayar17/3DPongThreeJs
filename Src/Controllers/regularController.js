import * as Event from '../Core/event.js'
import * as Constants from '../Constants/constants.js'

class RegularController
{
    controlPaddle(pitch)
    {
        if (Event.isKeyPress(Constants.KEYUP))
            return 1;
        if (Event.isKeyPress(Constants.KEYDOWN))
            return -1;
    }
}

export { RegularController };
