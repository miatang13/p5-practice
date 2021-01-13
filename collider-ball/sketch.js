/******************* FILE OVERVIEW ***************/
/* This is the p5.js file that creates a bouncy ball consisted of
 * small particles that are contained within it. It simulates
 * bouncing off of the "walls" of the canvas, and users can interact
 * with the ball by pushing the ball with their cursor
 */

/******************* CREDITS *********************/
/* Author: Mia Tang (www.mia-tang.com, miatang13@gmail.com)
 * Thanks to Friend Fan Bu's help on physics
 */

/* to turn off p5.js function / variables undefined warnings */
/*eslint no-undef: 0*/

var planet;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ellipseMode(CORNERS);
  initiate();
}

function initiate() {
  /* The outer little circles that outlines the planet
   * gets initialized with random fill.
   */
  let littleParticles = []
  for (let i = 0; i < LITTLE_CIRCLE_NUM; i++) {
    let fill = random(LITTLE_CIRCLE_COLOR);
    let circle = new LittleCircle(
      LITTLE_CIRCLE_RADIUS,
      LITTLE_CIRCLE_WIDTH,
      LITTLE_CIRCLE_OUTLINE,
      fill
    );
    littleParticles.push(circle);
  }

  /* The inner particles that stays within the planet
   * gets initialized with random values.
   */
  let innerParticles = [];
  for (let j = 0; j < PARTICLE_NUM; j++) {
    let cx = width / 2 + random(PARTICLE_CX_MIN, PARTICLE_CX_MAX);
    let cy = height / 2 + random(PARTICLE_CY_MIN, PARTICLE_CY_MAX);
    let vx = random(PARTICLE_VX_MIN, PARTICLE_VX_MAX);
    let vy = random(PARTICLE_VY_MIN, PARTICLE_VY_MAX);
    let radius = random(PARTICLE_RADIUS_MIN, PARTICLE_RADIUS_MAX);
    let fill = random(PARTICLE_COLOR);
    let particle = new Particle(
      radius,
      PARTICLE_WIDTH,
      PARTICLE_OUTLINE,
      fill,
      cx,
      cy,
      vx,
      vy
    );
    innerParticles.push(particle);
  }

  planet = new Planet(
    width / 2, // center x
    height / 2, // center y
    PLANET_RADIUS_Y,
    PLANET_RADIUS_X,
    littleParticles,
    PLANET_VX,
    PLANET_VY,
    PLANET_DECELERATION_SPEED,
    innerParticles
  );
}

function draw() {
  background(0);
  update();
  planet.drawTrace();
  planet.drawParticles();
}

/* This function gets called every frame before anything on the screen
 * gets redrawn. It updates the following information of the state:
 * - planet's position 
 * - checks if the planet is in collision with the sides
 * - update inner particle's positions 
 */
function update() {
  updatePlanet();
  checkPlanetCollision();
  updateParticles();
}


/* Updates the planet's position by updating its center x position,
 * center y position, angle, and average velocity.
 */
function updatePlanet() {
  planet.cx += (planet.vx * frameRate()) / 1000;
  planet.cy += (planet.vy * frameRate()) / 1000;
  planet.angle += (planet.av * frameRate()) / 1000;
  if (planet.av > 0) { 
    planet.av -= (planet.ad * frameRate()) / 1000;
    planet.av = max(0, planet.av);
  } else if (planet.av < 0) {
    planet.av += (planet.ad * frameRate()) / 1000;
    planet.av = min(0, planet.av);
  }
}

/*********************  COLLISION CHECKERS ********************/
/* These functions perform collision checks for the planet
 * and the inner particles.
 */

function checkPlanetCollision() {
  const littleCircRadius = planet.littleCircles[0].radius;
  // checks left and right
  const planetLeft =
    planet.cx - planet.staticRX - littleCircRadius ;
  const planetRight =
    planet.cx + planet.staticRX + littleCircRadius ;
  if (planetLeft >= 0 && planetRight <= width) {
    sideNoCollision(planetLeft, planetRight);
  } else {
    sideHasCollions(planetLeft, planetRight);
  }
  // checks top and bottom
  const planetTop =
    planet.cy - planet.staticRY - littleCircRadius ;
  const planetBottom =
    planet.cy + planet.staticRY + littleCircRadius ;
  if (planetTop >= 0 && planetBottom <= height) {
    vertNoCollision(planetTop, planetBottom);
  } else {
    vertHasCollision(planetTop, planetBottom);
  }
}

/* If no collisions, the planet is a perfect ellipse
 * with its static radius, and we slow it down 
 */
function sideNoCollision(planetLeft, planetRight) {
  if (planet.inCollisionX) {
    planet.inCollisionX = false;
    planet.rx = planet.staticRX;
    planet.vx = -planet.collisionXV;
  }
  if (planet.vx > 0) {
    planet.vx -= (planet.deceleration * frameRate()) / 1000;
    planet.vx = max(0, planet.vx);
  } else if (planet.vx < 0) {
    planet.vx += (planet.deceleration * frameRate()) / 1000;
    planet.vx = min(0, planet.vx);
  }
}

/* If planet has collisions on left or right, we update
 * its velocity of the x-axis.
 */
function sideHasCollions(planetLeft, planetRight) {
  if (!planet.inCollisionX) {
    planet.collisionXV = planet.vx;
    planet.inCollisionX = true;
  }

  if (planetRight > width) {
    const ratio = planet.maxV / ((1 - planet.maxCompression) * planet.staticRX);
    const newRX = width - planet.littleCircles[0].radius - planet.cx;
    planet.rx = newRX;

    if (planet.vx > 10) {
      planet.vx = planet.collisionXV - ratio * (planet.staticRX - newRX);
    } else {
      planet.vx = -(planet.collisionXV - ratio * (planet.staticRX - newRX));
    }
  } else if (planetLeft < 0) {
    const ratio = planet.maxV / ((1 - planet.maxCompression) * planet.staticRX);
    const newRX = planet.cx - planet.littleCircles[0].radius;
    planet.rx = newRX;

    if (planet.vx < -10) {
      planet.vx = planet.collisionXV + ratio * (planet.staticRX - newRX);
    } else {
      planet.vx = -(planet.collisionXV + ratio * (planet.staticRX - newRX));
    }
  }
}

/* If no collisions, the planet is a perfect ellipse
 * with its static radius, and we slow it down 
 */
function vertNoCollision(planetTop, planetBottom) {
  if (planet.inCollisionY) {
    planet.inCollisionY = false;
    planet.ry = planet.staticRY;
    planet.vy = -planet.collisionYV;
  }

  if (planet.vy > 0) {
    planet.vy -= (planet.deceleration * frameRate()) / 1000;
    planet.vy = max(0, planet.vy);
  } else if (planet.vy < 0) {
    planet.vy += (planet.deceleration * frameRate()) / 1000;
    planet.vy = min(0, planet.vy);
  }
}

/* If planet has collisions on top or bottom, we update
 * its velocity of the y-axis.
 */
function vertHasCollision(planetTop, planetBottom) {
  if (!planet.inCollisionY) {
    planet.collisionYV = planet.vy;
    planet.inCollisionY = true;
  }
  if (planetBottom > height) {
    const ratio = planet.maxV / ((1 - planet.maxCompression) * planet.staticRY);
    const newRY = height - planet.littleCircles[0].radius - planet.cy;
    planet.ry = newRY;
    if (planet.vy > 10) {
      planet.vy = planet.collisionYV - ratio * (planet.staticRY - newRY);
    } else {
      planet.vy = -(planet.collisionYV - ratio * (planet.staticRY - newRY));
    }
  } else if (planetTop < 0) {
    const ratio = planet.maxV / ((1 - planet.maxCompression) * planet.staticRY);
    const newRY = planet.cy - planet.littleCircles[0].radius;
    planet.ry = newRY;
    if (planet.vy < -10) {
      planet.vy = planet.collisionYV + ratio * (planet.staticRY - newRY);
    } else {
      planet.vy = -(planet.collisionYV + ratio * (planet.staticRY - newRY));
    }
  }
}

/* This function updates the positions of the particles 
 * inside the planet. 
 */
function updateParticles() {
  const littleCircRadius = planet.littleCircles[0].radius;
  planet.innerParticles.forEach(particle => {
    particle.traceUpdate();
    particle.cx += ((planet.vx + particle.vx) * frameRate()) / 1000;
    particle.cy += ((planet.vy + particle.vy) * frameRate()) / 1000;
    const h = planet.cx;
    const k = planet.cy;
    const a = planet.rx - littleCircRadius - particle.radius;
    const b = planet.ry - littleCircRadius - particle.radius;
    const determinant = ellipseDeterminant(
      particle.cx,
      particle.cy,
      h,
      k,
      a,
      b
    );
    if (determinant >= 1) {
      const nx = particle.cx - planet.cx;
      const ny = particle.cy - planet.cy;
      const dot_n_v = nx * particle.vx + ny * particle.vy;
      if (dot_n_v > 0) {
        const nv_x = (dot_n_v / (pow(nx, 2) + pow(ny, 2))) * nx;
        const nv_y = (dot_n_v / (pow(nx, 2) + pow(ny, 2))) * ny;
        const tv_x = particle.vx - nv_x;
        const tv_y = particle.vy - nv_y;
        particle.vx = -nv_x + tv_x;
        particle.vy = -nv_y + tv_y;
      }
      const x0 = nx;
      const y0 = ny;
      const x =
        (a * b * x0) / sqrt(a * a * y0 * y0 + b * b * x0 * x0) + planet.cx;
      const y =
        (a * b * y0) / sqrt(a * a * y0 * y0 + b * b * x0 * x0) + planet.cy;
      particle.cx = x;
      particle.cy = y;
    }
  });
}

/*********************  INTERACTION ************************/

function mouseMoved() {
  motion(createVector(mouseX, mouseY));
}

/* Ellipse-Line Intersection equation from
 * http://mathworld.wolfram.com/Ellipse-LineIntersection.html 
 */ 
function motion(event) {
  if (planet.lastMouseTime == 0) {
    updateMouseDeterminant(millis(), event);
  }
  const dt = millis() - planet.lastMouseTime;
  if (dt > 0) {
    const result = calcDeterminant(planet, event, dt);
    let determinant, dx, dy, vx, vy;
    [determinant, dx, dy, vx, vy] = [
      result[0],
      result[1],
      result[2],
      result[3],
      result[4]
    ];
    if (planet.lastMouseDeterminant >= 1 && determinant < 1) {
      const nx = planet.cx - planet.lastMouseX;
      const ny = planet.cy - planet.lastMouseY;
      const dot_n_v = nx * vx + ny * vy;
      if (dot_n_v > 0) {
        const nv_x = (dot_n_v / (pow(nx, 2) + pow(ny, 2))) * nx;
        const nv_y = (dot_n_v / (pow(nx, 2) + pow(ny, 2))) * ny;
        const tv_x = vx - nv_x;
        const tv_y = vy - nv_y;
        if (!planet.inCollisionX && !planet.inCollisionY) {
          updateVXVY(nv_x, nv_y);
        }
        const cross_n_tv = tv_x * ny - tv_y * nx;
        const tv_m = sqrt(tv_x * tv_x + tv_y * tv_y);
        if (cross_n_tv > 0) {
          const aRadius = (planet.rx + planet.ry) / 2;
          const newAV =
            planet.av + (tv_m / aRadius) * planet.mousePlanetAVRatio;
          planet.av = min(planet.maxAngleVelocity, newAV);
        } else if (cross_n_tv < 0) {
          const aRadius = (planet.rx + planet.ry) / 2;
          const newAV =
            planet.av - (tv_m / aRadius) * planet.mousePlanetAVRatio;
          planet.av = max(-planet.maxAngleVelocity, newAV);
        }
      }
    }
    updateLastDeterminant(millis(), event);
  }
}

/*********************  INTERACTION HELPER ********************/
/* These functions are called in the motion function, which 
 * gets called when the user's cursor moves within the canvas
 */

function updateMouseDeterminant(event) {
  planet.lastMouseTime = millis();
  planet.lastMouseX = event.x;
  planet.lastMouseY = event.y;
  const a = planet.rx + planet.littleCircles[0].radius;
  const b = planet.ry + planet.littleCircles[0].radius;
  const x = planet.lastMouseX;
  const y = planet.lastMouseY;
  const h = planet.cx;
  const k = planet.cy;
  planet.lastMouseDeterminant = ellipseDeterminant(x, y, h, k, a, b);
}

function updateVXVY(nv_x, nv_y) {
  let newVX = planet.vx + nv_x * planet.mousePlanetVelocityRatio;
  if (newVX > planet.maxV) {
    newVX = planet.maxV;
  } else if (newVX < -planet.maxV) {
    newVX = -planet.maxV;
  }
  let newVY = planet.vy + nv_y * planet.mousePlanetVelocityRatio;
  if (newVY > planet.maxV) {
    newVY = planet.maxV;
  } else if (newVY < -planet.maxV) {
    newVY = -planet.maxV;
  }
  planet.vx = newVX;
  planet.vy = newVY;
}

function updateLastDeterminant(milli_sec, event) {
  planet.lastMouseTime = milli_sec;
  planet.lastMouseX = event.x;
  planet.lastMouseY = event.y;
  const a = planet.rx + planet.littleCircles[0].radius;
  const b = planet.ry + planet.littleCircles[0].radius;
  const x = planet.lastMouseX;
  const y = planet.lastMouseY;
  const h = planet.cx;
  const k = planet.cy;
  planet.lastMouseDeterminant = ellipseDeterminant(x, y, h, k, a, b);
}
