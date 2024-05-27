import * as THREE from '../../Requirments/three.module.js';

var cameras = [];
var currentCamera = null;

class Camera
{
    constructor(position, target)
    {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.isDisplayeble = true;

        this.shakeDuration = 0.5;
        this.shakeIntensity = 0.1;
        this.shakeStartTime = null;
        this.originalPosition = new THREE.Vector3();
        this.shaking = false;

        this.camera.position.set(position.x, position.y, position.z);
        if (target != null) this.camera.lookAt(target);
    }

    addObjectToGroup(group)
    {
        group.add(this.camera);
    }
}

function createPerspectiveCamera(position, target = new THREE.Vector3(0, 0, 0))
{

    var camera = new Camera(position, target);

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
    if (cameras[cameraIndex].isDisplayeble == false) return;

    currentCamera = cameras[cameraIndex].camera;
}

function getCurrentCamera()
{
    return currentCamera;
}

function totalCameraCount()
{
    return cameras.length;
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

    if (elapsedTime > camera.shakeDuration) {
        camera.shaking = false;
        camera.camera.position.copy(camera.originalPosition);
        return;
    }

    var shakeAmountX = (Math.random() * 2 - 1) * camera.shakeIntensity * speedRate;
    var shakeAmountY = (Math.random() * 2 - 1) * camera.shakeIntensity * speedRate;
    var shakeAmountZ = (Math.random() * 2 - 1) * camera.shakeIntensity * speedRate;

    camera.camera.position.set(
        camera.originalPosition.x + shakeAmountX,
        camera.originalPosition.y + shakeAmountY,
        camera.originalPosition.z + shakeAmountZ
    );
}


export { createPerspectiveCamera, setCurrentCameraByİndex, getCurrentCamera, getCameraByIndex, totalCameraCount, triggerShakeCamera, updateShakeCamera };
