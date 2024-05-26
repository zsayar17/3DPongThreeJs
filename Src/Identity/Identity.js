import * as Constants from '../Constants/constants.js';

var Identity = Constants.Identity.none;


// Common functions
function setIdentity(newIdentity)
{
    Identity = newIdentity;
}

function getIdentity()
{
    return Identity;
}

// OfflineClient functions
function sendWinner()
{
    if (Identity != Constants.Identity.offlineClient) return;

    // send winner to the server from the offline client
}

// Server functions
function sendBallPositions()
{
    if (Identity != Constants.Identity.server) return;

    // send ball positions to the clients
}

function sendPaddlePositions()
{
    if (Identity != Constants.Identity.server) return;

    // send paddle positions to the clients
}

function sendStartToPlay()
{
    if (Identity != Constants.Identity.server) return;

    // send start to play to the clients
}

// OnlineClient functions
function requestToStartGame()
{
    if (Identity != Constants.Identity.onlineClient) return;

    // request to start game
}

function requestID()
{
    if (Identity != Constants.Identity.onlineClient) return;

    // request id from the server
}

function sendReadyToPlay()
{
    if (Identity != Constants.Identity.onlineClient) return;

    // send ready to play to the server
}

function sendPaddlePosition()
{
    if (Identity != Constants.Identity.onlineClient) return;

    // send paddle position to the server
}

export { setIdentity, getIdentity };
