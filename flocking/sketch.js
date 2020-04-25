
let canvasWidth, canvasHeight;
let getCanvasSize = () => {
    canvasWidth = document.getElementById('canvas').offsetWidth;
    canvasHeight = document.getElementById('canvas').offsetHeight;
};

let alignmentSlider, cohesionSlider, separationSlider;

let sketch = p => {
    let flock = [];

    p.setup = () => {
        getCanvasSize();
        p.createCanvas(canvasWidth, canvasHeight);
        separationSlider = addSlider('separationSl');
        alignmentSlider = addSlider('alignmentSl');
        cohesionSlider = addSlider('cohesionSl');
        createBoids();
    };

    p.windowResized = () => {
        getCanvasSize();
        p.resizeCanvas(canvasWidth, canvasHeight);
        createBoids();
    };

    p.draw = () => {
        p.background(51);
        for (let boid of flock) {
            boid.edges();
            boid.flock(flock);
            boid.update();
            boid.show();
        }
    };

    let createBoids = () => {
        flock = [];
        let boidCount = p.floor((100 * p.width * p.height) / (640 * 360));
        for (let i = 0; i < p.min(200, boidCount); i++) {
            flock.push(new Boid(p));
        }
    };

    let addSlider = parent => {
        let slider = p.createSlider(0, 2, 1, 0.2);
        slider.addClass('slider');
        slider.parent(parent);
        return slider;
    };
};

new p5(sketch, 'canvas');
