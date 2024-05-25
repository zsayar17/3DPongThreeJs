import * as THREE from '../../Requirments/three.module.js';

var cameras = [];
var currentCamera = null;

class Camera
{
    constructor(position, target)
    {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.isDisplayeble = true;

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


export { createPerspectiveCamera, setCurrentCameraByİndex, getCurrentCamera, getCameraByIndex, totalCameraCount };
