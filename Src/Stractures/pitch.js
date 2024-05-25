import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js';

import * as Scene from '../Core/scene.js';
import * as Camera from '../Core/camera.js';

import { Box } from '../Primitives/box.js';
import { Plane } from '../Primitives/plane.js';
import { Paddle } from '../Objects/paddle.js';

class Pitch
{
    constructor(yRotation = 0, position = new THREE.Vector3(0, 0, 0))
    {
        this.width = Constants.DefaultPitchWidth;
        this.height = Constants.DefaultPitchHeight;
        this.depth = Constants.DefaultPitchDepth;
        this.thickness = Constants.DefaultPitchThickness;

        this.position = new THREE.Vector3();
        this.position.copy(position);
        this.beginPosition = this.position.clone();
        this.yRotation = yRotation;
        this.beginYRotation = this.yRotation;

        this.target = 0;

        this.walls = [];
        this.goal = null;
        this.floor = null;
        this.paddle = null;
        this.camera = null;

        this.group = null;

        this.stage = null;
        this.identityOnStage = null;

        this._isMoved = false;
        this._isRotated = false;
        this.placed = true;
        this.side = 0;

        this.score = 0;

        this.controller = null;

        this._createWalls();
        this._createFloor();
        this._createGoal();
        this._createPaddle();

        this._createCamera();

        this._createGroup();
    }

    _createWalls()
    {
        this.walls.push(new Box(this.width, this.height, this.thickness));
        this.walls.push(new Box(this.width, this.height, this.thickness));

        this.walls[0].position.set(0, this.height / 2, (this.depth + this.thickness) / 2 );
        this.walls[1].position.set(0, this.height / 2, -(this.depth + this.thickness) / 2);
    }

    _createFloor()
    {
        this.floor = new Plane(this.width, this.depth);
    }

    _createGoal()
    {
        this.goal = new Box(this.thickness, this.height,  2 * this.thickness + this.depth);
        this.goal.position.set(- (this.width + this.thickness) / 2, this.height / 2, 0);
    }

    _createPaddle()
    {
        this.paddle = new Paddle(this, Paddle.getSize(this));
    }

    _createCamera()
    {
        var cameraPosition, cameraTarget;
        var maxDistance = Math.max(this.width, this.height, this.depth);
        var distanceX = -this.width / 2 - this.thickness - maxDistance;
        var distanceY = this.thickness + maxDistance;

        cameraPosition = new THREE.Vector3(distanceX, distanceY, 0);
        cameraTarget = new THREE.Vector3(0, 0, 0);


        this.camera = Camera.createPerspectiveCamera(cameraPosition, cameraTarget);
    }

    _createGroup()
    {
        this.group = new THREE.Group();

        this.walls[0].addObjectToGroup(this.group);
        this.walls[1].addObjectToGroup(this.group);
        this.floor.addObjectToGroup(this.group);
        this.goal.addObjectToGroup(this.group);
        this.paddle.addObjectToGroup(this.group);
        Camera.getCameraByIndex(this.camera).addObjectToGroup(this.group);

        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.y = this.yRotation;

        Scene.addElementToScene(this.group);
    }

    bindToStage(stage, identity, side)
    {
        this.stage = stage;
        this.identityOnStage = identity;
        this.side = side;
        this.controller.bindPitch(this);
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
    }

    moveToAim()
    {
        var targetPosition, targetYRotation;

        if (this.placed) return;

        targetPosition = this.target != Constants.ToStage ? this.beginPosition : this.identityOnStage.position;
        targetYRotation = this.target != Constants.ToStage ? this.beginYRotation : this.identityOnStage.rotationY;

        this._moveTowardsTarget(targetPosition, Constants.PitchMoveSpeed);
        this._rotateTowardsTarget(targetYRotation, Constants.PitchRotateSpeed);

        if (this._isMoved && this._isrotated)
        {
            this.placed = true;
            this._isMoved = false;
            this._isrotated = false;
            this.target = 0;
        }
    }

    _moveTowardsTarget(target, speed)
    {
        var direction, newPosition;

        if (this._isMoved == true) return;

        direction = new THREE.Vector3().copy(target).sub(this.group.position).normalize();
        newPosition = this.group.position.clone().add(direction.multiplyScalar(speed));
        this.group.position.copy(newPosition);

        if (newPosition.distanceTo(target) < 0.1)
        {
            this._isMoved = true;
            this.group.position.copy(target);
        }
    }

    _rotateTowardsTarget(target_rotate_y, speed)
    {
        var newRotation;

        if (this._isrotated == true) return;

        newRotation = this.group.rotation.y + speed;
        this.group.rotation.y = newRotation % (Math.PI * 2);

        if (Math.abs(newRotation - target_rotate_y) < 2 * speed)
        {
            this._isrotated = true;
            this.group.rotation.y = target_rotate_y;
            this.yRotation = target_rotate_y;
        }
    }

    aimToTarget(target)
    {
        if (!this.placed) return;

        this.placed = false;
        this.target = target;
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
        Scene.removeElementFromScene(this.group);
    }
}

export { Pitch };
