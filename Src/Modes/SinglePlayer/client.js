import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js';

import * as CostumMath from '../../Utilis/costumMath.js'
import * as Camera from '../../Core/camera.js'


var gameServer = null;
//var names = [name1];
var names = ['ahmet'];
Identity.setSupportCostumMatch(true);


function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    Identity.setIdentity(Constants.Identity.singleOfflineClient);
    gameServer = new GameArea(Constants.GameModePlayerCount.SinglePlayer / 2);
    gameServer.setNames(names);
}

function update()
{
    if (!Identity.getDone()) requestAnimationFrame(update);

    CostumMath.updateDeltaTime();
    gameServer.movePitchesToDestination();
    gameServer.playGame();

    Camera.updateCameras();
    Scene.renderScene();
}

setup();
update();
