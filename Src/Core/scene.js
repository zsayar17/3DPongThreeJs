import * as THREE from '../../Requirments/three.module.js';
import * as Renderer from './renderer.js';
import * as Camera from './camera.js'
import * as Identity from '../Identity/Identity.js';
import * as Constants from '../Constants/constants.js';

var scene;

function createScene()
{
    scene = new THREE.Scene();
    const loader = new THREE.CubeTextureLoader();

    const texture = loader.load([
        '../../Textures/SkyBox/posx.jpg', // Pozitif x
        '../../Textures/SkyBox/negx.jpg', // Negatif x
        '../../Textures/SkyBox/posy.jpg', // Pozitif y
        '../../Textures/SkyBox/negy.jpg', // Negatif y
        '../../Textures/SkyBox/posz.jpg', // Pozitif z
        '../../Textures/SkyBox/negz.jpg'  // Negatif z
    ]);


    scene.background = texture;
}

function addElementToScene(element)
{
    if (Identity.getIdentity() == Constants.Identity.server) return;

    scene.add(element);
}

function removeElementFromScene(element)
{
    if (Identity.getIdentity() == Constants.Identity.server) return;

    scene.remove(element);
}

function renderScene()
{
    if (Identity.getIdentity() == Constants.Identity.server) return;

    Renderer.render(scene, Camera.getCurrentCamera());
}

export {createScene, addElementToScene, removeElementFromScene, renderScene};
