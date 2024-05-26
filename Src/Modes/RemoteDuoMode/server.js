import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'

import * as CostumMath from '../../Utilis/costumMath.js'

var readyToPlayCount = 0;
var playerCount = 4;
var id = 0;

var gameArea = null;

function requestId()
{
    if (id < playerCount) return id++;

    return -1;
}

function requestStartGame()
{
    readyToPlayCount++;

    if (readyToPlayCount == playerCount) gameArea;
}

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    gameArea = new GameArea(2);
}

function update()
{
    requestAnimationFrame(update);
    CostumMath.updateDeltaTime();

    gameArea.movePitchesToAim();
    gameArea.playGame();
    Scene.renderScene();
}

setup();
update();
