import * as THREE from '../../Requirments/three.module.js';
import * as Renderer from './renderer.js';
import * as Camera from './camera.js'
import * as Identity from '../Identity/Identity.js';
import * as Constants from '../Constants/constants.js';

var scene;

function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function addElementToScene(element)
{
    if (Identity.getIdentity() == Constants.Identity.server) return;

    scene.add(element);
}

function removeElementFromScene(element)
{
    scene.remove(element);
}

function renderScene()
{
    Renderer.render(scene, Camera.getCurrentCamera());
}

export {createScene, addElementToScene, removeElementFromScene, renderScene};
