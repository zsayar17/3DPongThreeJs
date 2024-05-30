import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js';

import * as CostumMath from '../../Utilis/costumMath.js'

var names = [name1, name2, name3, name4];

var gameServer = null;

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    Identity.setIdentity(Constants.Identity.multiOfflineClient);
    gameServer = new GameArea(Constants.GameModePlayerCount.OfflineMultiPlayer / 2);
    gameServer.setNames(names);
}

function update()
{
    if (!Identity.getDone()) requestAnimationFrame(update);

    CostumMath.updateDeltaTime();
    gameServer.movePitchesToDestination();
    gameServer.playGame();

    Scene.renderScene();
}

setup();
update();
