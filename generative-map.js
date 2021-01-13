// project-01 MAP for CMU 60-212 taught by Golan Levin

// this is a map generater that generates my imaginary world each 
// time a user clicks on the canvas

/* My imaginary place is how I currently perceive myself. It is dominated by contrasting colors, ambiguous 
 * shapes, and undefined labels. Around the blended vibrant colors, there exist rigid lines holding back the 
 * circles that are on the edge of merging with the unknown. 
 */ 


// CONTOURS 
let field = [];
let rez = 20;
let cols, rows;

// TERRITORY
let territoryField = [];
let trez;
let tcols, trows;
let anchorNum = 10;
let horizLabelNumMax = 5;
let horizLabelNum;
let tagsNum;

// NOISE 
let increment = 0.1;
let zoff = 0;
let noise;

// REFRESH
let generateNew;

// COLORS
let colorDirtyOrange = '#c85624'
let colorCamel = '#efb15e'
let colorLightYellow = '#f8da82'
let colorShit = '#aa6c17'
let colorDarkBlue = '#053371'
let colorLightBlue = '#9ec6c6'
let colorGreen = '#7ca456'
let colorMedBlue = '#5c909b'
let randomR;
let randomG;
let randomB;
let randomColorCombo;
let randomColorComboL = [0, 1, 2];

// LABELS
let vocabs = ["A", "B", "C", "D", "E", "F", "G"]

// RANDOMIZE
//let textPos;
let territoryNums;

function initialize2DArray(L, colsNum, rowsNum) {
  for (let i = 0; i < colsNum; i++) {
    let k = [];
    for (let j = 0; j < rowsNum; j++) {
      k.push(0);
    }
    L.push(k);
  }
}

function initializeZeroOne(L, colsNum, rowsNum) {
  for (let i = 0; i < colsNum; i++) {
    for (let j = 0; j < rowsNum; j++) {
      L[i][j] = floor(random(2));
    }
  }
}

function distance(v1, v2){
  var dist = Math.sqrt( Math.pow((v1.x-v2.x), 2) + Math.pow((v1.y-v2.y), 2) );
  return dist;
}

function preload() {
  fontEckmann = loadFont('font/ECKMANN.ttf');
  fontAnnStone = loadFont('font/AnnStone.ttf');
  fontUxum = loadFont('font/UxumGrotesque-Regular.ttf');
}

function randomizeColor() {
  randomColorCombo = random(randomColorComboL);
  
  switch (randomColorCombo){
    
    case 0: {
      randomG = random(0, 100);
      randomB = random(200, 250);
      break;
    } 
      
      case 1: {
      randomG = random(200, 250);
      randomB = random(0, 100);
      break;
    }
      
      case 2: {
      randomG = random(55, 155);
      randomB = random(55, 155);
      break;
    }
      
  }

}

function setup() {
  createCanvas(640, 640);
  noise = new OpenSimplexNoise(random(0,5));
  cols = width / rez - 4;
  rows = height / rez - 4;

  trez = width / 6;
  tcols = width / trez;
  trows = height / trez;

  initialize2DArray(field, cols, rows);
  initialize2DArray(territoryField, tcols, trows);
  generateNew = true;
  
  angleMode(DEGREES); // Change the mode to DEGREES
  
  horizLabelNum = 0;
  
  tagsNum = 0;
  
  randomizeColor();
  //noLoop();
}


function draw() {

  if (generateNew) {
    //background(colorCamel);
    tagsNum = 0;
    randomizeColor();
    background('white');
    push();
    translate(50, 50);
    //drawBorder();
    drawTerrain();
    drawTerritory();
    pop();
    //drawTitle();

    generateNew = false;
  }
}

function mousePressed() {
  generateNew = true;
}

// helper drawing functions

function drawBasicLine(v1, v2) {
  stroke(colorDarkBlue);
  strokeWeight(3);
  line(v1.x, v1.y, v2.x, v2.y);
}

function drawBasicLines(L) {
  for (let i = 0; i < L.length - 1; i++) {
    drawBasicLine(L[i], L[i + 1]);
  }
}


// draws the border of the territories 
function drawLine(v1, v2) {
  push();
  strokeWeight(rez*0.2);
  stroke(255, randomG , randomB);
  line(v1.x, v1.y, v2.x, v2.y);
  pop();
  
}

function drawQuadrant(voffset, hoffset, hbound, vbound) {
  let anchors = [];
  let vmid = vbound / 2;
  let hmid = hbound / 2;
  let vincrem = vmid / anchorNum;
  let hincrem = hmid / anchorNum;

  let startV = createVector(random(hmid/2, hmid), 0);
  
  anchors.push(startV);

  for (let anchorIdx = 1; anchorIdx < anchorNum; anchorIdx++) {
    let randomX = random(hmid + (hincrem * (anchorIdx - 1)), hmid + (hincrem * anchorIdx));
    let randomY = random((vincrem * (anchorIdx - 1)),  (vincrem * anchorIdx));
    let v = createVector(randomX, randomY);
    anchors.push(v);
  }
  
  let curLen = anchors.length;
  for (let anchorIdx = 1; anchorIdx < curLen; anchorIdx++){
    let v = createVector(anchors[curLen - anchorIdx].x - random(-15,15), anchors[curLen - anchorIdx].y + (vincrem * anchorIdx));
    anchors.push(v);
  }
  
  let endV = createVector(hoffset, random(vmid, vbound));
  anchors.push(endV);
  
  drawBasicLines(anchors);
}



function drawTerritory() {
  //drawQuadrant(0, 0, width / 2, height / 2); // first Q
}

function drawBorder() {
  fill(colorDarkBlue);
  stroke(colorDarkBlue);
  strokeWeight(2);
  rect(0, 0, width - 100, height - 100);
  
  
  /* rigid borders */
  strokeWeight(5);
  stroke(colorDirtyOrange);
  //rect(-5, -5, width - 90, height - 90);
  stroke(colorLightYellow);
  strokeWeight(3);
  noFill();
  //rect(-8, -8, width - 85, height - 85);
}

function hasDarkPixel(x, y) {
  let pixel =  get(x, y);
  //console.log(red(pixel), green(pixel), blue(pixel));
  // check if it already has label 
  
  if ((red(pixel) + green(pixel) + blue(pixel)) > 400){
          return true;
  }
  return false;
 
}

function drawTerrain() {
  
  
  if (generateNew) {
    
     let xoff = 0;
    
      for (let i = 0; i < cols; i++) {
        xoff += increment;
        let yoff = 0;
        for (let j = 0; j < rows; j++) {
          field[i][j] = float(noise.noise3D(xoff, yoff, zoff));
          yoff += increment;
        }
      }
      zoff += 3;
    
    drawDots();
    
    //draw territory borders using the marching squares algorithm 
    //https://youtu.be/0ZONMNUKTfU

    for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        let x = i * rez;
        let y = j * rez;
        const more = 0.5;
        let a = createVector(x + rez * more, y);
        let b = createVector(x + rez, y + rez * more);
        let c = createVector(x + rez * more, y + rez);
        let d = createVector(x, y + rez * more);
        let state = getState(ceil(field[i][j]), ceil(field[i + 1][j]),
          ceil(field[i + 1][j + 1]), ceil(field[i][j + 1]));
      
          /* letter styling */
        push();
        stroke(colorDarkBlue);
        strokeWeight(rez * .5);
        fill('white');
        textSize(15);
        textAlign(CENTER);
        textFont(fontEckmann);
        
        switch (state) {
          
            
          // top left to bot right
          case 1:
           // drawLine(c, d);
            
           
            if (distance(c,d) > 14 && (!hasDarkPixel(c.x, c.y))  &&( tagsNum <= 10)){
                translate(c.x-10, c.y-15);
                rotate(45);
                text(random(vocabs),0,0);
                tagsNum++;
                
            } else {
                drawLine(c, d);
            }
            pop();

            break;
            
          
          case 2:
            //drawLine(b, c);
            //bot left to top right
            
            if (distance(b, c) > 14 && (!hasDarkPixel(b.x, b.y))  &&( tagsNum <= 10)){
               
                translate(b.x-5, b.y-10);
                rotate(-45);
                text(random(vocabs),0,0);
                tagsNum++;
               
            }else {
                drawLine(b, c);
            }
             pop();
            
            break;
            
          // horizontal 
          case 3:
            drawLine(b, d);
                        
            break;                           
          // top left to bot right
          case 4:
            drawLine(a, b);
            
            break;
          case 5:
            drawLine(a, d);
            drawLine(b, c);
            break;
          case 6:
            drawLine(a, c);
            break;
          case 7:
            drawLine(a, d);
            break;
          case 8:
            drawLine(a, d);
            break;
          case 9:
            drawLine(a, c);
            break;
          case 10:
            drawLine(a, b);
            drawLine(c, d);
            break;
          case 11:
            drawLine(a, b);
            break;
            
          // horizontal
          case 12:
            drawLine(b, d);
 
            break;

          case 13:
            drawLine(b, c);
            break;
            
          // horizontal 
          case 14:
            //drawLine(c, d);
            
                       
           if (distance(b, d) > 14 
              && (horizLabelNum <= horizLabelNumMax)
              && (!hasDarkPixel(b.x, b.y))
              &&( tagsNum <= 10)){
               
                translate(b.x- 5, b.y + 5);
                rotate(0);
                text(random(vocabs),0,0);
                horizLabelNum ++;
               tagsNum++;
             
            } else {
                drawLine(c, d);
            }
             pop();
            
            break;
        }
      }
    }
  }

}

function drawDots() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      push();
      fill(255 * (field[i][j] * rez) -50, randomG, randomB, 100);
      stroke(255 * (field[i][j] * rez), 150, 250);
      strokeWeight(rez * 0.1);
      //point(i * rez, j * rez);
      ellipse(i*rez, j*rez, 45, 50);
      pop();
    }
  }
}

function getState(a, b, c, d) {
  return a * 8 + b * 4 + c * 2 + d * 1;
}
