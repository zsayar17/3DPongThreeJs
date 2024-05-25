import * as Event from '../Core/event.js'
import * as Constants from '../Constants/constants.js'

class RemoteController
{
    constructor()
    {
        this.allowedCameras = [];

    }

    bindPitch(pitch)
    {
        this.pitch = pitch;
    }
}
