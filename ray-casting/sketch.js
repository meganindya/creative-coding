let walls = [];
let ray;
let particle;

let sceneW, sceneH, isLandscape;
function resetWinSize() {
    if (windowWidth > windowHeight) {
        sceneW = windowWidth / 2;
        sceneH = windowHeight + 4;
        isLandscape = true;
    } else {
        sceneW = windowWidth;
        sceneH = windowHeight / 2 + 2;
        isLandscape = false;
    }
}

function setup() {
    resetWinSize();
    createCanvas(windowWidth, windowHeight + 4);
    addBoundaries();
    particle = new Particle();
}

function windowResized() {
    resetWinSize();
    resizeCanvas(windowWidth, windowHeight + 4);
    addBoundaries();
    particle = new Particle();
};

function addBoundaries() {
    for (let i = 0; i < 5; i++) {
        let x1 = random(sceneW);
        let x2 = random(sceneW);
        let y1 = random(sceneH);
        let y2 = random(sceneH);
        walls[i] = new Boundary(x1, y1, x2, y2);
    }
    walls.push(new Boundary(0, 0, sceneW, 0));
    walls.push(new Boundary(sceneW, 0, sceneW, sceneH));
    walls.push(new Boundary(sceneW, sceneH, 0, sceneH));
    walls.push(new Boundary(0, sceneH, 0, 0));
}

function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        particle.rotate(-0.1);
    } else if (keyIsDown(RIGHT_ARROW)) {
        particle.rotate(0.1);
    } else if (keyIsDown(UP_ARROW)) {
        particle.move(2);
    } else if (keyIsDown(DOWN_ARROW)) {
        particle.move(-2);
    }

    background(0);
    for (let wall of walls) {
      wall.show();
    }
    particle.show();

    const scene = particle.look(walls);
    const w = sceneW / scene.length;
    push();
    if (isLandscape) {
        translate(sceneW, 0);
    } else {
        translate(0, sceneH);
    }
    for (let i = 0; i < scene.length; i++) {
        noStroke();
        const b = map(scene[i] * scene[i], 0, sceneW * sceneW, 255, 0);
        const h = map(scene[i], 0, sceneW, sceneH, 0);
        fill(b);
        rectMode(CENTER);
        rect(i * w + w / 2, sceneH / 2, w + 1, h);
    }
    pop();
}
