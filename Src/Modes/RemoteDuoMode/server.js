import { GameArea } from '../../Stractures/gameArea.js'

import * as CostumMath from '../../Utilis/costumMath.js'
import * as Constants from '../../Constants/constants.js'
import * as Identity from '../../Identity/Identity.js'

var gameArea = null;

function setup()
{
    Identity.setIdentity(Constants.Identity.server);
    gameArea = new GameArea(Constants.GameModePlayerCount.OnlineDuoPlayer / 2);
}

function update()
{
    requestAnimationFrame(update);
    
    if (match_id == -1) return;
    
    CostumMath.updateDeltaTime();
    gameArea.movePitchesToDestination();
    gameArea.playGame();
    gameArea.setInfos();
}


setup();
update();
