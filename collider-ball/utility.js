/******************* FILE OVERVIEW ***************/
/* This file contains functional utility 
 * functions used by sketch.js file. 
 * These functions do not change the state. 
 */

/******************* CREDITS *********************/
/* Author: Mia Tang (www.mia-tang.com, miatang13@gmail.com)
 * Thanks to Friend Fan Bu's help on physics
 */

/* to turn off p5.js function / variables undefined warnings */
/* eslint no-undef: 0*/ 

function ellipseDeterminant(x, y, h, k, a, b) {
  const determinant = (x - h) ** 2 / pow(a, 2) + pow(y - k, 2) / pow(b, 2);
  return determinant;
}

function calcDeterminant(planet, event, dt) {
  const dx = event.x - planet.lastMouseX;
  const dy = event.y - planet.lastMouseY;
  const vx = round((dx * 1000) / dt);
  const vy = round((dy * 1000) / dt);
  const h = planet.cx;
  const k = planet.cy;
  const a = planet.rx + planet.littleCircles[0].radius;
  const b = planet.ry + planet.littleCircles[0].radius;
  const determinant = ellipseDeterminant(event.x, event.y, h, k, a, b);
  return [determinant, dx, dy, vx, vy];
}
