import * as THREE from '../../Requirments/three.module.js';
import * as DAT from '../../Requirments/dat.gui.module.js';

var gui;

function createGUI()
{
    gui = new DAT.GUI();
}


export {createGUI, gui};
