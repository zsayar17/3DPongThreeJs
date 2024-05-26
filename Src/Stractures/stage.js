import * as Lights from '../Core/light.js';
import * as Camera from '../Core/camera.js';

import { Ball } from '../Objects/ball.js'

import * as Constants from '../Constants/constants.js'

var cameraIndex = 0;

class Stage
{
    constructor(position)
    {
        this.position = position;

        this.pitches = [];

        this.pitches[Constants.Side.Left] = null;
        this.pitches[Constants.Side.Right] = null;

        this.moving = false;

        this.readyToPlay = false;
        this.gameWinner = null;

        this.ball = null;
        this.ligt = null;

        this.cameras = [];

        this.target = 0;

        this._createBall();
        this._createLight();
        this._createCameras();
    }

    _createCameras()
    {
        var camera_position = this.position.clone();

        camera_position.y += Math.max(Constants.PitchEnvironment.DefaultWidth, Constants.PitchEnvironment.DefaultDepth) * 2;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));

        camera_position.z += Math.max(Constants.PitchEnvironment.DefaultWidth, Constants.PitchEnvironment.DefaultDepth) * 2;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));

        camera_position.z -= Math.max(Constants.PitchEnvironment.DefaultWidth, Constants.PitchEnvironment.DefaultDepth) * 4;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));
    }

    _createLight()
    {
        var light_position = this.position.clone();

        light_position.y += Constants.LightEnvironment.DistanceFromStage;
        this.ligt = Lights.createSpotLight(light_position, Constants.LightEnvironment.BeginIntensity, this.ball.object);
    }

    _createBall()
    {
        var ball_position = this.position.clone();

        ball_position.y += Constants.BallEnvironment.Radius * 2;

        this.ball = new Ball(Constants.BallEnvironment.Radius, ball_position);
        this.ball.addToScene();
    }

    bindPitches(left_pitch, right_pitch)
    {
        this.pitches[Constants.Side.Left] = left_pitch;
        this.pitches[Constants.Side.Right] = right_pitch;

        var left_pitch_position = this.position.clone();
        var right_pitch_position = this.position.clone();

        left_pitch_position.x -= this.pitches[Constants.Side.Left].width / 2;
        right_pitch_position.x += this.pitches[Constants.Side.Right].width / 2;

        this.pitches[Constants.Side.Left].bindToStage(this, { position: left_pitch_position, rotationY: 0 }, Constants.Side.Left);
        this.pitches[Constants.Side.Right].bindToStage(this, { position: right_pitch_position, rotationY: Math.PI }, Constants.Side.Right);
    }

    divorcePitches()
    {
        this.pitches[Constants.Side.Left].removeFormStage();
        this.pitches[Constants.Side.Right].removeFormStage();

        this.pitches[Constants.Side.Left] = null;
        this.pitches[Constants.RISide.RightGHT] = null;

        this.readyToPlay = false;
        this.gameWinner = null;
    }

    aimPitches(target)
    {
        if (this.moving || target == this.target) return;

        this.target = target;
        this.pitches[Constants.Side.Left].aimToTarget(target);
        this.pitches[Constants.Side.Right].aimToTarget(target);
        this.moving = true;

        if (this.readyToPlay) this.ball.setVisible(false);
    }

    movePitchesToAim()
    {
        if (!this.moving) return;

        this.pitches[Constants.Side.Left].moveToAim();
        this.pitches[Constants.Side.Right].moveToAim();

        if (this.pitches[Constants.Side.Left].placed && this.pitches[Constants.Side.Right].placed)
        {
            this.moving = false;
            if (this.readyToPlay = !this.readyToPlay) this._startGame();
        }
    }

    movePaddles()
    {
        this.pitches[Constants.Side.Left].movePaddle();
        this.pitches[Constants.Side.Right].movePaddle();
    }

    _startGame()
    {
        this.ball.setVisible(true);
        this.ball.setRandomDirection(this.pitches[Constants.Side.Left].paddle, this.pitches[Constants.Side.Right].paddle);
    }

    moveBall()
    {
        this.ball.move();
        this.ball.ballCollisionWithStage(this);
    }

    playGame()
    {
        if(!this.readyToPlay || this.moving || this.gameWinner != null) return;

        this.movePaddles();
        this.moveBall();

        if(this.pitches[Constants.Side.Left].score == Constants.maxScore)
            this.gameWinner = this.pitches[Constants.Side.Left];
        else if (this.pitches[Constants.Side.Right].score == Constants.maxScore)
            this.gameWinner = this.pitches[Constants.Side.Right];
    }

    switchCamera()
    {
        cameraIndex = (cameraIndex + 1) % this.cameras.length;

        Camera.setCurrentCameraByİndex(this.cameras[cameraIndex]);
    }
}

export { Stage };
