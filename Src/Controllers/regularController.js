import * as Event from '../Core/event.js'
import * as Constants from '../Constants/constants.js'
import * as Camera from '../Core/camera.js'

class RegularController
{

    constructor()
    {
        this.allowedCameras = [];
        this.currentCameraIndex = 0;
    }

    controlPaddle(pitch)
    {
        if (Event.isKeyPress(Constants.KEYUP))
            return 1;
        if (Event.isKeyPress(Constants.KEYDOWN))
            return -1;

        if (Event.catchMouseClick() && this.allowedCameras.length > 0)
        {
            this.currentCameraIndex = (this.currentCameraIndex + 1) % this.allowedCameras.length;
            Camera.setCurrentCameraByİndex(this.allowedCameras[this.currentCameraIndex]);
        }
    }

    bindPitch(pitch)
    {
        pitch.paddle.material.color.setHex(0x0000ff);

        this.allowedCameras = [];

        this.allowedCameras.push(pitch.camera);

        for (var i = 0; i < pitch.stage.cameras.length; i++)
            this.allowedCameras.push(pitch.stage.cameras[i]);
    }
}

export { RegularController };
