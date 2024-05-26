import * as Scene from '../Core/scene.js'
import * as Renderer from '../Core/renderer.js'
import * as Event from '../Core/event.js'
import * as GUI from '../Core/gui.js'
import * as Camera from '../Core/camera.js'
import * as Light from '../Core/light.js'

import * as Constants from '../Constants/constants.js'

import { Pitch } from '../Stractures/pitch.js'
import { Stage } from '../Stractures/stage.js'

import { RegularController } from '../Controllers/regularController.js'
import { AIController } from '../Controllers/aiController.js'
import * as THREE from '../../Requirments/three.module.js';

var stage1 = null;
var stage2 = null;

var pitches = []

function randomBindPitches()
{
    var tempPitches = [];
    var randomNumber1 = 0;
    var randomNumber2 = 0;

    if (stage1.target == Constants.Destinations.ToStage || stage2.target == Constants.Destinations.ToStage) return;
    for (var i = 0; i < 4; i++) tempPitches.push(pitches[i]);

    randomNumber1 = Math.floor(Math.random() * tempPitches.length);
    tempPitches.splice(randomNumber1, 1);
    randomNumber2 = Math.floor(Math.random() * tempPitches.length);
    tempPitches.splice(randomNumber2, 1);

    stage1.bindPitches(pitches[0], pitches[3]);
    stage2.bindPitches(pitches[1], pitches[2]);

    stage1.aimPitches(Constants.Destinations.ToStage);
    stage2.aimPitches(Constants.Destinations.ToStage);
}

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    GUI.createGUI();
    Light.createAmbientLight();

    var controller1 = new AIController();
    var controller2 = new AIController();
    var controller3 = new RegularController();
    var controller4 = new AIController();

    var pitch1 = new Pitch(controller1, Math.PI / 2, new THREE.Vector3(0, 15, 25));
    var pitch2 = new Pitch(controller2, Math.PI / 2 * 3, new THREE.Vector3(0, 15, -25));
    var pitch3 = new Pitch(controller3, 0, new THREE.Vector3(-25, 15, 0));
    var pitch4 = new Pitch(controller4, Math.PI, new THREE.Vector3(25, 15, 0));

    pitch1.bindController(controller1);
    pitch2.bindController(controller2);
    pitch3.bindController(controller3);
    pitch4.bindController(controller4);

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
