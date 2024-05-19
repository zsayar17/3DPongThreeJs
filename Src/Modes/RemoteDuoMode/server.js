import * as THREE from '../../../Requirments/three.module.js';

import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Camera from '../../Core/camera.js'
import * as Light from '../../Core/light.js'

import * as Constants from '../../Constants/constants.js'

import { Pitch } from '../../Stractures/pitch.js'
import { Stage } from '../../Stractures/stage.js'
import { GameArea } from '../../Stractures/gameArea.js'

import { RegularController } from '../../Controllers/regularController.js'
import { AIController } from '../../Controllers/aiController.js'


var readyToPlayCount = 0;
var playerCount = 4;
var id = 0;

var gameArea = null;

function requestId()
{
    if (id < playerCount) return id++;

    return -1;
}

function requestStartGame()
{
    readyToPlayCount++;

    if (readyToPlayCount == playerCount) gameArea;
}

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    gameArea = new GameArea(2);
}

function update()
{
    requestAnimationFrame(update);


    gameArea.movePitchesToAim();
    gameArea.playGame();
    Scene.renderScene();
}

setup();
update();
























/*
var stage1 = null;
var stage2 = null;

var pitches = []

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    var controller1 = new AIController();
    var controller2 = new AIController();
    var controller3 = new RegularController();
    var controller4 = new AIController();

    var pitch1 = new Pitch(Constants.DefaultPitchWidth, Constants.DefaultPitchHeight, Constants.DefaultPitchDepth, Constants.DefaultPitchThickness, controller1, Math.PI / 2, new THREE.Vector3(0, 15, 25));
    var pitch2 = new Pitch(Constants.DefaultPitchWidth, Constants.DefaultPitchHeight, Constants.DefaultPitchDepth, Constants.DefaultPitchThickness, controller2, Math.PI / 2 * 3, new THREE.Vector3(0, 15, -25));
    var pitch3 = new Pitch(Constants.DefaultPitchWidth, Constants.DefaultPitchHeight, Constants.DefaultPitchDepth, Constants.DefaultPitchThickness, controller3, 0, new THREE.Vector3(-25, 15, 0));
    var pitch4 = new Pitch(Constants.DefaultPitchWidth, Constants.DefaultPitchHeight, Constants.DefaultPitchDepth, Constants.DefaultPitchThickness, controller4, Math.PI, new THREE.Vector3(25, 15, 0));

    pitches.push(pitch1);
    pitches.push(pitch2);
    pitches.push(pitch3);
    pitches.push(pitch4);

    stage1 = new Stage(new THREE.Vector3(0, 0, -40));
    stage2 = new Stage(new THREE.Vector3(0, 0, 0));

    Camera.setCurrentCameraByİndex(3);
}

var counter = 0;
var cameraIndex = 0;

function update()
{
    requestAnimationFrame(update);

    if (Event.isKeyPress(Constants.KEYW)) randomBindPitches();
    if (Event.isKeyPress(Constants.KEYS))
    {
        stage1.aimPitches(Constants.ToBegin);
        stage2.aimPitches(Constants.ToBegin);
    }

    if (++counter % 300 == 0)
    {
        Camera.setCurrentCameraByİndex(cameraIndex);
        console.log(cameraIndex);
        cameraIndex = (cameraIndex + 1) % Camera.totalCameraCount();
    }

    stage1.movePitchesToAim();
    stage2.movePitchesToAim();

    stage1.playGame();
    stage2.playGame();

    Scene.renderScene();
}

setup();
update();
*/
