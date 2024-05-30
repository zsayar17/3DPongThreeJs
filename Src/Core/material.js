import * as THREE from '../../Requirments/three.module.js';

const texturePath = '../../Textures/'

var textureLoader = new THREE.TextureLoader();

function createTexturedMaterial(textureName, repatX = 1, repatY = 1)
{
    var material = new THREE.MeshStandardMaterial({
        metalness: 0.01,
        roughness: 0.01
    });

    material.map = textureLoader.load(texturePath + textureName + '.jpg');
    material.normalMap = textureLoader.load(texturePath + textureName + '_norm.jpg');
    material.aoMap = textureLoader.load(texturePath + textureName + '_ao.jpg');
    material.roughnessMap = textureLoader.load(texturePath + textureName + '_rough.jpg');

    material.map.anisotropy = 32;
    material.normalMap.anisotropy = 32;
    material.aoMap.anisotropy = 32;
    material.roughnessMap.anisotropy = 32;

    material.map.encoding = THREE.sRGBEncoding;

    material.map.magFilter = THREE.LinearFilter;
    material.map.minFilter = THREE.LinearMipMapLinearFilter;

    material.normalMap.magFilter = THREE.LinearFilter;
    material.normalMap.minFilter = THREE.LinearMipMapLinearFilter;

    material.aoMap.magFilter = THREE.LinearFilter;
    material.aoMap.minFilter = THREE.LinearMipMapLinearFilter;

    material.roughnessMap.magFilter = THREE.LinearFilter;
    material.roughnessMap.minFilter = THREE.LinearMipMapLinearFilter;

    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.repeat.set(repatX, repatY);

    material.aoMap.wrapS = THREE.RepeatWrapping;
    material.aoMap.wrapT = THREE.RepeatWrapping;
    material.aoMap.repeat.set(repatX, repatY);

    material.normalMap.wrapS = THREE.RepeatWrapping;
    material.normalMap.wrapT = THREE.RepeatWrapping;
    material.normalMap.repeat.set(repatX, repatY);

    material.roughnessMap.wrapS = THREE.RepeatWrapping;
    material.roughnessMap.wrapT = THREE.RepeatWrapping;
    material.roughnessMap.repeat.set(repatX, repatY);

    return material;
}

function crateRegularMaterial(color)
{
    return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.000001,
        roughness: 0.000001
    });
}

export { createTexturedMaterial, crateRegularMaterial };

