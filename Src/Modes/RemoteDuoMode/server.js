import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as CostumMath from '../../Utilis/costumMath.js'
import * as Constant from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js'

var gameArea = null;

function setup()
{
    Identity.setIdentity(Constant.Identity.offlineClient);

    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    gameArea = new GameArea(Constant.GameModePlayerCount.OfflineMultiPlayer / 2);
}

function update()
{
    requestAnimationFrame(update);
    CostumMath.updateDeltaTime();

    gameArea.movePitchesToDestination();
    gameArea.playGame();
    Scene.renderScene();
}

setup();
update();
