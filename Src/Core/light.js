import * as THREE from '../../Requirments/three.module.js';

import * as Constants from '../Constants/constants.js'

import * as Scene from './scene.js'
import * as GUI from './gui.js'

function createSpotLight(position, intensity, target)
{
    var spotLight = new THREE.SpotLight(0xffffff, intensity);

    spotLight.position.set(position.x, position.y, position.z);

    spotLight.target = target;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.decay = Constants.lightDecay;
    spotLight.angle = Constants.lightAngle;
    spotLight.penumbra = Constants.lightPenumbra;

    Scene.addElementToScene(spotLight);

    return spotLight;
}

function createAmbientLight()
{
    var ambientLight = new THREE.AmbientLight(0xffffff, Constants.ambientLightIntensity);
    Scene.addElementToScene(ambientLight);
}

export {createSpotLight, createAmbientLight};
