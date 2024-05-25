import * as Constants from '../Constants/constants.js'
import { BaseController } from './baseController.js';

class RemoteController extends BaseController
{
    constructor()
    {
        super();

        this.controllerType = Constants.controllerTypes.RemoteController;
    }
}

export { RemoteController };
