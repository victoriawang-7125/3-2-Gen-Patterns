const GOLDEN = (1 + Math.sqrt(5)) / 2;
const COLS = 6;

let bg, gold, champagne, copper, fills;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // colors
  bg = color('#05090b');
  gold = color('#f5c542');
  champagne = color('#fff3cf');
  copper = color('#d9622b');
  fills = [
    color('#0b6b57'), // emerald
    color('#17909b'), // teal
    color('#14304d'), // blue
    color('#0b0f12'), // black
  ];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bg);

  const t = frameCount * 0.03;
  const cellW = width / COLS;
  const cellH = cellW / GOLDEN;
  const rows = ceil(height / cellH);

  // mouse controls the shear and size pulse (a sine wave runs until you move it)
  const idle = mouseX === 0 && mouseY === 0;
  const shear = idle ? sin(t) * 0.25 : map(mouseX, 0, width, -0.5, 0.5);
  const pulse = idle ? 0.03 : map(mouseY, 0, height, 0, 0.07);

  // loop through every row and column
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < COLS; i++) {
      randomSeed(i * 131 + j * 977 + 5); // keeps random() steady each frame

      const wave = sin(t + (i + j) * 0.6);

      // modulo decides if the spiral is turned upside down
      const turn = (2 * i + j * j + j) % 4 === 0 ? 1 : -1;

      // modulo changes how many squares each spiral has (6, 7 or 8)
      const depth = 6 + ((i + j) % 3);

      // small lean for each tile
      const tilt = (((i * j) % 3) - 1) * 0.05;

      push();
      translate(i * cellW + cellW / 2, j * cellH + cellH / 2);
      rotate(tilt + wave * 0.02);
      shearX(shear * wave * 0.5);
      const size = 0.94 + pulse * wave;
      scale(turn * size, turn * size);
      translate(-cellW / 2, -cellH / 2);
      drawSpiral(cellH, i + j, depth, t);
      pop();
    }
  }
}

// draws one spiral: a square, then an arc, then shrink and turn
function drawSpiral(s, offset, depth, t) {
  push();
  for (let k = 0; k < depth; k++) {
    // square color (sometimes copper)
    let c = fills[(k + offset) % 4];
    if (k > 1 && random() < 0.12) c = copper;
    fill(c);
    stroke(bg);
    strokeWeight(3);
    rect(0, 0, s, s);

    // gold arc with a thin light line on top
    noFill();
    const w = map(k, 0, depth - 1, 7, 2.5) * (1 + 0.25 * sin(t * 2 - k * 0.7));
    stroke(gold);
    strokeWeight(w);
    arc(s, s, s * 2, s * 2, PI, PI + HALF_PI);
    stroke(champagne);
    strokeWeight(w * 0.3);
    arc(s, s, s * 2, s * 2, PI, PI + HALF_PI);

    // move to the next, smaller square
    translate(s * GOLDEN, 0);
    rotate(HALF_PI);
    s /= GOLDEN;
  }
  pop();
}