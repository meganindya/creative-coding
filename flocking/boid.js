class Boid {
    constructor(p) {
        this.p = p;
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(p.random(2, 4));
        this.acceleration = p.createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 2;
        this.vector = this.p.createVector(this.velocity.x, this.velocity.y);
    }

    edges() {
        if (this.position.x > this.p.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = this.p.width;
        }
        if (this.position.y > this.p.height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = this.p.height;
        }
    }

    visibleBoids(boids, perceptionRadius) {
        let visible = [];
        for (let boid of boids) {
            let thisV = this.p.createVector(this.position.x, this.position.y);
            let boidV = this.p.createVector(boid.position.x, boid.position.y);
            let diff = p5.Vector.sub(boidV, thisV);

            let d = diff.mag();
            if (boid != this && d < perceptionRadius) {
                let angle = this.vector.angleBetween(diff);
                if (this.p.abs(angle) <= 165)
                    visible.push({ "obj" : boid, "d" : d });
            }
        }
        return visible;
    }

    separation(boids) {
        let steering = this.p.createVector();
        let total = 0;
        for (let boid of boids) {
            let diff = p5.Vector.sub(this.position, boid.obj.position);
            diff.div(boid.d * boid.d / 4);
            steering.add(diff);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    alignment(boids) {
        let steering = this.p.createVector();
        let total = 0;
        for (let boid of boids) {
            steering.add(boid.obj.velocity);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let steering = this.p.createVector();
        let total = 0;
        for (let boid of boids) {
            steering.add(boid.obj.position);
            total++;
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        let visible = this.visibleBoids(boids, 100);

        let separation = this.separation(visible);
        let alignment = this.alignment(visible);
        let cohesion = this.cohesion(visible);

        separation.mult(separationSlider.value());
        alignment.mult(alignmentSlider.value());
        cohesion.mult(cohesionSlider.value());

        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        let x = this.position.x;
        let y = this.position.y;

        this.p.push();
        this.p.translate(x, y);

        this.vector.x = this.velocity.x;
        this.vector.y = this.velocity.y;
        /*this.vector.setMag(20);
        this.p.stroke(0, 255, 0);
        this.p.line(0, 0, this.vector.x, this.vector.y);*/

        this.p.noFill();
        this.p.stroke(255);
        let ang = this.p.atan(this.vector.y / this.vector.x);
        if (this.vector.x < 0)
            ang += 180;
        this.p.rotate(ang);
        this.p.triangle(-2, 2, 4, 0, -2, -2);
        this.p.pop();
    }
}
