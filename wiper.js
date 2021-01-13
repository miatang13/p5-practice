var debug = true;

var hGridNum = 18;
var vGridNum = 8;

var gridW;
var gridH;

var canvasW;
var canvasH;

var horizonYAnchor;
var horizonTopY;

var houses = [];
var numHouses = 4;

// colors

var purple = "#663366";
var pink = "#FF9999";
var greenC = "#33CC66";
var yellow = "#FFCC00";
var lightBlue = "#66CCCC";
var darkBlue = "#3399CC";
var orange = "#CC3333";
var brightPink = "#FF33CC";

function preload() {}

function setup() {
  frameRate(30);
  //noLoop();

  // pixel 4 dimensions (horizontal view) for debug
  canvasW = 1440 / 2;
  canvasH = 2960 / 2;

  createCanvas(window.innerWidth, window.innerHeight);
  background(lightBlue);

  gridW = width / hGridNum;
  gridH = height / vGridNum;

  strokeWeight(2);
  stroke(purple);

  for (var i = 0; i < numHouses; i++) {
    var h = new House();
    houses.push(h);
  }
}

function debugE(x, y) {
  if (debug) {
    push();
    fill("red");
    stroke("red");
    ellipse(x, y, 5);
    pop();
  }
}

function draw() {
  background(lightBlue);
  drawHorizon();
  drawRoadTrack();
  drawHouses();
}

function drawHouses() {
  // so we draw the bigger houses last
  houses.sort(function (h1, h2) {
    return h1.size - h2.size;
  });

  for (var i = 0; i < houses.length; i++) {
    houses[i].move();
    houses[i].display();
  }
}

class House {
  constructor() {
    this.reset();
  }
  display() {
    push();
    fill(orange);
    square(this.x, this.y, this.size);
    fill(darkBlue);
    triangle(
      this.x,
      this.y,
      this.x + this.size / 2,
      this.y - this.size / 4,
      this.x + this.size,
      this.y
    );
    fill(this.doorColor);
    if (this.door == "right") {
      rect(
        this.x + this.size / 2,
        this.y + this.size / 2,
        this.size / 3,
        this.size / 2
      );
    } else {
      rect(
        this.x + this.size / 4,
        this.y + this.size / 2,
        this.size / 3,
        this.size / 2
      );
    }

    pop();
  }

  reset() {
    this.side = random(["left", "right"]);
    if (this.side == "left") {
      this.x = 240;
      this.y = 154;
    } else {
      this.x = 720;
      this.y = 139;
    }
    this.size = 50;
    this.door = random(["left", "right"]);
    this.doorColor = random([purple, yellow, pink, darkBlue, lightBlue]);
  }

  move() {
    if (this.x <= 0 - this.size || this.x >= width || this.y >= height) {
      this.reset();
    }
    var yIncrem = 1;
    var xIncrem = 5;
    var sizeIncrem = 2;
    this.y += yIncrem;
    this.x = this.side == "left" ? this.x - xIncrem : this.x + xIncrem;
    this.size += sizeIncrem;
  }
}

function drawRoadTrack() {
  push();
  var topColFromMid = 3;
  var botColFromMid = topColFromMid * 2;
  var midCol = hGridNum / 2;

  fill(pink);
  ellipseMode(CENTER);

  beginShape();
  vertex((midCol - botColFromMid) * gridW, height);
  vertex(397, horizonTopY);
  vertex(644, horizonTopY);
  vertex((midCol + botColFromMid) * gridW, height);
  endShape(CLOSE);
  pop();
}

// fix the top point
function drawHorizon() {
  push();

  // the horizon line
  horizonYAnchor = (hGridNum / 10) * gridH;
  horizonTopY = horizonYAnchor / 2;

  fill(greenC);
  beginShape();
  curveVertex(0, horizonYAnchor);
  curveVertex(0, horizonYAnchor);
  curveVertex(width / 2, horizonTopY);
  curveVertex(width, horizonYAnchor);
  curveVertex(width, horizonYAnchor);
  vertex(width, height);
  vertex(0, height);
  vertex(0, horizonYAnchor);
  endShape(CLOSE);

  //debug
  //debugE(gridW * (floor(hGridNum/2)-3), trackY);
  //debugE(0, horizonYAnchor);
  //debugE(canvasW / 2, horizonYAnchor / 2);
  //debugE(canvasW, horizonYAnchor)
  pop();
}

function mousePressed() {
  console.log(mouseX);
  console.log(mouseY);
}
