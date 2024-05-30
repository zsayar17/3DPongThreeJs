import * as Materials from '../Core/material.js';

const Keys = {
    Up: 1,
    Down: 2,
    Left: 4,
    Right: 8,
    Space: 16,
    W: 32,
    S: 64,
    A: 128,
    D: 256,
    J: 512,
    K: 1024,
    One: 2048,
    Two: 4096,
};

const PitchEnvironment = {
    RotateSpeed: Math.PI / 90,
    MoveSpeed: 8,

    DefaultWidth: 50,
    DefaultHeight: 6,
    DefaultDepth: 50,
    DefaultThickness: 4,
};

const ControllerCombinations = [
    [Keys.Left, Keys.Right],
    [Keys.A, Keys.D],
    [Keys.J, Keys.K],
    [Keys.One, Keys.Two],
];

const PaddleEnvironment = {
    WidthRateByPitch: 0.08,
    HeightRateByPitch: 1,
    DepthRateByPitch: 0.3,
    ThicknessRateByPitch: 0.7,

    MoveSpeed: 45,

    EmissiveIntensity: 0.7,
};

const LightEnvironment = {
    DistanceFromStage: Math.max(PitchEnvironment.DefaultWidth, PitchEnvironment.DefaultDepth),
    BeginIntensity: 5,
    Angle: 1,
    Penumbra: 1,
    Decay: 0.4,

    AmbientIntensity: 0.8,
};

const Destinations = {
    ToStage: 1,
    ToBegin: 2,
    InStage: 3,
    InBegin: 4,
};

const StageEnvironment = {
    DistanceBetweenStages: PitchEnvironment.DefaultDepth * 1.5,
};

const BallEnvironment = {
    Radius: 2.4,
    BeginSpeed: 60,
    MaxSpeed: 160,
    AccelerationRate: 0.05,
    MaxBounceAngle: Math.PI / 12 * 3,
    MaxBeginAngle: Math.PI / 12 * 4,
};

const MoveDirection = {
    Up: 1,
    Down: -1,
};

const Side = {
    Left: 0,
    Right: 1,
};

const controllerTypes = {
    RegularController: 1,
    AIController: 2,
    RemoteController: 3
};

const Identity = {
    none: 0,
    server: 1,
    onlineClient: 2,
    singleOfflineClient: 3,
    multiOfflineClient: 5,
};

const GameModePlayerCount = {
    OnlineMultiplayer: 4,
    SinglePlayer: 16,
    OfflineMultiPlayer: 4,
    OnlineDuoPlayer: 2,
};

const CameraEnvironment = {
    ShakeIntensity: 0.1,
    ShakeDuration: 0.5,
};

const CameraTypes = {
    Stage: 1,
    Pitch: 2,
    All: 3,
};

const GameModes =
{
    MultiPlayer: 1,
    OfflinePlayer: 2,
    OnlinePlayer: 3,
};

const FeatureAttributes = {
    Freezer: 0,
    Booster: 1,

    FreezeTime: 2,
    BoostTime: 10,
    BoostSpeedRate: 2,


    freezePossibility: 0.4,
    featurePossibility: 0.1
};

const Colors = [
    'red',
    'green',
    'blue',
    'cyan',
    'brown',
    'black',
    'purple',
    'orange',
    'pink',
    'yellow',
    'gray',
    'lightblue',
    'lightgreen',
    'lightyellow',
    'lightcyan',
    'lightpink',
    'lightbrown',
    'lightwhite',
    'lightblack',
    'lightgray',
    'darkblue',
    'darkred',
    'darkgreen',
    'darkyellow',
    'darkpurple',
    'darkorange',
    'darkcyan',
    'darkpink',
    'darkbrown',
    'darkwhite',
    'darkblack',
    'darkgray',
    'lightdarkblue',
    'lightdarkred',
];

const Textures = {
    Ball: Materials.createTexturedMaterial('Ball/ball'),
    Wall: Materials.createTexturedMaterial('Brick/brick', 5, 1),
    Plane: Materials.crateRegularMaterial(0xffffff),
    Snow: Materials.createTexturedMaterial('Snow/snow'),
};

const maxScore = 5;

export {
    Keys,
    PitchEnvironment,
    PaddleEnvironment,
    LightEnvironment,
    StageEnvironment,
    CameraEnvironment,
    CameraTypes,
    Destinations,
    BallEnvironment,
    maxScore,
    MoveDirection,
    Side,
    Identity,
    controllerTypes,
    GameModePlayerCount,
    GameModes,
    ControllerCombinations,
    Colors,
    Textures,
    FeatureAttributes,
};
