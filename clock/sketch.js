function setup() {
    createCanvas(480, 480);
    angleMode(DEGREES);
    frameRate(1);
}

function draw() {
    background(51);
    translate(240, 240);
    rotate(-90);

    let hrs = hour();
    let min = minute();
    let sec = second();

    noFill();
    strokeWeight(8);

    stroke(255, 100, 150);
    let secondAngle = map(sec, 0, 60, 0, 360);
    arc(0, 0, 400, 400, 0, secondAngle);

    stroke(150, 100, 255);
    let minuteAngle = map(min, 0, 60, 0, 360);
    arc(0, 0, 380, 380, 0, minuteAngle);

    stroke(150, 255, 100);
    let hourAngle = map(hrs % 12, 0, 12, 0, 360);
    arc(0, 0, 360, 360, 0, hourAngle);

    push();
    rotate(secondAngle);
    stroke(255, 100, 150);
    line(0, 0, 150, 0);
    pop();

    push();
    rotate(minuteAngle);
    stroke(150, 100, 255);
    line(0, 0, 110, 0);
    pop();

    push();
    rotate(hourAngle);
    stroke(150, 255, 100);
    line(0, 0, 70, 0);
    pop();

    stroke(255);
    point(0, 0);
}
