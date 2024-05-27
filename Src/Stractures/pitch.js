import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js';

import * as Scene from '../Core/scene.js';
import * as Camera from '../Core/camera.js';

import { Box } from '../Primitives/box.js';
import { Plane } from '../Primitives/plane.js';
import { Paddle } from '../Objects/paddle.js';

import * as Identity from '../Identity/Identity.js';

var pitchId = 0;

class Pitch
{
    constructor(yRotation = 0, position = new THREE.Vector3(0, 0, 0))
    {
        this.id = pitchId++;
        if (Identity.getIdentity() != Constants.Identity.server) this.id -= Constants.GameModePlayerCount.OfflineMultiPlayer;

        this.width = Constants.PitchEnvironment.DefaultWidth;
        this.height = Constants.PitchEnvironment.DefaultHeight;
        this.depth = Constants.PitchEnvironment.DefaultDepth;
        this.thickness = Constants.PitchEnvironment.DefaultThickness;

        this.position = new THREE.Vector3();
        this.position.copy(position);
        this.beginPosition = this.position.clone();
        this.yRotation = yRotation;
        this.beginYRotation = this.yRotation;

        this.destination = 0;

        this.walls = [];
        this.goal = null;
        this.floor = null;
        this.paddle = null;
        this.camera = null;

        this.group = null;

        this.stage = null;
        this.identityOnStage = null;

        this.isMoved = false;
        this.isRotated = false;
        this.placed = true;
        this.destroyed = false;
        this.side = 0;

        this.score = 0;

        this.controller = null;

        this.createGroup();

        this.createWalls();
        this.createFloor();
        this.createGoal();
        this.createPaddle();
        this.createCamera();
    }

    createWalls()
    {
        this.walls.push(new Box(this.width, this.height, this.thickness));
        this.walls.push(new Box(this.width, this.height, this.thickness));

        this.walls[0].position.set(0, this.height / 2, (this.depth + this.thickness) / 2 );
        this.walls[1].position.set(0, this.height / 2, -(this.depth + this.thickness) / 2);

        this.walls[0].addObjectToGroup(this.group);
        this.walls[1].addObjectToGroup(this.group);
    }

    createFloor()
    {
        this.floor = new Plane(this.width, this.depth);

        this.floor.addObjectToGroup(this.group);
    }

    createGoal()
    {
        this.goal = new Box(this.thickness, this.height,  2 * this.thickness + this.depth);
        this.goal.position.set(- (this.width + this.thickness) / 2, this.height / 2, 0);

        this.goal.addObjectToGroup(this.group);
    }

    createPaddle()
    {
        this.paddle = new Paddle(this, Paddle.getSize(this));

        this.paddle.addObjectToGroup(this.group);
    }

    createCamera()
    {
        var cameraPosition, cameraTarget;
        var maxDistance = Math.max(this.width, this.height, this.depth);
        var distanceX = -this.width / 2 - this.thickness - maxDistance;
        var distanceY = this.thickness + maxDistance;

        cameraPosition = new THREE.Vector3(distanceX, distanceY, 0);
        cameraTarget = new THREE.Vector3(0, 0, 0);

        this.camera = Camera.createPerspectiveCamera(cameraPosition, cameraTarget);
        Camera.getCameraByIndex(this.camera).addObjectToGroup(this.group);
    }

    createGroup()
    {
        this.group = new THREE.Group();

        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.y = this.yRotation;

        Scene.addElementToScene(this.group);
    }

    bindToStage(stage, identity, side)
    {
        this.stage = stage;
        this.identityOnStage = identity;
        this.side = side;

        this.floor.setText(this.score.toString());
    }

    bindController(controller)
    {
        this.controller = controller;
    }

    removeFormStage()
    {
        this.stage = null;
        this.identityOnStage = null;
        this.side = 0;

        this.score = 0;
        this.floor.setText('');
    }

    moveToDestination()
    {
        var targetPosition, targetYRotation;

        if (this.placed) return;

        targetPosition = this.destination != Constants.Destinations.ToStage ? this.beginPosition : this.identityOnStage.position;
        targetYRotation = this.destination != Constants.Destinations.ToStage ? this.beginYRotation : this.identityOnStage.rotationY;

        this.moveTowardsTarget(targetPosition, Constants.PitchEnvironment.MoveSpeed);
        this.rotateTowardsTarget(targetYRotation, Constants.PitchEnvironment.RotateSpeed);

        if (this.isMoved && this.isRotated)
        {
            this.placed = true;
            this.isMoved = false;
            this.isRotated = false;

            if (this.destination == Constants.Destinations.ToStage) this.controller.bindAllowedCameras(this);
            this.destination = 0;
        }
    }

    moveTowardsTarget(target, speed) {
        if (this.isMoved == true) return;

        var newPosition = this.group.position.clone().lerp(target, speed);

        this.group.position.copy(newPosition);

        if (newPosition.distanceTo(target) < speed * 2) {
            this.isMoved = true;
            this.group.position.copy(target);
        }
    }

    rotateTowardsTarget(target_rotate_y, speed) {
        if (this.isRotated == true) return;

        var currentRotation = this.group.rotation.y % (Math.PI * 2);
        var targetRotation = target_rotate_y % (Math.PI * 2);

        var deltaRotation = targetRotation - currentRotation;

        if (deltaRotation > Math.PI) deltaRotation -= Math.PI * 2;
        else if (deltaRotation < -Math.PI) deltaRotation += Math.PI * 2;

        var lerpFactor = speed / Math.abs(deltaRotation);

        if (lerpFactor > 1) lerpFactor = 1;

        var newRotation = currentRotation + deltaRotation * lerpFactor;

        newRotation = newRotation % (Math.PI * 2);
        if (newRotation < 0) newRotation += Math.PI * 2;

        this.group.rotation.y = newRotation;

        if (Math.abs(deltaRotation) < speed * 2) {
            this.isRotated = true;
            this.group.rotation.y = target_rotate_y;
            this.yRotation = target_rotate_y;
        }
    }

    aimToDestination(destination)
    {
        if (!this.placed) return;

        this.placed = false;
        this.destination = destination;
    }

    movePaddle()
    {
        if (!this.placed || this.controller == null) return;

        this.paddle.move(this.controller.controlPaddle(this));
    }

    getWorldPosition()
    {
        return this.group.position;
    }

    destroy()
    {
        this.destroyed = true;
        Scene.removeElementFromScene(this.group);
    }

    setScore(score)
    {
        this.score = score;
        this.floor.setText(score.toString());
    }

    setByServer()
    {
        if (this.destroyed) return;

        var info = Identity.fetchPitchInfo(this.id);

        if (info == null) return;

        if (info.visibility == false)
        {
            this.destroy();
            return;
        }

        this.group.position.copy(info.position);
        this.group.rotation.y = info.yRotation;
        this.setScore(info.score);

        this.paddle.setByServer();
    }

    setInfos()
    {
        Identity.setPitchesInfo({
            position: this.group.position,
            yRotation: this.group.rotation.y,
            visibility: !this.destroyed,
            score: this.score
        });

        this.paddle.setInfos();
    }
}

export { Pitch };
