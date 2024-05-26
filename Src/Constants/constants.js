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
    RotateSpeed: Math.PI / 90,
    MoveSpeed: 0.029,

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

    MoveSpeed: 20,

    EmissiveIntensity: 0.7,
};

const LightEnvironment = {
    DistanceFromStage: Math.max(PitchEnvironment.DefaultWidth, PitchEnvironment.DefaultDepth),
    BeginIntensity: 5,
    Angle: 1,
    Penumbra: 1,
    Decay: 0.4,

    AmbientIntensity: 1.2,
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
    Radius: 0.7,
    BeginSpeed: 30,
    MaxSpeed: 80,
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
    offlineClient: 3
};

const maxScore = 3;

export {
    Keys,
    PitchEnvironment,
    PaddleEnvironment,
    LightEnvironment,
    StageEnvironment,
    Destinations,
    BallEnvironment,
    maxScore,
    MoveDirection,
    Side,
    Identity,
    controllerTypes
};
