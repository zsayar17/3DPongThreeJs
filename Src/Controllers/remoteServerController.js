import * as Constants from '../Constants/constants.js'
import { BaseController } from './baseController.js';

import * as Event from '../Core/event.js'

class RemoteServerController extends BaseController
{
    constructor()
    {
        super();

        this.controllerType = Constants.controllerTypes.RemoteController;
    }

    controlPaddle(pitch)
    {
        var direction = 1;
        var move = 0;

        direction = pitch.side == Constants.Side.Left ? 1 : -1;
        if (Event.isKeyPress(Constants.Keys.Left))
            move = direction;
        if (Event.isKeyPress(Constants.Keys.Right))
            move = -direction;

        if (move != 0)
        {
            sendMoveRequest(this.pitch.id, move);
        }
    }
}

export { RemoteServerController };
