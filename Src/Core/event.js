import * as Constants from '../Constants/constants.js';

var key_state;
var event_state;

function onİnputKeyDown(event)
{
    switch(event.keyCode)
    {
        case 38:
            key_state |= Constants.Keys.Up;
            break;
        case 40:
            key_state |= Constants.Keys.Down;
            break;
        case 37:
            key_state |= Constants.Keys.Left;
            break;
        case 39:
            key_state |= Constants.Keys.Right;
            break;
        case 32:
            key_state |= Constants.Keys.Space;
            break;
        case 87:
            key_state |= Constants.Keys.W;
            break;
        case 83:
            key_state |= Constants.Keys.S;
            break;
        case 65:
            key_state |= Constants.Keys.A;
            break;
        case 68:
            key_state |= Constants.Keys.D;
            break;
        case 74:
            key_state |= Constants.Keys.J;
            break;
        case 75:
            key_state |= Constants.Keys.K;
            break;
        case 49:
            key_state |= Constants.Keys.One;
            break;
        case 50:
            key_state |= Constants.Keys.Two;
            break;
    }

    if (event.keyCode == 32)
        event_state = true;
}

function onInputKeyUp(event)
{
    switch(event.keyCode)
    {
        case 38:
            key_state &= ~Constants.Keys.Up;
            break;
        case 40:
            key_state &= ~Constants.Keys.Down;
            break;
        case 37:
            key_state &= ~Constants.Keys.Left;
            break;
        case 39:
            key_state &= ~Constants.Keys.Right;
            break;
        case 32:
            key_state &= ~Constants.Keys.Space;
            break;
        case 87:
            key_state &= ~Constants.Keys.W;
            break;
        case 83:
            key_state &= ~Constants.Keys.S;
            break;
        case 65:
            key_state &= ~Constants.Keys.A;
            break;
        case 68:
            key_state &= ~Constants.Keys.D;
            break;
        case 74:
            key_state &= ~Constants.Keys.J;
            break;
        case 75:
            key_state &= ~Constants.Keys.K;
            break;
        case 49:
            key_state &= ~Constants.Keys.One;
            break;
        case 50:
            key_state &= ~Constants.Keys.Two;
            break;
    }
}


function addEventListeners()
{
    window.addEventListener('keydown', onİnputKeyDown);
    window.addEventListener('keyup', onInputKeyUp);
}

function isKeyPress(key)
{
    return key_state & key;
}

function catchSpaceEvent()
{
    if (event_state)
    {
        event_state = false;
        return true;
    }
    return false;
}

function freeSpaceEvent()
{
    event_state = false;
}

export { addEventListeners, isKeyPress, catchSpaceEvent, freeSpaceEvent };
