
import * as THREE from '../../Requirments/three.module.js';
import * as DAT from '../../Requirments/dat.gui.module.js';

var scene, renderer;
var camera;
var plane, box;
var ambientLight, spotLight;
var gui;

var ball_begin_max_angle = Math.PI / 6 * 5;

const SPEED = 0.02;

class Ball
{
    constructor(radius, position = {x: 0, y: 0, z: 0})
    {
        this.radius = radius;
        this.begin_position = position;

        this.mesh = createSphere(radius, new THREE.MeshStandardMaterial({color: 0xffffff}));

        this.mesh.position.set(position.x, position.y, position.z);

        this.dx = 0;
        this.dz = 0;

        this.lastTouch = null;
    }

    setRandomDirection()
    {
        this.mesh.position.set(this.begin_position.x, this.begin_position.y, this.begin_position.z);

        var angle = Math.random() * ball_begin_max_angle + (Math.PI - ball_begin_max_angle) / 2;

        this.dx = Math.cos(angle) * SPEED * 3;
        this.dz = Math.sin(angle) * SPEED * 3;
        this.lastTouch = null;
    }

    move()
    {
        this.mesh.position.x += this.dx;
        this.mesh.position.z += this.dz;
    }

    changeXDirection()
    {
        this.dx *= -1;
    }

    collideWithPlayer(player)
    {
        var intersectionDiff;
        var intersectionNormal;
        var player_world_position;
        var angle;

        if (this.lastTouch == player) return;

        player_world_position = new THREE.Vector3();
        player.mesh.getWorldPosition(player_world_position);

        intersectionDiff = player_world_position.x - this.mesh.position.x;
        intersectionNormal = intersectionDiff / (player.width / 2);
        angle = Math.PI / 12 * 3 * -intersectionNormal;

        this.dz = Math.cos(angle) * SPEED * 3 * -Math.sign(this.dz);
        this.dx = Math.sin(angle) * SPEED * 3;
        this.lastTouch = player;
    }
}

class Player
{
    constructor(width, height, depth, pitch, beginPosition = {x: 0, y: 0, z: 0})
    {
        this.width = width;
        this.height = height;
        this.depth = depth;

        this.mesh = createBox(width, height, depth, new THREE.MeshStandardMaterial({color: 0xffffff}));
        this.mesh.position.set(beginPosition.x, beginPosition.y, beginPosition.z);
        this.position = this.mesh.position;
        this.pitch = pitch;
    }

    getWorldPosition()
    {
        return this.mesh.getWorldPosition(this.position);
    }

    aiMove(ball, otherPlayer)
    {
        var otherPlayerPosition;
        var otherPlayerNormal;
        var targetPosition;
        var oldPosition

        otherPlayerPosition = otherPlayer.position.x;
        otherPlayerNormal = otherPlayerPosition / (otherPlayer.pitch.width / 2);

        if (Math.abs(otherPlayerNormal) > 1) otherPlayerNormal = Math.sign(otherPlayerNormal);

        targetPosition = new THREE.Vector3();
        targetPosition.x = ball.mesh.position.x - (this.width / 2) * otherPlayerNormal;

        oldPosition = this.mesh.position.clone();
        if (targetPosition.x > this.mesh.position.x) this.mesh.position.x += SPEED * 2;
        else if (targetPosition.x < this.mesh.position.x) this.mesh.position.x -= SPEED * 2;

        if (this.pitch.checkCollsionWithWalls(this.mesh))
            this.mesh.position.copy(oldPosition);
    }
}

class Pitch
{
    constructor(width, height, depth, position = {x: 0, y: 0, z: 0}, rotateY = 0)
    {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.position = position;
        this.rotateY = rotateY;

        this.walls = [];
        this.ground = null;
        this.goal = null;

        this.player = null;

        this.wallMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff});;
        this.groundMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
        this.goalMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff});;

        this.group = null;

        this._isMoved = false;
        this._isrotated = false;
        this.placed = false;

        this._createWalls();
        this._createGround();
        this._createGoal();
        this._createPlayer();
        this._createGroup();
    }

    _createWalls()
    {
        this.walls.push(createBox(1, this.height, this.depth, this.wallMaterial));
        this.walls.push(createBox(1, this.height, this.depth, this.wallMaterial));

        this.walls[0].position.set(this.width / 2, this.height / 2, 0);
        this.walls[1].position.set(-this.width / 2, this.height / 2, 0);
    }

    _createGround()
    {
        this.ground = createPlane(this.width, this.depth, this.groundMaterial);
    }

    _createGoal()
    {
        this.goal = createBox(this.width + 1, this.height, 1, this.goalMaterial);
        this.goal.position.set(0, this.height / 2, -this.depth / 2);
    }

    _createPlayer()
    {
        var player_w, player_h, player_d;
        var x, y, z;

        player_w = 3;
        player_h = 1;
        player_d = 1;

        var depth = 1

        x = 0
        y = player_h / 2;

        z = this.goal.position.z + depth / 2 + player_d;

        this.player = new Player(player_w, player_h, player_d, this, {x: x, y: y, z: z});
    }

    _createGroup()
    {
        this.group = new THREE.Group();

        for (var i = 0; i < this.walls.length; i++) this.group.add(this.walls[i]);
        this.group.add(this.goal);
        this.group.add(this.ground);
        this.group.add(this.player.mesh);

        this.group.position.set(this.position.x, this.position.y, this.position.z);
        this.group.rotation.y = this.rotateY;

        scene.add(this.group);
    }

    setUnplaced()
    {
        this.placed = false;
        this._isrotated = false;
        this._isMoved = false;
    }

    moveToTarget(moveTarget, rotateTargetY, moveSpeed, rotateSpeed)
    {
        if (this.placed == true) return;

        this._moveTowardsTarget(moveTarget, moveSpeed);
        this._rotateTowardsTarget(rotateTargetY, rotateSpeed);

        if (this._isMoved && this._isrotated)
        {
            this.placed = true;
            this._isMoved = false;
            this._isrotated = false;
        }
    }

    _moveTowardsTarget(target, speed)
    {
        var direction, newPosition;

        if (this._isMoved == true) return;

        direction = new THREE.Vector3().copy(target).sub(this.group.position).normalize();
        newPosition = this.group.position.clone().add(direction.multiplyScalar(speed));
        this.group.position.copy(newPosition);

        if (newPosition.distanceTo(target) < 0.01)
        {
            this._isMoved = true;
            this.group.position.copy(target);
        }
    }

    _rotateTowardsTarget(target_rotate_y, speed)
    {
        var newRotation;

        if (this._isrotated == true) return;

        newRotation = this.group.rotation.y + speed;
        this.group.rotation.y = newRotation % (Math.PI * 2);

        if (newRotation >= target_rotate_y -  2 * speed && newRotation <= target_rotate_y + 2 * speed)
        {
            this._isrotated = true;
            this.group.rotation.y = target_rotate_y;
        }
    }

    moveCharacer(move_up_key, move_down_key)
    {
        var oldPosition;

        if (this.placed == false) return;

        oldPosition = this.player.mesh.position.clone();
        if (key_state & move_up_key) this.player.mesh.position.add(new THREE.Vector3(SPEED * 2, 0, 0));
        else if (key_state & move_down_key) this.player.mesh.position.add(new THREE.Vector3(-SPEED * 2, 0, 0));
        else return;

        if (this.checkCollsionWithWalls(this.player.mesh))
            this.player.mesh.position.copy(oldPosition);
    }

    moveCharacerAI(ball, otherPlayer)
    {
        if (this.placed == false) return;

        this.player.aiMove(ball, otherPlayer);
    }

    checkCollsionWithWalls(object)
    {
        if (checkCollsion(object, this.walls[0]) || checkCollsion(object, this.walls[1]))
            return true;
        return false;
    }
}

class Stage
{
    constructor(position)
    {
        this.pitch_left = null;
        this.pitch_right = null;

        this.ball = new Ball(0.5, {x: position.x, y: position.y + 0.5, z: position.z});
        scene.add(this.ball.mesh);
        this.ball.mesh.visible = false;

        this.position = position;
        this.pitch_left_position = {x: 0, y: 0, z: 0};
        this.pitch_right_position = {x: 0, y: 0, z: 0};

        this.connected = false;
    }

    setPitches(pitch_left, pitch_right)
    {
        this.pitch_left = pitch_left;
        this.pitch_right = pitch_right;

        this.pitch_left_position = {x: this.position.x, y: this.position.y, z: this.position.z + pitch_left.depth / 2};
        this.pitch_right_position = {x: this.position.x, y: this.position.y, z: this.position.z - pitch_right.depth / 2};

        this.pitch_left.placed = false;
        this.pitch_right.placed = false;
    }

    clearPitches()
    {
        this.pitch_left = null;
        this.pitch_right = null;
    }

    connectPitches()
    {
        if (this.connected == true) return;

        this.pitch_left.moveToTarget(this.pitch_left_position, Math.PI, SPEED, Math.PI / 180);
        this.pitch_right.moveToTarget(this.pitch_right_position, 0, SPEED, Math.PI / 180);


        if (this.pitch_left.placed && this.pitch_right.placed)
        {
            this.pitch_left.placed = true;
            this.pitch_right.placed = true;
            this.connected = true;

            this.ball.mesh.visible = true;
        }
    }

    moveCharacer()
    {
        if (this.connected == false) return;

        this.pitch_left.moveCharacer(KEYW, KEYS);
        this.pitch_right.moveCharacerAI(this.ball, this.pitch_left.player); // its reversed because of the rotation
    }

    moveBall()
    {
        if (this.connected == false) return;

        if (key_state & KEYSPACE) this.ball.setRandomDirection();

        if (this.pitch_left.checkCollsionWithWalls(this.ball.mesh) || this.pitch_right.checkCollsionWithWalls(this.ball.mesh))
            this.ball.changeXDirection();
        else if (checkCollsion(this.ball.mesh, this.pitch_left.goal) || checkCollsion(this.ball.mesh, this.pitch_right.goal))
            this.ball.setRandomDirection();
        else if (checkCollsion(this.ball.mesh, this.pitch_left.player.mesh))
            this.ball.collideWithPlayer(this.pitch_left.player);
        else if (checkCollsion(this.ball.mesh, this.pitch_right.player.mesh))
            this.ball.collideWithPlayer(this.pitch_right.player);

        this.ball.move();
    }
};

function checkCollsion(object1, object2)
{
    var box1, box2;

    box1 = new THREE.Box3().setFromObject(object1);
    box2 = new THREE.Box3().setFromObject(object2);

    return box1.intersectsBox(box2);
}

function createCamera()
{
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.set(10, 10, 0);
    camera.lookAt(plane.position);

    gui.addFolder("Camera" + camera.id);
    gui.add(camera.position, 'x', -10, 10).step(0.01);
    gui.add(camera.position, 'y', -10, 10).step(0.01);
    gui.add(camera.position, 'z', -10, 10).step(0.01);


    scene.add(camera);
}

function createAmbientLight()
{
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
}

function createSpotLight()
{
    spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 5, 0);
    spotLight.lookAt(plane.position);

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.decay = 0;

    gui.addFolder("Spot Light" + spotLight.id);
    gui.add(spotLight.position, 'x', -10, 10).step(0.1);
    gui.add(spotLight.position, 'y', -10, 10).step(0.1);
    gui.add(spotLight.position, 'z', -10, 10).step(0.1);

    gui.add(spotLight, 'intensity', 0, 1).step(0.1);
    gui.add(spotLight, 'distance', 0, 100).step(0.1);
    gui.add(spotLight, 'angle', 0, Math.PI / 2).step(0.1);
    gui.add(spotLight, 'penumbra', 0, 1).step(0.1);
    gui.add(spotLight, 'decay', 0, 1).step(0.1);

    scene.add(spotLight);
}

function createSphere(radius, material)
{
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(0, 0, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    return sphere;

}

function createBox(w, h, d, material)
{
    var geometry = new THREE.BoxGeometry(w, h, d);

    box = new THREE.Mesh(geometry, material);

    box.position.set(0, 0, 0);
    box.castShadow = true;
    box.receiveShadow = true;

    return box;
}

function createPlane(w, h, material)
{
    var geometry = new THREE.PlaneGeometry(w, h, 1, 1);
    plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = -Math.PI / 2;
    plane.position.set(0, 0, 0);
    plane.castShadow = true;
    plane.receiveShadow = true;

    return plane;
}

var newStage;

function createStage()
{
    var pitch_right = new Pitch(15, 1, 10, {x: 5, y: 5, z: -5});
    var pitch_left = new Pitch(15, 1, 10, {x: -5, y: -5, z: 5}, Math.PI);

    newStage = new Stage( {x: 0, y: 0, z: 0} );
    newStage.setPitches(pitch_left, pitch_right);

    createAmbientLight();
    createSpotLight();
    createCamera();
}

function createScene()
{
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
}

function createRenderer()
{
    renderer = new THREE.WebGLRenderer( { physicallyCorrectLights:true, antialias: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function createGUI()
{
    gui = new DAT.GUI();
}

var KEYUP = 1;
var KEYDOWN = 2;
var KEYLEFT = 4;
var KEYRIGHT = 8;
var KEYSPACE = 16;

var KEYW = 32;
var KEYS = 64;
var KEYA = 128;
var KEYD = 256;

var key_state = 0;

function onİnputKeyDown(event)
{
    switch(event.keyCode)
    {
        case 38:
            key_state |= KEYUP;
            break;
        case 40:
            key_state |= KEYDOWN;
            break;
        case 37:
            key_state |= KEYLEFT;
            break;
        case 39:
            key_state |= KEYRIGHT;
            break;
        case 32:
            key_state |= KEYSPACE;
            break;
        case 87:
            key_state |= KEYW;
            break;
        case 83:
            key_state |= KEYS;
            break;
        case 65:
            key_state |= KEYA;
            break;
        case 68:
            key_state |= KEYD;
            break;
    }
}

function onInputKeyUp(event)
{
    switch(event.keyCode)
    {
        case 38:
            key_state &= ~KEYUP;
            break;
        case 40:
            key_state &= ~KEYDOWN;
            break;
        case 37:
            key_state &= ~KEYLEFT;
            break;
        case 39:
            key_state &= ~KEYRIGHT;
            break;
        case 32:
            key_state &= ~KEYSPACE;
            break;
        case 87:
            key_state &= ~KEYW;
            break;
        case 83:
            key_state &= ~KEYS;
            break;
        case 65:
            key_state &= ~KEYA;
            break;
        case 68:
            key_state &= ~KEYD;
            break;
    }
}

function addEventListeners()
{
    window.addEventListener('keydown', onİnputKeyDown);
    window.addEventListener('keyup', onInputKeyUp);
}

function setup()
{
    createScene();
    createRenderer();
    createGUI();
    addEventListeners();

    createStage();
}

function update()
{
    requestAnimationFrame(update);
    newStage.connectPitches();
    newStage.moveCharacer();
    newStage.moveBall();

    renderer.render(scene, camera);
}

setup();
update();
