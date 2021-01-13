/******************* FILE OVERVIEW ***************/
/* This file contains the classes used in sketch.js
 * Planet
 * LittleCircles
 * Particle
 * Trace
 */

/******************* CREDITS *********************/
/* Author: Mia Tang (www.mia-tang.com, miatang13@gmail.com)
 * Thanks to Friend Fan Bu's help on physics
 */

/* to turn off p5.js function / variables undefined warnings */
/*eslint no-undef: 0*/

class Planet {
  constructor(
    cx,
    cy,
    ry,
    rx,
    littleParticles,
    vx,
    vy,
    deceleration,
    innerParticles
  ) {
    this.cx = cx;
    this.cy = cy;
    this.ry = ry;
    this.rx = rx;
    this.angle = 0; //offset
    this.av = 0;
    this.ad = PI / 6;
    this.maxAngleVelocity = PI;
    this.staticRY = ry;
    this.staticRX = rx;
    this.littleCircles = littleParticles;
    this.vx = vx;
    this.vy = vy;
    this.maxV = 500;
    this.deceleration = deceleration;
    this.inCollisionX = false;
    this.inCollisionY = false;
    this.collisionXV = 0;
    this.collisionYV = 0;
    this.maxCompression = 0.5;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lastMouseDeterminant = 0;
    this.lastMouseTime = 0;
    this.mousePlanetVelocityRatio = 1;
    this.mousePlanetAVRatio = 0.15;
    this.innerParticles = innerParticles;
  }

  drawLittleCircles() {
    const a = this.rx;
    const b = this.ry;
    const numCircles = this.littleCircles.length;
    for (let i = 0; i < numCircles; i++) {
      const theta = (TWO_PI / numCircles) * i + this.angle;
      const y0 = sin(theta) * 100;
      const x0 = cos(theta) * 100;
      const x =
        (a * b * x0) / sqrt(a * a * y0 * y0 + b * b * x0 * x0) + this.cx;
      const y =
        (a * b * y0) / sqrt(a * a * y0 * y0 + b * b * x0 * x0) + this.cy;
      const radius = this.littleCircles[i].radius;
      const width = this.littleCircles[i].width;
      const outline = this.littleCircles[i].outline;
      const color = this.littleCircles[i].fill;
      push();
      fill(color);
      stroke(outline);
      ellipse(x - radius, y - radius, x + radius, y + radius);
      pop();
    }
  }

  drawParticles() {
    this.innerParticles.forEach(particle => {
      const x = particle.cx;
      const y = particle.cy;
      const radius = particle.radius;
      const width = particle.width;
      const outline = particle.outline;
      const color = particle.fill;
      push();
      fill(color);
      stroke(outline);
      strokeWeight(0.5);
      ellipse(x - radius, y - radius, x + radius, y + radius);
      pop();
    });
  }

  drawTrace() {
    this.innerParticles.forEach(particle => {
      particle.trace.forEach(trace => {
        trace.draw();
      });
    });
  }

  drawLine() {
    const num = this.innerParticles.length;
    push();
    strokeWeight(1);
    stroke(255);
    for (let i = 0; i < num - 1; i++) {
      line(
        this.innerParticles[i].cx,
        this.innerParticles[i].cy,
        this.innerParticles[i + 1].cx,
        this.innerParticles[i + 1].cy
      );
    }
    pop();
  }

  drawCurve() {
    const num = this.innerParticles.length;
    push();
    strokeWeight(0.5);
    stroke(255);
    noFill();
    for (let i = 0; i < num - 2; i++) {
      triangle(
        this.innerParticles[i].cx,
        this.innerParticles[i].cy,
        this.innerParticles[i + 1].cx,
        this.innerParticles[i + 1].cy,
        this.innerParticles[i + 2].cx,
        this.innerParticles[i + 2].cy
      );
    }
    pop();
  }
}

class LittleCircle {
  constructor(radius, width, outline, fill) {
    this.radius = radius;
    this.width = width;
    this.outline = outline;
    this.fill = fill;
  }
}

class Particle extends LittleCircle {
  constructor(radius, width, outline, fill, cx, cy, vx, vy) {
    super(radius, width, outline, fill);
    this.cx = cx;
    this.cy = cy;
    this.vx = vx;
    this.vy = vy;
    this.trace = [];
  }
  
  traceUpdate() {
    if (this.trace.length > TC_MAX) {
      this.trace.shift();
    }
    let tc = new Trace(this.cx, this.cy, this.radius / 3);
    this.trace.push(tc);
  }
}

class Trace {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.birthday = millis();
  }

  draw() {
    let now = millis();
    let hasBeen = now - this.birthday;
    let hasBeenPer = hasBeen / 3000;

    if (hasBeenPer > 0 && hasBeenPer < 1) {
      let alpha = map(hasBeenPer, 0, 1, 155, 0);
      let r = map(hasBeenPer, 0, 1, 20, 1);
      push();
      fill(alpha);
      noFill();
      stroke(alpha);
      ellipse(
        this.x - this.r,
        this.y - this.r,
        this.x + this.r,
        this.y + this.r
      );
      pop();
    }
  }
}
