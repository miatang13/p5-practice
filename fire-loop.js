//Project 02 -Exploring loop 
//for 60-212 taught by Golan Levin, Fall 2020 CMU


var ease = new p5.Ease();
let colorGoingUp = true;

function setup() {
  createCanvas(1280, 720);

}

function draw() {
  //background('#FFF000');
  background('white');
  noStroke();
  drawFire();
  push();
  drawSmoke();
  pop();
  //drawBar();
}

function drawBar() {
  let nBar = 10;
  let smokeFrom = color("white");
  let smokeTo = color("#DADADA");
  fill(smokeTo);


  for (var i = 0; i < nBar; i++) {
    let x = map(i, 0, (nBar - 1), 0, width - 10);
    fill('black');
    rect(x - 3, 0, 15, height);
    fill('grey');
    rect(x, 0, 15, height);
    fill('black');
    rect(x + 2, 0, 15, height);
  }
}

function drawSmoke() {
  let smokeFrom = color("white");
  let smokeTo = color("#DADADA");

  var nSmoke = 10;
}

function drawFire() {

  //anchor of flameSets
  var L = -250;
  var R = width + 200;
  var nFlames = 35;
  var nFlameSets = 35;


  // colors 
  let fireFrom = color("yellow");
  let fireTo = color("#D22501"); //red #D22501


  for (var n = 0; n < nFlameSets; n++) {
    push();
    translate(10 * n - 150, 20 * n - 145);


    let colorOffset = ease.sineIn(n + millis() / 100.0) * 0.005;

    if (colorGoingUp) {
      colorOffset += 0.01;
      if (colorOffset == 1) {
        colorGoingUp = false;
      }
    } else {
      colorOffset -= 0.01;
      if (colorOffset == 0) {
        colorGoingUp = true;
      }
    }

    let fireFill = lerpColor(fireFrom, fireTo, constrain(n / (nFlameSets - 1) + colorOffset, -1, 1));
    fill(fireFill);


    beginShape();

    // 2 bottom end point to anchor the fire 
    vertex(L, 300);
    vertex(L, 100);

    let x;
    let y;

    // location of top vertex
    for (var i = 0; i < nFlames; i++) {
      x = map(i, 0, (nFlames - 1), L, R);
      y = (i % 2 == 0) ? 50 : 150;


      if (i % 2 == 0) {
        var original_x = x;
        var ran = random(0, 5);

        if (ran == 1) {
          x = original_x - 30 * ease.exponentialInOut(n + millis() / 1000.0);
        }
        if (ran == 3) {
          x = original_x + 30 * ease.sineIn(n + millis() / 1500.0);
        } else {
          x += 30 * ease.sineOut(n + millis() / 1400.0);
        }
      }
      vertex(x, y);
    }

    vertex(R, 100);
    vertex(R, 300);
    endShape(CLOSE);

    pop();

  }

}
