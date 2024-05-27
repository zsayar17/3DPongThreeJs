import * as Constants from '../Constants/constants.js';
import * as THREE from '../../Requirments/three.module.js';

var Identity = Constants.Identity.none;

var pitchesInfo = [];
var paddlesInfo = [];
var ballsInfo = [];

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

// server functions

function clearInfos()
{
    pitchesInfo = [];
    paddlesInfo = [];
    ballsInfo = [];
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

function sendInfos()
{

}


export { setIdentity, getIdentity, fetchInfos, fetchPitchInfo, fetchPaddleInfo, fetchBallInfo, setBallsInfo, setPaddlesInfo, setPitchesInfo, sendInfos , clearInfos};
