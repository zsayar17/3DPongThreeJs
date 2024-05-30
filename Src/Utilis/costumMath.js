import * as THREE from '../../Requirments/three.module.js';

var clock = new THREE.Clock();
var deltaTime = 0;
let isDocumentHidden = false;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) isDocumentHidden = true;
    else
    {
        deltaTime = 0;
        clock.start();
        isDocumentHidden = false;
    }
});

function getDeltaTime()
{
    return deltaTime;
}

function updateDeltaTime()
{
    if (!isDocumentHidden) deltaTime = clock.getDelta();
    else deltaTime = 0;
}

function roundToPrecision(value, precision)
{
    var multiplier = Math.pow(10, precision);

    return Math.round(value * multiplier) / multiplier;
}

function rotatePoint(x, y, angle)
{
    var newX = x * Math.cos(angle) - y * Math.sin(angle);
    var newY = x * Math.sin(angle) + y * Math.cos(angle);

    return { x: newX, y: newY };
}

function getRandomElement(arr)
{
    const randomIndex = Math.floor(Math.random() * arr.length);
    return randomIndex;
}

export { roundToPrecision, rotatePoint, getDeltaTime, updateDeltaTime, getRandomElement};
