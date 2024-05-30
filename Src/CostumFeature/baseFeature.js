import * as THREE from '../../Requirments/three.module.js';
import { Sphere } from '../Primitives/sphere.js'

import * as Constants from '../Constants/constants.js';
import * as CostumMath from '../Utilis/costumMath.js'
import * as Identity from '../Identity/Identity.js';

class BaseFeature extends Sphere
{
    constructor (baseStage, radius, position = new THREE.Vector3(0, 0, 0), texture = Constants.Textures.Booster)
    {
        super(radius, texture);

        this.beginPosition = new THREE.Vector3();
        this.beginRotation = this.object.rotation.clone();

        this.beginPosition.copy(position);
        this.object.position.copy(position);

        this.setVisible(false);
        this.dx = 0;
        this.dz = 0;
        this.last_bounced_wall = null;
        this.last_touch = null;

        this.baseStage = baseStage;
        this.ball = this.baseStage.ball;

        this.isActive = false;

        this.speed = Constants.BallEnvironment.BeginSpeed;
    }

    setRandomDirection()
    {
        this.object.position.copy(this.beginPosition);
        this.object.rotation.copy(this.beginRotation);

        var angle = Math.random() + (Math.PI - Constants.BallEnvironment.MaxBeginAngle) / 2;

        this.dz = Constants.BallEnvironment.BeginSpeed * Math.cos(angle);
        this.dx = Constants.BallEnvironment.BeginSpeed * Math.sin(angle) * (Math.random() > 0.5 ? 1 : -1);

        this.last_bounced_wall = null;
        this.last_touch = null;
        this.speed = Constants.BallEnvironment.BeginSpeed;
    }

    move()
    {
        if (this.isActive == false) return;

        const direction = new THREE.Vector3(this.dx, 0, this.dz).normalize();
        const axis = new THREE.Vector3(0, 1, 0).cross(direction).normalize();
        const angle = CostumMath.getDeltaTime() * this.speed / this.object.geometry.parameters.radius;
        const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

        if (axis.length() !== 0 && isFinite(axis.length()) && isFinite(angle))
            this.object.quaternion.multiplyQuaternions(quaternion, this.object.quaternion);

        this.position.x += this.dx * CostumMath.getDeltaTime();
        this.position.z += this.dz * CostumMath.getDeltaTime();
    }

    bounceToWall(bouncedWall)
    {
        this.dz *= -1;

        this.last_bounced_wall = bouncedWall;
    }

    bounceToGoal()
    {
        this.setActive(false);
    }

    bounceToPaddle(paddle)
    {
        this.last_touch = paddle;
    }

    setActive(active)
    {
        this.isActive = active;

        if (active)
        {
            this.setRandomDirection();
            this.setVisible(true);
            return;
        }

        this.dx = 0;
        this.dz = 0;
        this.setVisible(false);
        this.isActive = false;

        this.last_touch = null;
        this.last_bounced_wall = null;
    }

    isActived()
    {
        return this.isActive;
    }


    ballCollisionWithElements(walls, paddles, goals)
    {
        for (var i = 0; i < paddles.length; i++)
        {
            if (this.intersectionByDifferentObject(paddles[i]))
            {
                this.bounceToPaddle(paddles[i]);
                return;
            }
        }

        for (var i = 0; i < walls.length; i++)
        {
            if (this.intersectionByDifferentObject(walls[i]) && this.last_bounced_wall != walls[i])
            {
                this.bounceToWall(walls[i]);
                return;
            }
        }

        for (var i = 0; i < goals.length; i++)
        {
            if (this.intersectionByDifferentObject(goals[i]))
            {
                this.bounceToGoal();
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

    ballCollisionWithStage()
    {
        if (this.isActive == false) return;

        this.ballCollisionWithPitches(this.baseStage.pitches[Constants.Side.Left],
            this.baseStage.pitches[Constants.Side.Right]);
    }

    setVisible(visible)
    {
        if (visible == false)
        {
            this.position.y = 10000;
            return;
        }
        this.position.y = this.beginPosition.y;
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

export { BaseFeature };
