let snowflakes = []; // array to hold Snowflake objects

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("background");
  fill(240);
  noStroke();
}

function draw() {
  background(color('#130f40'));
  let t = frameCount / 60; // update time

  // create a random number of Snowflakes each frame
  for (let i = 0; i < random(5); i++) {
    snowflakes.push(new Snowflake()); // append Snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update Snowflake position
    flake.display(); // draw Snowflake
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

// snowflake class
class Snowflake {
  constructor() {
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 5);
    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));
  }

  update(time) {
    // x position follows a circle
    let w = 0.4; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  display() {
    ellipse(this.posX, this.posY, this.size);
  };
}
