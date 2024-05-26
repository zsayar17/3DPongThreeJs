import { Stage } from './stage.js'
import { Pitch } from './pitch.js'
import * as Event from '../Core/event.js'

import * as THREE from '../../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js'
import { AIController } from '../Controllers/aiController.js';
import { RegularController } from '../Controllers/regularController.js';
import * as Camera from '../Core/camera.js';

import * as Utilis from '../Utilis/costumMath.js';

class GameArea
{
    constructor(stageCount)
    {
        this.stages = [];

        this.situaiton = Constants.Destinations.InBegin;
        this.pitches = [];
        this.winnerPitches = [];
        this.allowedCameras = [];
        this.currentCamera = 0;

        this.createStages(stageCount);
        this.createPitches(stageCount * 2);
        this.bindStages();
        this.createCameras();
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
        var controllers = [];
        var angle = 0;
        var positions = {x: 0, y: 0};

        var distance = Math.max(Constants.PitchEnvironment.DefaultDepth, Constants.PitchEnvironment.DefaultWidth) + Constants.PitchEnvironment.DefaultThickness * 5;
        distance = pitchCount > 2 ? distance / Math.sin(Math.PI * 2 / pitchCount) : distance;

        for (var i = 0; i < pitchCount; i++)
        {
            angle = -i * Math.PI * 2 / pitchCount;
            positions = Utilis.rotatePoint(-distance, 0, angle);
            this.pitches.push(new Pitch(-angle, new THREE.Vector3(positions.x, 0, positions.y)));
        }

        controllers.push(new RegularController(this.pitches[0]));
        for (var i = 1; i < this.pitches.length; i++) controllers.push(new AIController(this.pitches[i]));

        for (var i = 0; i < this.pitches.length; i++) this.pitches[i].bindController(controllers[i]);
        for (var i = 0; i < this.pitches.length; i++) this.winnerPitches.push(this.pitches[i]);
    }

    createCameras(stageCount)
    {
        var distance = (Math.abs(this.stages[this.stages.length - 1].position.z) + Constants.PitchEnvironment.DefaultWidth + Constants.PitchEnvironment.DefaultDepth)
                       / Math.cos(Math.PI / 3);
        this.allowedCameras.push(Camera.createPerspectiveCamera(new THREE.Vector3(0, distance , 0), new THREE.Vector3(0, 0, 0)));

        this.currentCamera = 0;
        Camera.setCurrentCameraByİndex(this.allowedCameras[this.currentCamera]);
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

        this.allowedCameras.splice(1, this.allowedCameras.length - 1);
        for (var i = 0; i < this.winnerPitches.length; i++)
        {
            if (!this.isAnyRegularController() && i % 2 == 0)
            {
                this.allowedCameras.push(this.winnerPitches[i].controller.allowedCameras[1]);
            }

            if (this.winnerPitches[i].controller.controllerType != Constants.controllerTypes.RegularController) continue;

            for (var j = 0; j < this.winnerPitches[i].controller.allowedCameras.length; j++)
                this.allowedCameras.push(this.winnerPitches[i].controller.allowedCameras[j]);
        }

        if (this.allowedCameras.length > 1) Camera.setCurrentCameraByİndex(this.allowedCameras[1]);
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
        for (var i = 0; i < this.stages.length; i++)
        {
            this.stages[i].bindPitches(this.winnerPitches[i * 2], this.winnerPitches[i * 2 + 1]);
            this.stages[i].aimPitches(Constants.Destinations.ToStage);
        }

        this.situaiton = Constants.Destinations.ToStage;
    }


    divorceStages()
    {
        this.situaiton = Constants.Destinations.ToBegin;

        for (var i = 0; i < this.stages.length; i++)
        {
            this.stages[i].aimPitches(this.situaiton);
        }

        this.allowedCameras.splice(1, this.allowedCameras.length - 1);
        this.currentCamera = 0;
        Camera.setCurrentCameraByİndex(this.allowedCameras[this.currentCamera]);
        if (this.winnerPitches.length == 1) this.gameWinner = this.winnerPitches[0];
    }

    getEliminatedPitchesIndexes()
    {
        var eliminatedPitches = [];

        for (var i = 0; i < this.winnerPitches.length; i++)
        {
            if (this.winnerPitches[i].stage.gameWinner != this.winnerPitches[i])
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

    movePitchesToAim()
    {
        var totalReachedCount = 0;

        if ((this.situaiton != Constants.Destinations.ToStage && this.situaiton != Constants.Destinations.ToBegin) || this.gameWinner != null)
            return;

        for (var i = 0; i < this.stages.length; i++)
        {
            if (i != 0 && this.stages[i - 1].moving == true) continue;

            this.stages[i].movePitchesToAim();
            if (!this.stages[i].moving) totalReachedCount++;
        }

        if (totalReachedCount == this.stages.length)
        {
            if (this.situaiton == Constants.Destinations.ToStage) this.setBindedPitches();
            else if (this.situaiton == Constants.Destinations.ToBegin) this.setDivorcedPitches();
        }
    }

    readyToPlay()
    {
        for (var i = 0; i < this.stages.length; i++)
            if (!this.stages[i].readyToPlay) return false;
        return true;
    }

    playGame()
    {
        if (this.gameWinner == null && this.situaiton == Constants.Destinations.InBegin) this.bindStages();
        if (!this.readyToPlay()) return;

        for (var i = 0; i < this.stages.length; i++) this.stages[i].playGame();

        if (Event.catchMouseClick() && this.situaiton == Constants.Destinations.InStage)
            Camera.setCurrentCameraByİndex(this.allowedCameras[++this.currentCamera % this.allowedCameras.length]);

        for (var i = 0; i < this.stages.length; i++)
            if (this.stages[i].gameWinner == null) return;

        if (this.situaiton == Constants.Destinations.InStage) this.divorceStages();
    }

    ballPostions()
    {
        var ballPositions = [];

        for (var i = 0; i < this.stages.length; i++)
            ballPositions.push(this.stages[i].ball.position);

        return ballPositions;
    }

    paddlePositions()
    {
        var paddlePositions = [];

        for (var i = 0; i < this.pitches.length; i++)
            paddlePositions.push(this.pitches[i].position);

        return paddlePositions;
    }
}

export { GameArea };
