import * as THREE from '../../Requirments/three.module.js';
import { Sphere } from '../Primitives/sphere.js'

import * as Constants from '../Constants/constants.js';
import * as CostumMath from '../Utilis/costumMath.js'

import * as Identity from '../Identity/Identity.js';


var clock = new THREE.Clock();

class Ball extends Sphere
{
    constructor (baseStage, radius, position = new THREE.Vector3(0, 0, 0))
    {
        super(radius);

        this.beginPosition = new THREE.Vector3();
        this.beginPosition.copy(position);
        this.object.position.copy(position);

        this.object.material.color.setHex(0x0f0fff);

        this.setVisible(false);
        this.dx = 0;
        this.dz = 0;
        this.last_touch = null;
        this.last_bounced_wall = null;

        this.baseStage = baseStage;

        this.speed = Constants.BallEnvironment.BeginSpeed;
    }

    setRandomDirection(paddle_left, paddle_right)
    {

        this.object.position.copy(this.beginPosition);

        var angle = Math.random() + (Math.PI - Constants.BallEnvironment.MaxBeginAngle) / 2;

        this.dz = Constants.BallEnvironment.BeginSpeed * Math.cos(angle);
        this.dx = Constants.BallEnvironment.BeginSpeed * Math.sin(angle) * (Math.random() > 0.5 ? 1 : -1);

        if (this.dx > 0) this.last_touch = paddle_left;
        else this.last_touch = paddle_right;

        this.last_bounced_wall = null;
        this.speed = Constants.BallEnvironment.BeginSpeed;
    }

    move()
    {
        this.position.x += this.dx * CostumMath.getDeltaTime();
        this.position.z += this.dz * CostumMath.getDeltaTime();
    }

    bounceToWall(bouncedWall)
    {
        this.dz *= -1;

        this.last_bounced_wall = bouncedWall;
    }

    bounceToGoal(paddles)
    {
        this.last_touch.basePitch.setScore(this.last_touch.basePitch.score + 1);

        this.setRandomDirection(paddles[Constants.Side.Left], paddles[Constants.Side.Right]);
    }

    bounceToPaddle(paddle)
    {
        var intersectionDiff;
        var intersectionNormal;
        var paddle_world_position;
        var angle;

        if (this.last_touch == paddle) return;

        paddle.basePitch.stage.triggerShake();

        paddle_world_position = new THREE.Vector3();
        paddle_world_position = paddle.getWorldPosition();

        intersectionDiff = paddle_world_position.z - this.position.z;
        intersectionNormal = intersectionDiff / (paddle.depth / 2);
        intersectionNormal = Math.abs(intersectionNormal) > 1 ? Math.sign(intersectionNormal) : intersectionNormal;

        angle = Constants.BallEnvironment.MaxBounceAngle * intersectionNormal;

        this.dx = this.speed * Math.cos(angle) * -Math.sign(this.dx);
        this.dz = -this.speed * Math.sin(angle);


        if (this.speed < Constants.BallEnvironment.MaxSpeed) this.speed += this.speed * Constants.BallEnvironment.AccelerationRate;

        this.last_touch = paddle;

        this.last_bounced_wall = null;
    }

    ballCollisionWithElements(walls, paddles, goals)
    {
        for (var i = 0; i < walls.length; i++)
        {
            if (this.intersectionByDifferentObject(walls[i]) && this.last_bounced_wall != walls[i])
            {
                this.bounceToWall(walls[i]);
                return;
            }
        }

        for (var i = 0; i < paddles.length; i++)
        {
            if (this.intersectionByDifferentObject(paddles[i]))
            {
                this.bounceToPaddle(paddles[i]);
                return;
            }
        }

        for (var i = 0; i < goals.length; i++)
        {
            if (this.intersectionByDifferentObject(goals[i]))
            {
                this.bounceToGoal(paddles);
                return;
            }
        }
    }

    ballCollisionWithPitches(pitch1, pitch2)
    {
        var walls = [ pitch1.walls[0], pitch1.walls[1], pitch2.walls[0], pitch2.walls[1] ];
        var paddles = [pitch1.paddle, pitch2.paddle];
        var goals = [pitch1.goal, pitch2.goal];

        this.ballCollisionWithElements(walls, paddles, goals);
    }

    ballCollisionWithStage(stage)
    {
        this.ballCollisionWithPitches(stage.pitches[Constants.Side.Left], stage.pitches[Constants.Side.Right]);
    }

    setVisible(visible)
    {
        if (this.object.visible == visible) return;

        this.object.visible = visible;
    }

    setByServer()
    {
        var ballInfo = Identity.fetchBallInfo(this.baseStage.id);

        if (ballInfo == null) return;

        this.object.position.copy(ballInfo.position);
        this.setVisible(ballInfo.visible);
        this.object.rotation.copy(ballInfo.rotation);
    }

    setInfos()
    {
        Identity.setBallsInfo({
            rotation: this.object.rotation,
            position: this.object.position,
            visible: this.object.visible
        });
    }
}

export { Ball };
