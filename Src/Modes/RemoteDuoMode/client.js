import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'
import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js'

var gameArea = null;
var id = -1;

function tryConnect()
{
    if (id != -1) return;

    id = Identity.fetchConnectId();
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

    Identity.sendConnectRequest();
}

function update()
{
    requestAnimationFrame(update);

    tryConnect();
    if (id == -1) return;

    Identity.fetchInfos();
    clientGameArea.playGameForOnlineClient();
    Scene.renderScene();
}

setup();
update();
