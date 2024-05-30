import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js';

import * as Scene from '../Core/scene.js';
import * as Camera from '../Core/camera.js';
import * as Light from '../Core/light.js';

import { Box } from '../Primitives/box.js';
import { Plane } from '../Primitives/plane.js';
import { Paddle } from '../Objects/paddle.js';

import * as Identity from '../Identity/Identity.js';
import * as Events from '../Core/event.js';
import * as CostumMath from '../Utilis/costumMath.js'

var pitchId = 0;

var textureName = 'Paving/paving';

class Pitch
{
    constructor(yRotation = 0, position = new THREE.Vector3(0, 0, 0))
    {
        this.id = pitchId++;
        this.name = '';

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
        this.Light = null;

        this.currentCamera = 0;
        this.allowedCameras = [];

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

        this.createFloor();
        this.createWalls();
        this.createGoal();
        this.createPaddle();
        this.createCamera();
        //this.createLight();

        this.setScore(this.score);
    }

    createWalls()
    {
        this.walls.push(new Box(this.width, this.height, this.thickness, Constants.Textures.Wall));
        this.walls.push(new Box(this.width, this.height, this.thickness, Constants.Textures.Wall));

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
        this.goal = new Box(2 * this.thickness + this.depth, this.height, this.thickness, Constants.Textures.Wall);

        this.goal.object.rotateY(Math.PI / 2);
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

        this.camera = Camera.createCamera(Constants.CameraTypes.Pitch, cameraPosition, cameraTarget);
        Camera.getCameraByIndex(this.camera).addObjectToGroup(this.group);
    }

    createGroup()
    {
        this.group = new THREE.Group();

        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.y = this.yRotation;

        Scene.addElementToScene(this.group);
    }

    createLight()
    {
        var position = new THREE.Vector3(0, 0, 0);

        position.copy(this.goal.position);
        position.y += this.height * 4;

        this.Light = new Light.createSpotLight(position, Constants.LightEnvironment.BeginIntensity, this.group);

        this.group.add(this.Light);
    }

    bindToStage(stage, identity, side)
    {
        this.stage = stage;
        this.identityOnStage = identity;
        this.side = side;

        this.setScore(this.score);
    }

    bindController(controller)
    {
        this.controller = controller;

        if (Identity.getIdentity() == Constants.Identity.server) return;

        if (this.controller.controllerType == Constants.controllerTypes.AIController)
            this.name = 'AI ' + this.controller.aiID;
        else if (this.controller.controllerType == Constants.controllerTypes.RegularController
                && Identity.getIdentity() != Constants.Identity.multiOfflineClient)
            this.name = 'You';
    }

    setNameManuel(name)
    {
        this.name = name;
        this.setScore(this.score);
    }

    removeFormStage()
    {
        this.stage = null;
        this.identityOnStage = null;
        this.side = 0;

        this.setScore(0);
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

            this.destination = 0;
        }
    }

    moveTowardsTarget(target, speed) {
        if (this.isMoved == true) return;

        if (CostumMath.getDeltaTime() == 0 || CostumMath.getDeltaTime() > 0.5) return;

        var newPosition = this.group.position.clone().lerp(target, speed * CostumMath.getDeltaTime());

        this.group.position.copy(newPosition);

        if (newPosition.distanceTo(target) <= 0.1) {
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

        if (Math.abs(deltaRotation) <= speed) {
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

        if (Identity.getSupportCostumMatch() && this.controller.controllerType == Constants.controllerTypes.AIController)
        {
            this.paddle.move(this.controller.controlPaddle(this, this.stage.getActiveFeatureBall()));
            return;
        }
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
        if (Identity.getIdentity() == Constants.Identity.server) return;
        var text = [];

        text.push(score);
        text.push(this.name);
        this.floor.setText(text, Constants.Colors[(this.id % Constants.Colors.length)]);

        if (this.stage != null)
            this.stage.clearFeatures();
    }

    setAllowedCameras(gameArea, singleCameraMode = false)
    {
        this.allowedCameras = [];

        if (singleCameraMode)
        {
            Camera.addAllowedPitchToCamera(gameArea.wideCamera, this.id);
            this.allowedCameras.push(gameArea.wideCamera);

            this.resetDisplayCamera();
            return;
        }

        if (this.destroyed)
        {
            var availableCameras = gameArea.getAvailableCameras();

            for (var i = 0; i < availableCameras.length; i++)
            {
                Camera.addAllowedPitchToCamera(availableCameras[i], this.id);
                this.allowedCameras.push(availableCameras[i]);
            }
            this.resetDisplayCamera();
            return;
        }

        Camera.addAllowedPitchToCamera(this.camera, this.id);
        this.allowedCameras.push(this.camera);

        for (var i = 0;this.stage != null && i < this.stage.cameras.length; i++)
        {
            this.allowedCameras.push(this.stage.cameras[i]);
            Camera.addAllowedPitchToCamera(this.stage.cameras[i], this.id);
        }

        Camera.addAllowedPitchToCamera(gameArea.wideCamera, this.id);
        this.allowedCameras.push(gameArea.wideCamera);

        this.resetDisplayCamera();
    }

    resetDisplayCamera()
    {
        if ((Identity.getIdentity() != Constants.Identity.singleOfflineClient && Identity.getIdentity() != Constants.Identity.onlineClient)
            || this.controller == null ||  this.controller.controllerType == Constants.controllerTypes.AIController) return;

        this.currentCamera = 0;
        Camera.setCurrentCameraByİndex(this.allowedCameras[this.currentCamera]);
    }

    changeCamera()
    {
        if ((Identity.getIdentity() != Constants.Identity.singleOfflineClient && Identity.getIdentity() != Constants.Identity.onlineClient)
            || this.controller == null || this.controller.controllerType == Constants.controllerTypes.AIController) return;

        if (Events.catchSpaceEvent())
        {
            this.currentCamera = (this.currentCamera + 1) % this.allowedCameras.length;

            Camera.setCurrentCameraByİndex(this.allowedCameras[this.currentCamera]);
        }
    }

    setByServer()
    {
        var cameras = Identity.fetchCameraInfo(this.id);

        if (cameras != null && cameras.length > 0)
        {
            this.allowedCameras = cameras;

            if (cameras.length != this.allowedCameras.length)
            {
                this.currentCamera = 0;
                Camera.setCurrentCameraByİndex(this.allowedCameras[this.currentCamera]);
            }

            this.changeCamera();

            if (this.destroyed) return;
        }

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
