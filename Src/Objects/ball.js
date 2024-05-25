import * as THREE from '../../Requirments/three.module.js';
import { Sphere } from '../Primitives/sphere.js'

import * as Constants from '../Constants/constants.js';

class Ball extends Sphere
{
    constructor (radius, position = new THREE.Vector3(0, 0, 0))
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

        this.speed = Constants.ballSpeed;
    }

    setRandomDirection(paddle_left, paddle_right)
    {
        this.object.position.copy(this.beginPosition);

        var angle = Math.random() + (Math.PI - Constants.ballMaxBeginAngle) / 2;

        this.dz = Constants.ballSpeed * Math.cos(angle);
        this.dx = Constants.ballSpeed * Math.sin(angle) * (Math.random() > 0.5 ? 1 : -1);

        if (this.dx > 0) this.last_touch = paddle_left;
        else this.last_touch = paddle_right;

        this.speed = Constants.ballSpeed;
    }

    move()
    {
        this.position.x += this.dx;
        this.position.z += this.dz;
    }

    bounceToWall()
    {
        this.dz *= -1;
    }

    bounceToGoal(paddles)
    {
        this.last_touch.basePitch.setScore(this.last_touch.basePitch.score + 1);

        this.setRandomDirection(paddles[Constants.LEFT], paddles[Constants.RIGHT]);
    }

    bounceToPaddle(paddle)
    {
        var intersectionDiff;
        var intersectionNormal;
        var paddle_world_position;
        var angle;

        if (this.last_touch == paddle) return;

        paddle_world_position = new THREE.Vector3();
        paddle_world_position = paddle.getWorldPosition();

        intersectionDiff = paddle_world_position.z - this.position.z;
        intersectionNormal = intersectionDiff / (paddle.depth / 2);
        intersectionNormal = Math.abs(intersectionNormal) > 1 ? Math.sign(intersectionNormal) : intersectionNormal;

        angle = Constants.ballMaxBounceAngle * intersectionNormal;

        this.dx = this.speed * Math.cos(angle) * -Math.sign(this.dx);
        this.dz = -this.speed * Math.sin(angle);


        if (this.speed < Constants.maxBallSpeed) this.speed += this.speed * Constants.ballAccelerationRate;

        this.last_touch = paddle;
    }

    ballCollisionWithElements(walls, paddles, goals)
    {
        for (var i = 0; i < walls.length; i++)
        {
            if (this.intersectionByDifferentObject(walls[i]))
            {
                this.bounceToWall();
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
        this.ballCollisionWithPitches(stage.pitches[Constants.LEFT], stage.pitches[Constants.RIGHT]);
    }

    setVisible(visible)
    {
        this.object.visible = visible;
    }
}

export { Ball };
