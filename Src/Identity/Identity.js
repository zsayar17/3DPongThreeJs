import * as Constants from '../Constants/constants.js';
import * as THREE from '../../Requirments/three.module.js';

var Identity = Constants.Identity.none;

var pitchesInfo = [];
var paddlesInfo = [];
var ballsInfo = [];
var camerasInfo = [];

// Common functions
function setIdentity(newIdentity)
{
    Identity = newIdentity;
}

function getIdentity()
{
    return Identity;
}

// onlineClient functions
function fetchInfos()
{

}

function fetchPitchInfo(pitchId)
{
    return pitchesInfo[pitchId];
}

function fetchPaddleInfo(pitchId)
{
    return paddlesInfo[pitchId];
}

function fetchBallInfo(stageId)
{
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

}

function saveScore(winnerPitch, loserPitch, winnerScore, loserScore)
{
    console.log("Winner Pitch: " + winnerPitch + " Winner Score: " + winnerScore + " Loser Pitch: " + loserPitch + " Loser Score: " + loserScore);
}


export { saveScore, setIdentity, getIdentity, fetchInfos, fetchPitchInfo, fetchPaddleInfo, fetchBallInfo, fetchCameraInfo, setBallsInfo, setPaddlesInfo, setPitchesInfo, setCameraInfos, sendInfos , clearInfos};
