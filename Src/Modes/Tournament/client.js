import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js';


var gameArea = null;

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    Identity.setIdentity(Constants.Identity.onlineClient);
    gameArea = new GameArea(Constants.GameModePlayerCount.OnlineMultiplayer / 2);
}

function update()
{
    requestAnimationFrame(update);

    Identity.fetchInfos();
    gameArea.playGameForOnlineClient();
    Scene.renderScene();
}

setup();
update();
