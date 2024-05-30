import { BaseController } from './baseController.js';
import * as Constants from '../Constants/constants.js'
import * as CostumMath from '../Utilis/costumMath.js'

var aiCounter = 0;

class AIController extends BaseController
{
    constructor()
    {
        super();

        this.aiID = ++aiCounter;
        this.controllerType = Constants.controllerTypes.AIController;
    }

    controlPaddle(pitch, feautreBall = null) {
        var paddle = pitch.paddle;
        var stage = pitch.stage;

        if (stage.ball.last_touch == paddle)
        {
            if (feautreBall == null) return 0;

            var paddlePositionZ = paddle.getWorldPosition().z;
            var ballPositionZ = feautreBall.getWorldPosition().z;

            if (Math.abs(paddlePositionZ - ballPositionZ) < paddle.depth / 10 * 4) return 0;
            else if (ballPositionZ < paddlePositionZ) return Constants.MoveDirection.Up;
            else return Constants.MoveDirection.Down;
        }

        var paddlePositionZ = paddle.getWorldPosition().z;
        var ballPositionZ = stage.ball.getWorldPosition().z;

        if (Math.abs(paddlePositionZ - ballPositionZ) < paddle.depth / 10 * 4) return 0;
        else if (ballPositionZ < paddlePositionZ) return Constants.MoveDirection.Up;
        else return Constants.MoveDirection.Down;
    }
}

export { AIController };
