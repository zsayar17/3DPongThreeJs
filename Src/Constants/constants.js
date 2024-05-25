const KEYUP = 1;
const KEYDOWN = 2;
const KEYLEFT = 4;
const KEYRIGHT = 8;
const KEYSPACE = 16;

const KEYW = 32;
const KEYS = 64;
const KEYA = 128;
const KEYD = 256;

const PitchRotateSpeed = Math.PI / 90;
const PitchMoveSpeed = 0.2;

const DefaultPitchWidth = 20;
const DefaultPitchHeight = 1;
const DefaultPitchDepth = 20;
const DefaultPitchThickness = 1;

const paddleWidtRateByPitch = 0.08;
const paddleHeightRateByPitch = 1;
const paddleDepthRateByPitch = 0.3;
const paddleThicknessRateByPitch = 1;

const paddleMoveSpeed = 0.15;

const paddleEmissiveIntensity = 0.7;

const ToStage = 1;
const ToBegin = 2;
const InStage = 3;
const InBegin = 4;

const lightDistanceFromStage = Math.max(DefaultPitchWidth, DefaultPitchDepth);
const lightBeginIntensity = 5;
const lightAngle = 1;
const lightPenumbra = 1;
const lightDecay = 0.4;

const ambientLightIntensity = 1.2;

const distanceBetweenStages = DefaultPitchDepth * 1.5;

const ballRadius = 0.7;
const ballSpeed = 0.2;
const maxBallSpeed = ballSpeed * 4;
const ballAccelerationRate = 0.05;
const ballMaxBounceAngle = Math.PI / 12 * 3;
const ballMaxBeginAngle = Math.PI / 12 * 4;

const maxScore = 3;

const moveUp = 1;
const moveDown = -1;

const LEFT = 0, RIGHT = 1;

const controllerTypes = {
    RegularController: 1,
    AIController: 2,
    RemoteController: 3
};

export {
    KEYUP, KEYDOWN, KEYLEFT, KEYRIGHT, KEYSPACE, KEYW, KEYS, KEYA, KEYD,
    PitchRotateSpeed, PitchMoveSpeed,
    DefaultPitchWidth, DefaultPitchHeight, DefaultPitchDepth, DefaultPitchThickness,
    paddleWidtRateByPitch, paddleHeightRateByPitch, paddleDepthRateByPitch, paddleThicknessRateByPitch,
    paddleMoveSpeed,
    paddleEmissiveIntensity,
    ToStage, ToBegin, InStage, InBegin,
    lightDistanceFromStage, lightBeginIntensity, lightAngle, lightPenumbra, lightDecay,
    ambientLightIntensity,
    distanceBetweenStages,
    ballRadius, ballSpeed, ballMaxBounceAngle, ballMaxBeginAngle, ballAccelerationRate, maxBallSpeed,
    maxScore,
    moveUp, moveDown,
    LEFT, RIGHT,
    controllerTypes
};
