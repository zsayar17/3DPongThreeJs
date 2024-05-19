import * as THREE from '../../Requirments/three.module.js';
import * as Renderer from './renderer.js';
import * as Camera from './camera.js'

var scene;

function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function addElementToScene(element)
{
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
