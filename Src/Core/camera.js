import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js';

import * as Identity from '../Identity/Identity.js';

import * as Renderer from './renderer.js';
var cameras = [];
var currentCamera = null;

class Camera
{
    constructor(position, target, cameraType, id)
    {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.shakeStartTime = null;
        this.originalPosition = new THREE.Vector3();
        this.shaking = false;

        this.id = id;
        this.cameraType = cameraType;

        this.allowedPitches = [];

        this.camera.position.set(position.x, position.y, position.z);
        if (target != null) this.camera.lookAt(target);
    }

    addObjectToGroup(group)
    {
        group.add(this.camera);
    }

    setInfos()
    {
        Identity.setCameraInfos({
            id: this.id,
            allowedIDs: this.allowedPitches,
            shake: this.shaking,
        });
    }
}

function createPerspectiveCamera(cameraType, position, target, isOrbit = false)
{
    var camera = new Camera(position, target, cameraType, cameras.length - 1);

    if (isOrbit)
    {
        Renderer.createOrbitControls(camera.camera);
    }

    if (currentCamera == null) currentCamera = camera.camera;

    cameras.push(camera);


    return cameras.length - 1;
}

function getCameraByIndex(cameraIndex)
{
    return cameras[cameraIndex];
}

function setCurrentCameraByİndex(cameraIndex)
{
    currentCamera = cameras[cameraIndex].camera;
}

function clearAllowedPitchesFromAllCameras(cameraIndex)
{
    for (var i = 0; i < cameras.length; i++)
        cameras[i].allowedPitches = [];
}

function addAllowedPitchToCamera(cameraIndex, pitchIndex)
{
    cameras[cameraIndex].allowedPitches.push(pitchIndex);
}

function getAllCameras()
{
    return cameras;
}

function getCurrentCamera()
{
    return currentCamera;
}

function totalCameraCount()
{
    return cameras.length;
}

function setCameraInfos()
{
    for (var i = 0; i < cameras.length; i++) cameras[i].setInfos();
}

function triggerShakeCamera(cameraIndex) {

    var camera = cameras[cameraIndex];

    camera.shaking = true;
    camera.shakeStartTime = performance.now() / 1000;
    camera.originalPosition.copy(camera.camera.position);
}

function updateShakeCamera(cameraIndex, speedRate) {

    var camera = cameras[cameraIndex];

    if (!camera.shaking) return;

    var currentTime = performance.now() / 1000;
    var elapsedTime = currentTime - camera.shakeStartTime;

    if (elapsedTime > Constants.CameraEnvironment.ShakeDuration) {
        camera.shaking = false;
        camera.camera.position.copy(camera.originalPosition);
        return;
    }

    var shakeAmountX = (Math.random() * 2 - 1) * Constants.CameraEnvironment.ShakeIntensity * speedRate;
    var shakeAmountY = (Math.random() * 2 - 1) * Constants.CameraEnvironment.ShakeIntensity * speedRate;
    var shakeAmountZ = (Math.random() * 2 - 1) * Constants.CameraEnvironment.ShakeIntensity * speedRate;

    camera.camera.position.set(
        camera.originalPosition.x + shakeAmountX,
        camera.originalPosition.y + shakeAmountY,
        camera.originalPosition.z + shakeAmountZ
    );
}

export { createPerspectiveCamera, setCurrentCameraByİndex, getCurrentCamera, getCameraByIndex, totalCameraCount, triggerShakeCamera, updateShakeCamera, clearAllowedPitchesFromAllCameras, addAllowedPitchToCamera, getAllCameras, setCameraInfos };
