import * as Constants from '../Constants/constants.js';

var key_state;

function onİnputKeyDown(event)
{
    switch(event.keyCode)
    {
        case 38:
            key_state |= Constants.KEYUP;
            break;
        case 40:
            key_state |= Constants.KEYDOWN;
            break;
        case 37:
            key_state |= Constants.KEYLEFT;
            break;
        case 39:
            key_state |= Constants.KEYRIGHT;
            break;
        case 32:
            key_state |= Constants.KEYSPACE;
            break;
        case 87:
            key_state |= Constants.KEYW;
            break;
        case 83:
            key_state |= Constants.KEYS;
            break;
        case 65:
            key_state |= Constants.KEYA;
            break;
        case 68:
            key_state |= Constants.KEYD;
            break;
    }
}

function onInputKeyUp(event)
{
    switch(event.keyCode)
    {
        case 38:
            key_state &= ~Constants.KEYUP;
            break;
        case 40:
            key_state &= ~Constants.KEYDOWN;
            break;
        case 37:
            key_state &= ~Constants.KEYLEFT;
            break;
        case 39:
            key_state &= ~Constants.KEYRIGHT;
            break;
        case 32:
            key_state &= ~Constants.KEYSPACE;
            break;
        case 87:
            key_state &= ~Constants.KEYW;
            break;
        case 83:
            key_state &= ~Constants.KEYS;
            break;
        case 65:
            key_state &= ~Constants.KEYA;
            break;
        case 68:
            key_state &= ~Constants.KEYD;
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

export {addEventListeners, isKeyPress};
