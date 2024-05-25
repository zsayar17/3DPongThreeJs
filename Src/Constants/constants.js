const Keys = {
    Up: 1,
    Down: 2,
    Left: 4,
    Right: 8,
    Space: 16,
    W: 32,
    S: 64,
    A: 128,
    D: 256
};

const PitchEnvironment = {
    RotateSpeed: Math.PI / 30,
    MoveSpeed: 0.6,

    DefaultWidth: 20,
    DefaultHeight: 1,
    DefaultDepth: 20,
    DefaultThickness: 1,
};

const PaddleEnvironment = {
    WidthRateByPitch: 0.08,
    HeightRateByPitch: 1,
    DepthRateByPitch: 0.3,
    ThicknessRateByPitch: 1,

    MoveSpeed: 0.15,

    EmissiveIntensity: 0.7,
};

const PitchRotateSpeed = Math.PI / 45;
const PitchMoveSpeed = 0.45;

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
    Keys,
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
