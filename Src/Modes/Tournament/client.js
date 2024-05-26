import * as Scene from '../../Core/scene.js'
import * as Renderer from '../../Core/renderer.js'
import * as Event from '../../Core/event.js'
import * as Light from '../../Core/light.js'
import { GameArea } from '../../Stractures/gameArea.js'
import * as CostumMath from '../../Utilis/costumMath.js'

var id = 0;
var gameArea = null;
var playerCount = 4;

function setup()
{
    Scene.createScene();
    Renderer.createRenderer();
    Event.addEventListeners();
    Light.createAmbientLight();

    gameArea = new GameArea(playerCount / 2);
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
