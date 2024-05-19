import { Stage } from './stage.js'
import { Pitch } from './pitch.js'

import * as THREE from '../../../Requirments/three.module.js';
import * as Constants from '../Constants/constants.js'

class GameArea
{
    constructor(stageCount)
    {
        this.stages = [];

        this.situaiton = Constants.InBegin;
        this.pitches = [];
        this.winnerPitches = [];
        this.eliminatedPitchesIndexes = [];

        this.createStages(stageCount);
        this.createPitches(stageCount * 2);
        this.bindStages();
    }

    createStages(stageCount)
    {
        var beginZ = 0;

        for (var i = 0; i < stageCount; i++)
        {
            this.stages.push(new Stage(new THREE.Vector3(0, 0, beginZ)));
            beginZ -= Constants.distanceBetweenStages;
        }
    }

    createPitches(pitchCount)
    {
        var distance = 25;

        this.pitches.push(new Pitch(0, new THREE.Vector3(-distance, -25, 0)));
        this.pitches.push(new Pitch(Math.PI, new THREE.Vector3(distance, -25, 0)));
        this.pitches.push(new Pitch(Math.PI / 2, new THREE.Vector3(0, -25, distance)));
        this.pitches.push(new Pitch(Math.PI / 2 * 3, new THREE.Vector3(0, -25, -distance)));

        for (var i = 0; i < this.pitches.length; i++)
            this.winnerPitches.push(this.pitches[i]);
    }

    bindControllerToPitches(controller, pitchIndex)
    {
        if (this.pitches[pitchIndex].controller != null)
            this.pitches[pitchIndex].bindController(controller);
    }

    setBindedPitches()
    {
        this.situaiton = Constants.InStage;
    }

    setDivorcedPitches()
    {
        var eliminatedPitchesIndexes = [];

        this.situaiton = Constants.InBegin;

        eliminatedPitchesIndexes = this.getEliminatedPitchesIndexes();
        for(var i = 0; i < this.stages.length; i++) this.stages[i].divorcePitches();

        this.popEliminatedPitches(eliminatedPitchesIndexes);
    }

    bindStages()
    {
        for (var i = 0; i < this.stages.length; i++)
        {
            this.stages[i].bindPitches(this.winnerPitches[i * 2], this.winnerPitches[i * 2 + 1]);
            this.stages[i].aimPitches(Constants.ToStage);
        }

        this.situaiton = Constants.ToStage;
    }


    divorceStages()
    {
        this.situaiton = Constants.ToBegin;
        this.eliminatedPitchesIndexes = this.getEliminatedPitchesIndexes();

        for (var i = 0; i < this.stages.length; i++)
        {
            this.stages[i].aimPitches(this.situaiton);
        }
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

        if (this.situaiton != Constants.ToStage && this.situaiton != Constants.ToBegin)
            return;

        for (var i = 0; i < this.stages.length; i++)
        {
            if (i != 0 && this.stages[i - 1].moving == true) continue;

            this.stages[i].movePitchesToAim();
            if (!this.stages[i].moving) totalReachedCount++;
        }

        if (totalReachedCount == this.stages.length)
        {
            if (this.situaiton == Constants.ToStage) this.setBindedPitches();
            else if (this.situaiton == Constants.ToBegin) this.setDivorcedPitches();
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
        if (this.gameWinner == null && this.situaiton == Constants.InBegin) this.bindStages();
        if (!this.readyToPlay()) return;

        for (var i = 0; i < this.stages.length; i++) this.stages[i].playGame();

        for (var i = 0; i < this.stages.length; i++)
        {
            if (this.stages[i].gameWinner == null) return;
        }

        this.divorceStages();
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
