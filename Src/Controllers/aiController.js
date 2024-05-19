import * as THREE from '../../Requirments/three.module.js';
import * as Event from '../Core/event.js'
import * as Constants from '../Constants/constants.js'

class AIController
{
    controlPaddle(pitch) {
        var paddle = pitch.paddle;
        var stage = pitch.stage;

        var paddlePositionZ = paddle.getWorldPosition().z;
        var ballPositionZ = stage.ball.getWorldPosition().z;

        if (stage.ball.last_touch == paddle) return 0;

        if (Math.abs(paddlePositionZ - ballPositionZ) < Constants.paddleMoveSpeed
            || Math.abs(paddlePositionZ - ballPositionZ) < paddle.depth / 2 ) return 0;
        else if (ballPositionZ < paddlePositionZ) return Constants.moveUp;
        else return Constants.moveDown;

    }
}

export { AIController };
