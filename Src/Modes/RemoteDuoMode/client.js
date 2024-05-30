import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'
import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js'

var gameArea = null;
var prevId = -1;

function tryConnect()
{
    if (prevId != -1) return;
    
    console.log("pitch_id: " + id + " prev_id: " + prevId);
    prevId = id;
    if (id != -1) gameArea.bindOnlineController(id);
}

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    Identity.setIdentity(Constants.Identity.onlineClient);
    gameArea = new GameArea(Constants.GameModePlayerCount.OnlineDuoPlayer / 2);
}

function update()
{
    requestAnimationFrame(update);

    tryConnect();
    if (prevId == -1) return;

    Identity.fetchInfos();
    gameArea.playGameForOnlineClient();
    Scene.renderScene();
}

setup();
update();
