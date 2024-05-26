import * as Lights from '../Core/light.js';
import * as Camera from '../Core/camera.js';

import { Ball } from '../Objects/ball.js'

import * as Constants from '../Constants/constants.js'

import * as THREE from '../../Requirments/three.module.js';

class Stage
{
    constructor(position)
    {
        this.position = position;

        this.group = new THREE.Group();

        this.pitches = [];

        this.pitches[Constants.Side.Left] = null;
        this.pitches[Constants.Side.Right] = null;

        this.moving = false;

        this.readyToPlay = false;
        this.stageWinner = null;

        this.ball = null;
        this.light = null;

        this.cameras = [];

        this.target = 0;

        this.createBall();
        this.createLight();
        this.createCameras();
    }

    createCameras()
    {
        var camera_position = this.position.clone();

        camera_position.y += Math.max(Constants.PitchEnvironment.DefaultWidth, Constants.PitchEnvironment.DefaultDepth) * 2;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));

        camera_position.z += Math.max(Constants.PitchEnvironment.DefaultWidth, Constants.PitchEnvironment.DefaultDepth) * 2;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));

        camera_position.z -= Math.max(Constants.PitchEnvironment.DefaultWidth, Constants.PitchEnvironment.DefaultDepth) * 4;
        this.cameras.push(Camera.createPerspectiveCamera(camera_position, this.position));
    }

    createLight()
    {
        var light_position = this.position.clone();

        light_position.y += Constants.LightEnvironment.DistanceFromStage;
        this.light = Lights.createSpotLight(light_position, Constants.LightEnvironment.BeginIntensity, this.ball.object);
    }

    createBall()
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
        this.pitches[Constants.Side.Right] = null;

        this.readyToPlay = false;
        this.stageWinner = null;
    }

    aimPitches(destination)
    {
        if (this.moving || destination == this.target) return;

        this.target = destination;
        this.pitches[Constants.Side.Left].aimToDestination(destination);
        this.pitches[Constants.Side.Right].aimToDestination(destination);
        this.moving = true;

        if (this.readyToPlay) this.ball.setVisible(false);
    }

    movePitchesToDestination()
    {
        if (!this.moving) return;

        if (!this.pitches[Constants.Side.Left].placed)
        {
            this.pitches[Constants.Side.Left].moveToDestination();
            return;
        }
        else if (!this.pitches[Constants.Side.Right].placed)
        {
            this.pitches[Constants.Side.Right].moveToDestination();
            return;
        }

        this.moving = false;
        if (this.readyToPlay = !this.readyToPlay) this.startGame();
    }

    triggerShake()
    {
        console.log(this.cameras.length);
        for (var i = 0; i < this.cameras.length; i++)
            Camera.triggerShakeCamera(i);
        Camera.triggerShakeCamera(this.pitches[Constants.Side.Left].camera);
        Camera.triggerShakeCamera(this.pitches[Constants.Side.Right].camera);
    }

    updateShake()
    {
        for (var i = 0; i < this.cameras.length; i++)
            Camera.updateShakeCamera(i, this.ball.speed / Constants.BallEnvironment.MaxSpeed);
        Camera.updateShakeCamera(this.pitches[Constants.Side.Left].camera, this.ball.speed / Constants.BallEnvironment.MaxSpeed);
        Camera.updateShakeCamera(this.pitches[Constants.Side.Right].camera, this.ball.speed / Constants.BallEnvironment.MaxSpeed);
    }

    movePaddles()
    {
        this.pitches[Constants.Side.Left].movePaddle();
        this.pitches[Constants.Side.Right].movePaddle();
    }

    startGame()
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
        if(!this.readyToPlay || this.moving || this.stageWinner != null) return;

        this.movePaddles();
        this.moveBall();
        this.updateShake();

        if(this.pitches[Constants.Side.Left].score == Constants.maxScore)
            this.stageWinner = this.pitches[Constants.Side.Left];
        else if (this.pitches[Constants.Side.Right].score == Constants.maxScore)
            this.stageWinner = this.pitches[Constants.Side.Right];
    }
}

export { Stage };
