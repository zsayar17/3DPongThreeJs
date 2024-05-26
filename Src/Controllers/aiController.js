import { BaseController } from './baseController.js';
import * as Constants from '../Constants/constants.js'
import * as CostumMath from '../Utilis/costumMath.js'


class AIController extends BaseController
{
    constructor()
    {
        super();

        this.controllerType = Constants.controllerTypes.AIController;
    }

    controlPaddle(pitch) {
        var paddle = pitch.paddle;
        var stage = pitch.stage;


        var paddlePositionZ = paddle.getWorldPosition().z;
        var ballPositionZ = stage.ball.getWorldPosition().z;

        if (stage.ball.last_touch == paddle) return 0;

        if (Math.abs(paddlePositionZ - ballPositionZ) < Constants.PaddleEnvironment.MoveSpeed * CostumMath.getDeltaTime()
            || Math.abs(paddlePositionZ - ballPositionZ) < paddle.depth / 2 ) return 0;
        else if (ballPositionZ < paddlePositionZ) return Constants.MoveDirection.Up;
        else return Constants.MoveDirection.Down;
    }
}

export { AIController };
