import * as THREE from '../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js';
import * as Identity from '../Identity/Identity.js';
import * as Renderer from './renderer.js';
import { OrbitControls } from '../../Requirments/OrbitControls.js';

var cameras = [];
var currentCamera = null;
var controls = [];


class Camera
{
    constructor(position, target, cameraType, id, isOrbit = false)
    {
        this.cameraType = cameraType;
        this.id = id;

        this.shakeStartTime = null;
        this.originalPosition = new THREE.Vector3();
        this.shaking = false;
        this.beginPosition = position.clone();

        this.allowedPitches = [];

        if (!isOrbit) this.createPerspectiveCamera(position, target);
        else this.createOrbitCamera(position, target);
    }

    createPerspectiveCamera(position, target)
    {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.set(position.x, position.y, position.z);
        if (target != null) this.camera.lookAt(target);
    }

    createOrbitCamera(position, target)
    {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.set(position.x, position.y, position.z);
        if (target != null) this.camera.lookAt(target);

        var control = new OrbitControls(this.camera, Renderer.getDomElement());

        control.target = target;

        control.minPolarAngle = 0;
        control.maxPolarAngle = Math.PI / 9 * 4;

        control.enableZoom = true;

        control.zoomSpeed = 1;

        controls.push(control);
    }

    addObjectToGroup(group)
    {
        group.add(this.camera);
    }

    backToBeginPosition()
    {
        this.camera.position.copy(this.beginPosition);
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

function createCamera(cameraType, position, target, isOrbit = false)
{
    var camera = new Camera(position, target, cameraType, cameras.length - 1, isOrbit);

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
    cameras[cameraIndex].backToBeginPosition();
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

function resizeAllCameras()
{
    for (var i = 0; i < cameras.length; i++)
    {
        cameras[i].camera.aspect = window.innerWidth / window.innerHeight;
        cameras[i].camera.updateProjectionMatrix();
    }
}

function updateCameras()
{
    for (var i = 0; i < controls.length; i++) controls[i].update();
}

export { updateCameras, resizeAllCameras, createCamera, setCurrentCameraByİndex, getCurrentCamera, getCameraByIndex, totalCameraCount, triggerShakeCamera, updateShakeCamera, clearAllowedPitchesFromAllCameras, addAllowedPitchToCamera, getAllCameras, setCameraInfos };
