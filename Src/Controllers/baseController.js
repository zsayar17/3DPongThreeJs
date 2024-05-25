import * as Constants from '../Constants/constants.js'

class BaseController
{
    constructor()
    {
        this.allowedCameras = [];
        this.currentCameraIndex = 0;
        this.controllerType = 0;
    }

    bindAllowedCameras(pitch)
    {
        this.allowedCameras = [];

        this.allowedCameras.push(pitch.camera);

        for (var i = 0; i < pitch.stage.cameras.length; i++)
            this.allowedCameras.push(pitch.stage.cameras[i]);

        if (this.controllerType == Constants.controllerTypes.RegularController)
            pitch.paddle.material.color.setHex(0xffffff);
    }
}

export { BaseController }
