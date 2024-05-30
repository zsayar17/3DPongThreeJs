import * as Constants from '../Constants/constants.js';

var Identity = Constants.Identity.none;

var pitchesInfo = [];
var paddlesInfo = [];
var ballsInfo = [];
var camerasInfo = [];

var match_id = -1;

var isDone = false;

var supportCostumMath = false;

// Common functions
function setIdentity(newIdentity)
{
    Identity = newIdentity;
}

function getIdentity()
{
    return Identity;
}

function setMatchId(newMatchId)
{
    match_id = newMatchId;
}

function getMatchId()
{
    return match_id;
}

function setDone(_isDone)
{
    isDone = _isDone;
}

function getDone()
{
    return isDone;
}

function setSupportCostumMatch(_supportCostumMath)
{
    supportCostumMath = _supportCostumMath;
}

function getSupportCostumMatch()
{
    return supportCostumMath;
}

// onlineClient functions
function fetchInfos()
{
    if (gameData == null || gameData.pitches == undefined) return;


    pitchesInfo = gameData.pitches;
    paddlesInfo = gameData.paddles;
    ballsInfo = gameData.balls;
    camerasInfo = gameData.cameras;
}

function fetchPitchInfo(pitchId)
{
    if (pitchId >= pitchesInfo.length) return null;

    return pitchesInfo[pitchId];
}

function fetchPaddleInfo(pitchId)
{
    if (pitchId >= paddlesInfo.length) return null;

    return paddlesInfo[pitchId];
}

function fetchBallInfo(stageId)
{
    if (stageId >= ballsInfo.length) return null;

    return ballsInfo[stageId];
}

function fetchCameraInfo(pitchId)
{
    var allowedCameras = [];

    for (var i = 0; i < camerasInfo.length; i++)
        if (camerasInfo[i].allowedIDs.includes(pitchId)) allowedCameras.push(camerasInfo[i].id);

    return allowedCameras;
}

// server functions

function clearInfos()
{
    pitchesInfo = [];
    paddlesInfo = [];
    ballsInfo = [];
    camerasInfo = [];
}

function fetchConnectRequest()
{

}

function setBallsInfo(newBallInfo)
{
    ballsInfo.push(newBallInfo);
}

function setPaddlesInfo(newPaddleInfo)
{
    paddlesInfo.push(newPaddleInfo);
}

function setPitchesInfo(newPitchInfo)
{
    pitchesInfo.push(newPitchInfo);
}

function setCameraInfos(newCameraInfo)
{
    camerasInfo.push(newCameraInfo);
}

function sendInfos()
{
    var strPitchesInfo = JSON.stringify(pitchesInfo);
    var strPaddlesInfo = JSON.stringify(paddlesInfo);
    var strBallsInfo = JSON.stringify(ballsInfo);
    var strCamerasInfo = JSON.stringify(camerasInfo);
    //askGameConsumer('game', {'match_id': this.getMatchId(), 'pitches': strPitchesInfo, 'paddles': strPaddlesInfo, 'balls': strBallsInfo, 'cameras': strCamerasInfo});
}

function saveScore(winnerPitch, loserPitch, winnerScore, loserScore)
{
    if (winnerPitch.controller.controllerType == Constants.controllerTypes.AIController && loserPitch.controller.controllerType == Constants.controllerTypes.AIController) return;

    console.log("Match Id: " + this.getMatchId() + " Winner Pitch: " + winnerPitch + " Winner Score: " + winnerScore + " Loser Pitch: " + loserPitch + " Loser Score: " + loserScore);
    //askServer('save_score', {'user_score': winnerScore, 'opponent_score': loserScore, 'opponent_username': loserPitch.name});
}


export {setSupportCostumMatch, getSupportCostumMatch, setDone, getDone, setMatchId, getMatchId, saveScore, setIdentity, getIdentity, fetchInfos, fetchPitchInfo, fetchPaddleInfo, fetchBallInfo, fetchCameraInfo, setBallsInfo, setPaddlesInfo, setPitchesInfo, setCameraInfos, sendInfos , clearInfos, fetchConnectRequest };
