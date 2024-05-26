import * as THREE from '../../Requirments/three.module.js';
import * as Identity from '../Identity/Identity.js';
import * as Constants from '../Constants/constants.js';


var renderer;

function createRenderer()
{
    renderer = new THREE.WebGLRenderer( { physicallyCorrectLights:true, antialias: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function render(scene, camera)
{
    if (Identity.getIdentity() == Constants.Identity.server) return;

    renderer.render(scene, camera);
}

export {render, createRenderer};
