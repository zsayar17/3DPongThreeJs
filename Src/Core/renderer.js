import { OrbitControls } from '../../Requirments/OrbitControls.js';
import * as THREE from '../../Requirments/three.module.js';
import * as Camera from './camera.js'

var renderer;

window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    Camera.resizeAllCameras();
});

function createRenderer()
{
    renderer = new THREE.WebGLRenderer( { physicallyCorrectLights:true, antialias: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.domElement.id = "Game";
    document.body.appendChild(renderer.domElement);
}

function createOrbitControls(camera)
{
    new OrbitControls(camera, renderer.domElement);
}

function render(scene, camera)
{
    renderer.render(scene, camera);
}

function getDomElement()
{
    return renderer.domElement;
}


export {render, createRenderer, createOrbitControls, getDomElement};
