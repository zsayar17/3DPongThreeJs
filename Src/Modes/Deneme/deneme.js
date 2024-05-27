import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js';


import * as CostumMath from '../../Utilis/costumMath.js'


var serverGameArea = null;
var clientGameArea = null;

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    Identity.setIdentity(Constants.Identity.server);
    serverGameArea = new GameArea(Constants.GameModePlayerCount.OfflineMultiPlayer / 2);

    Identity.setIdentity(Constants.Identity.onlineClient);
    clientGameArea = new GameArea(Constants.GameModePlayerCount.OfflineMultiPlayer / 2);
}

function update()
{
    requestAnimationFrame(update);

    Identity.setIdentity(Constants.Identity.server);
    CostumMath.updateDeltaTime();
    serverGameArea.movePitchesToDestination();
    serverGameArea.playGame();
    serverGameArea.setInfos();

    Identity.setIdentity(Constants.Identity.onlineClient);
    Identity.fetchInfos();
    clientGameArea.playGameForOnlineClient();
    Scene.renderScene();
}

setup();
update();
