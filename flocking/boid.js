class Boid {
    constructor(p) {
        this.p = p;
        this.position = p.createVector(p.random(p.width), p.random(p.height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(p.random(2, 4));
        this.acceleration = p.createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 2;
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

    align(boids) {
        let perceptionRadius = 100;
        let steering = this.p.createVector();
        let total = 0;
        for (let other of boids) {
            let d = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 50;
        let steering = this.p.createVector();
        let total = 0;
        for (let other of boids) {
            let d = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
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
        let perceptionRadius = 100;
        let steering = this.p.createVector();
        let total = 0;
        for (let other of boids) {
            let d = this.p.dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
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
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        separation.mult(separationSlider.value());
        alignment.mult(alignmentSlider.value());
        cohesion.mult(cohesionSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
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

        let vector = this.p.createVector(this.velocity.x, this.velocity.y);
        /*vector.setMag(20);
        this.p.stroke(0, 255, 0);
        this.p.line(0, 0, vector.x, vector.y);*/

        this.p.noFill();
        this.p.stroke(255);
        let ang = this.p.atan(vector.y / vector.x);
        if (vector.x < 0)
            ang += this.p.PI;
        this.p.rotate(ang);
        this.p.triangle(-2, 2, 4, 0, -2, -2);
        this.p.pop();
    }
}
