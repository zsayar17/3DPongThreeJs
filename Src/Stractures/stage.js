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

        this.pitches[Constants.LEFT] = null;
        this.pitches[Constants.RIGHT] = null;

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

        camera_position.y += Math.max(Constants.DefaultPitchWidth, Constants.DefaultPitchDepth) * 2;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));

        camera_position.z += Math.max(Constants.DefaultPitchWidth, Constants.DefaultPitchDepth) * 2;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));

        camera_position.z -= Math.max(Constants.DefaultPitchWidth, Constants.DefaultPitchDepth) * 4;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));
    }

    _createLight()
    {
        var light_position = this.position.clone();

        light_position.y += Constants.lightDistanceFromStage;
        this.ligt = Lights.createSpotLight(light_position, Constants.lightBeginIntensity, this.ball.object);
    }

    _createBall()
    {
        var ball_position = this.position.clone();

        ball_position.y += Constants.ballRadius * 2;

        this.ball = new Ball(Constants.ballRadius, ball_position);
        this.ball.addToScene();
    }

    bindPitches(left_pitch, right_pitch)
    {
        this.pitches[Constants.LEFT] = left_pitch;
        this.pitches[Constants.RIGHT] = right_pitch;

        var left_pitch_position = this.position.clone();
        var right_pitch_position = this.position.clone();

        left_pitch_position.x -= this.pitches[Constants.LEFT].width / 2;
        right_pitch_position.x += this.pitches[Constants.RIGHT].width / 2;

        this.pitches[Constants.LEFT].bindToStage(this, { position: left_pitch_position, rotationY: 0 }, Constants.LEFT);
        this.pitches[Constants.RIGHT].bindToStage(this, { position: right_pitch_position, rotationY: Math.PI }, Constants.RIGHT);
    }

    divorcePitches()
    {
        this.pitches[Constants.LEFT].removeFormStage();
        this.pitches[Constants.RIGHT].removeFormStage();

        this.pitches[Constants.LEFT] = null;
        this.pitches[Constants.RIGHT] = null;

        this.readyToPlay = false;
        this.gameWinner = null;
    }

    aimPitches(target)
    {
        if (this.moving || target == this.target) return;

        this.target = target;
        this.pitches[Constants.LEFT].aimToTarget(target);
        this.pitches[Constants.RIGHT].aimToTarget(target);
        this.moving = true;

        if (this.readyToPlay) this.ball.setVisible(false);
    }

    movePitchesToAim()
    {
        if (!this.moving) return;

        this.pitches[Constants.LEFT].moveToAim();
        this.pitches[Constants.RIGHT].moveToAim();

        if (this.pitches[Constants.LEFT].placed && this.pitches[Constants.RIGHT].placed)
        {
            this.moving = false;
            if (this.readyToPlay = !this.readyToPlay) this._startGame();
        }
    }

    movePaddles()
    {
        this.pitches[Constants.LEFT].movePaddle();
        this.pitches[Constants.RIGHT].movePaddle();
    }

    _startGame()
    {
        this.ball.setVisible(true);
        this.ball.setRandomDirection(this.pitches[Constants.LEFT].paddle, this.pitches[Constants.RIGHT].paddle);
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

        if(this.pitches[Constants.LEFT].score == Constants.maxScore)
            this.gameWinner = this.pitches[Constants.LEFT];
        else if (this.pitches[Constants.RIGHT].score == Constants.maxScore)
            this.gameWinner = this.pitches[Constants.RIGHT];
    }

    switchCamera()
    {
        cameraIndex = (cameraIndex + 1) % this.cameras.length;

        Camera.setCurrentCameraByİndex(this.cameras[cameraIndex]);
    }
}

export { Stage };
