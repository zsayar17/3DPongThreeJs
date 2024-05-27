import { Stage } from './stage.js'
import { Pitch } from './pitch.js'

import * as THREE from '../../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js'
import { AIController } from '../Controllers/aiController.js';
import { RegularController } from '../Controllers/regularController.js';
import { RemoteController } from '../Controllers/remoteController.js';
import * as Camera from '../Core/camera.js';

import * as Utilis from '../Utilis/costumMath.js';
import * as Identity from '../Identity/Identity.js'

class GameArea
{
    constructor(stageCount)
    {
        this.stages = [];

        this.situaiton = Constants.Destinations.InBegin;
        this.pitches = [];
        this.winnerPitches = [];

        this.wideCamera = null;
        this.currentCamera = 0;

        this.gameWinner = null;

        this.createStages(stageCount);
        this.createCameras();

        this.createPitches(stageCount * 2);
        this.createControllers();
        this.bindStages();

    }

    createStages(stageCount)
    {
        var beginZ = Constants.StageEnvironment.DistanceBetweenStages * (stageCount - 1) / 2;

        for (var i = 0; i < stageCount; i++)
        {
            this.stages.push(new Stage(new THREE.Vector3(0, 20, beginZ)));
            beginZ -= Constants.StageEnvironment.DistanceBetweenStages;
        }
    }

    createPitches(pitchCount)
    {
        var angle = 0;
        var positions = {x: 0, y: 0};

        var distance = Math.max(Constants.PitchEnvironment.DefaultDepth, Constants.PitchEnvironment.DefaultWidth) + Constants.PitchEnvironment.DefaultThickness * 5;
        distance = pitchCount > 2 ? distance / Math.sin(Math.PI * 2 / pitchCount) : distance;

        for (var i = 0; i < pitchCount; i++)
        {
            angle = -i * Math.PI * 2 / pitchCount;
            positions = Utilis.rotatePoint(-distance, 0, angle);
            this.pitches.push(new Pitch(-angle, new THREE.Vector3(positions.x, 0, positions.y)));
            this.pitches[i].setAllowedCameras(this, true);
        }

        for (var i = 0; i < this.pitches.length; i++) this.winnerPitches.push(this.pitches[i]);
    }

    createControllers()
    {
        var controllers = [];

        if (Identity.getIdentity() == Constants.Identity.singleOfflineClient)
        {
            controllers.push(new RegularController(Constants.ControllerCombinations[0][0], Constants.ControllerCombinations[0][1]));
            for (var i = 1; i < this.pitches.length; i++) controllers.push(new AIController());
        }
        else if (Identity.getIdentity() == Constants.Identity.server)
        {
            for (var i = 0; i < this.pitches.length; i++) controllers.push(new RemoteController());
        }
        else if (Identity.getIdentity() == Constants.Identity.multiOfflineClient)
        {
            for (var i = 0; i < this.pitches.length; i++) controllers.push(new RegularController(Constants.ControllerCombinations[i][0], Constants.ControllerCombinations[i][1]));
        }

        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].bindController(controllers[i]);
    }

    createCameras()
    {
        var distance = (Math.abs(this.stages[this.stages.length - 1].position.z) + Constants.PitchEnvironment.DefaultWidth + Constants.PitchEnvironment.DefaultDepth)
                       / Math.cos(Math.PI / 3);
        this.wideCamera = Camera.createPerspectiveCamera(Constants.CameraTypes.All, new THREE.Vector3(0, distance , 0), new THREE.Vector3(0, 0, 0));

        this.currentCamera = 0;
        Camera.setCurrentCameraByİndex(this.wideCamera);
    }

    bindControllerToPitches(controller, pitchIndex)
    {
        if (this.pitches[pitchIndex].controller != null) this.pitches[pitchIndex].bindController(controller);
    }

    isAnyRegularController()
    {
        return this.winnerPitches.some(pitch => pitch.controller.controllerType == Constants.controllerTypes.RegularController);
    }

    setBindedPitches()
    {
        this.situaiton = Constants.Destinations.InStage;

        Camera.clearAllowedPitchesFromAllCameras();
        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].setAllowedCameras(this);
    }

    setDivorcedPitches()
    {
        var eliminatedPitchesIndexes = [];

        this.situaiton = Constants.Destinations.InBegin;

        eliminatedPitchesIndexes = this.getEliminatedPitchesIndexes();
        for(var i = 0; i < this.stages.length; i++) this.stages[i].divorcePitches();

        this.popEliminatedPitches(eliminatedPitchesIndexes);
    }

    bindStages()
    {
        var tempPitches = this.winnerPitches.slice();
        var leftPitchIndex, rightPitchIndex;
        var leftPitch, rightPitch;

        for (var i = 0; i < this.stages.length; i++)
        {
            leftPitchIndex = Utilis.getRandomElement(tempPitches);
            leftPitch = tempPitches[leftPitchIndex];
            tempPitches.splice(leftPitchIndex, 1);

            rightPitchIndex = Utilis.getRandomElement(tempPitches);
            rightPitch = tempPitches[rightPitchIndex];
            tempPitches.splice(rightPitchIndex, 1);

            this.stages[i].bindPitches(leftPitch, rightPitch);
            this.stages[i].aimPitches(Constants.Destinations.ToStage);
        }

        this.situaiton = Constants.Destinations.ToStage;
    }


    divorceStages()
    {
        this.situaiton = Constants.Destinations.ToBegin;

        for (var i = 0; i < this.stages.length; i++) this.stages[i].aimPitches(this.situaiton);


        if (this.winnerPitches.length == 1)
        {
            this.gameWinner = this.winnerPitches[0];
            return;
        }

        Camera.clearAllowedPitchesFromAllCameras();
        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].setAllowedCameras(this, true);
    }

    getEliminatedPitchesIndexes()
    {
        var eliminatedPitches = [];

        for (var i = 0; i < this.winnerPitches.length; i++)
        {
            if (this.winnerPitches[i].stage.stageWinner != this.winnerPitches[i])
                eliminatedPitches.push(i);
        }

        eliminatedPitches.sort(function (a, b) { return b - a; });
        return eliminatedPitches;
    }

    popEliminatedPitches(eliminatedPitchesIndexes)
    {
        var sliceStageCount = 0;

        for (var i = 0; i < eliminatedPitchesIndexes.length; i++)
        {
            this.winnerPitches[eliminatedPitchesIndexes[i]].destroy();
            this.winnerPitches.splice(eliminatedPitchesIndexes[i], 1);
        }

        sliceStageCount = (this.stages.length / 2) < 1 ? 0 : this.stages.length / 2;
        this.stages = this.stages.slice(0, sliceStageCount);
    }

    movePitchesToDestination()
    {
        var totalReachedCount = 0;

        if ((this.situaiton != Constants.Destinations.ToStage && this.situaiton != Constants.Destinations.ToBegin) || this.gameWinner != null)
            return;

        for (var i = 0; i < this.stages.length; i++)
        {
            if (i != 0 && this.stages[i - 1].moving == true) continue;

            this.stages[i].movePitchesToDestination();
            if (!this.stages[i].moving) totalReachedCount++;
        }

        if (totalReachedCount == this.stages.length)
        {
            if (this.situaiton == Constants.Destinations.ToStage) this.setBindedPitches();
            else if (this.situaiton == Constants.Destinations.ToBegin) this.setDivorcedPitches();
        }
    }

    getAvailableCameras()
    {
        var availableCameras = [];

        for (var i = 0; i < this.stages.length; i++)
        {
            for (var j = 0; j < this.stages[i].cameras.length; j++)
                availableCameras.push(this.stages[i].cameras[j]);
        }

        availableCameras.push(this.wideCamera);
        return availableCameras;
    }

    readyToPlay()
    {
        for (var i = 0; i < this.stages.length; i++)
            if (!this.stages[i].readyToPlay) return false;
        return this.gameWinner == null;
    }

    playGame()
    {
        if (this.gameWinner == null && this.situaiton == Constants.Destinations.InBegin) this.bindStages();

        if (!this.readyToPlay()) return;

        for (var i = 0; i < this.stages.length; i++) this.stages[i].playGame();

        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].changeCamera();

        for (var i = 0; i < this.stages.length; i++)
            if (this.stages[i].stageWinner == null) return;

        if (this.situaiton == Constants.Destinations.InStage) this.divorceStages();
    }

    playGameForOnlineClient()
    {
        if (Identity.getIdentity() != Constants.Identity.onlineClient) return;

        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].setByServer();
        for (var i = 0; i < this.stages.length; i++) this.stages[i].setByServer();
    }

    setInfos()
    {
        if (Identity.getIdentity() != Constants.Identity.server) return;

        Identity.clearInfos();

        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].setInfos();
        for (var i = 0; i < this.stages.length; i++) this.stages[i].setInfos();
        Camera.setCameraInfos();

        Identity.sendInfos();
    }
}

export { GameArea };
