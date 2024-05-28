import { GameArea } from '../../Stractures/gameArea.js'

import * as CostumMath from '../../Utilis/costumMath.js'
import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js'

var gameArea = null;
var connectedId = -1;

function acceptConnect()
{
    var id = 0;

    if (connectedId == Constants.GameModePlayerCount.OnlineDuoPlayer) return;

    id = Identity.fetchConnectRequest();
    if (id != -1) gameArea.bindOnlineController(id);
}

function setup()
{
    Identity.setIdentity(Constants.Identity.server);
    gameArea = new GameArea(Constants.GameModePlayerCount.OnlineDuoPlayer / 2);
}

function update()
{
    requestAnimationFrame(update);

    CostumMath.updateDeltaTime();
    gameArea.movePitchesToDestination();
    gameArea.playGame();
    gameArea.setInfos();
}

setup();
update();
