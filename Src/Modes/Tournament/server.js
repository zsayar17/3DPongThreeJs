import * as Identity from '../../Identity/Identity.js';
import * as Constants from '../../Constants/constants.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as CostumMath from '../../Utilis/costumMath.js'

var playerCount = 4;
var gameArea = null;

function setup()
{
    Identity.setIdentity(Constants.Identity.server);
    gameArea = new GameArea(playerCount / 2);
}

function update()
{
    requestAnimationFrame(update);
    CostumMath.updateDeltaTime();

    gameArea.movePitchesToDestination();
    gameArea.playGame();
}

setup();
update();
