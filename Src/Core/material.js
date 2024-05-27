import * as THREE from '../../Requirments/three.module.js';

const texturePath = '../../Textures/Materials/'


function createTexturedMaterial(textureName) {
    var textureLoader = new THREE.TextureLoader();

    var texture = textureLoader.load(texturePath + textureName + '.jpg');
    var normalMap = textureLoader.load(texturePath + textureName + '_normal.jpg');
    var roughnessMap = textureLoader.load(texturePath + textureName + '_roughness.jpg');
    var aoMap = textureLoader.load(texturePath + textureName + '_ao.jpg');

    var material = new THREE.MeshStandardMaterial({
        color : 0xff00ff,
    });

    return material;
}

export { createTexturedMaterial };

