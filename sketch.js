/*
  Author: Wong Zheng Jie
  Email: wzhengjie99@gmail.com
  Date: 21-05-2024
  Version: 0.02
*/


let Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composite = Matter.Composite;

let engine;
let world;
let balls = [];
let ballSize = 20;
let ballColor = [255, 0, 0];
let ballAddRate = 1000; // 1000 = 1 ball per second
let ballCount = 0;
let maxBalls;
let boundaries = [];
let highscore = 0;

async function setup() {
  await loadObtainedItems();
  createCanvas(windowWidth - 20, windowHeight - 20);

  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);

  // Add static boundaries
  boundaries.push(Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }));
  boundaries.push(Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true }));

  World.add(world, boundaries);

  maxBalls = (width * height) / (PI * ballSize * ballSize * 2); // Adjust as needed for density

  highscore = await window.api.getHighscore();
}

function draw() {
  background(255);

  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    let pos = ball.position;

    fill(ballColor);
    noStroke();
    ellipse(pos.x, pos.y, ballSize * 2);

    // Remove balls that go off the screen (unlikely with walls)
    if (pos.y > height + ballSize) {
      World.remove(world, ball);
      balls.splice(i, 1);
    }
  }

  if (shopOpened) {
    // Draw the grey rectangle to cover the canvas
    fill(225, 225, 225, 240); // Grey color with some transparency
    noStroke();
    rect(0, 0, width, height);

    // red gacha shop nav bar
    fill(255, 0, 0);
    noStroke();
    rect(10, 100, width - 20, 50);

    // Draw the store content here...

    textSize(32);
    if (gachaShop) {
      openGacha();

    } else {
      currentSkins();
    }
  }

  fill(0);
  textSize(32);
  noStroke();
  if (shopOpened) {
    text('Exit Shop', 10, 40);
  }
  else {
    text('Shop', 10, 40);
    text('Highscore: ' + highscore, 10, 120);
  }
  text('Ball Count: ' + ballCount, 10, 80);


  if (ballCount > highscore) {
    highscore = ballCount;
    window.api.setHighscore(highscore);
  }

}

function addBall() {
  if (balls.length >= maxBalls) {
    removeOldestBall();
  }

  let ball = Bodies.circle(random(ballSize, width - ballSize), 0, ballSize);
  World.add(world, ball);
  balls.push(ball);
  ballCount++;
}

function removeOldestBall() {
  if (balls.length > 0) {
    let oldestBall = balls[0];
    World.remove(world, oldestBall);
    balls.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 20, windowHeight - 20);

  // Remove existing boundaries
  for (let boundary of boundaries) {
    World.remove(world, boundary);
  }

  // Add new boundaries
  boundaries = [];
  boundaries.push(Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true }));
  boundaries.push(Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true }));
  boundaries.push(Bodies.rectangle(width / 2, -50, width, 100, { isStatic: true }));

  World.add(world, boundaries);
}

function mouseClicked() {
  if (!shopOpened && mouseX > 10 && mouseX < 10 + 50 + textWidth('Shop') && mouseY > 20 && mouseY < 60) {
    openShop();
  } else if (shopOpened && mouseX > 10 && mouseX < 10 + 50 + textWidth('Exit Shop') && mouseY > 20 && mouseY < 60) {
    closeShop();
  } else if (shopOpened && mouseX > (width / 5) - 50 && mouseX < (width / 5) + 50 + textWidth('Open Gacha') && mouseY > 100 && mouseY < 150) {
    openGacha();
  } else if (shopOpened && mouseX > ((width / 5) * 3) - 50 && mouseX < ((width / 5) * 3) + 50 + textWidth('Current Skins') && mouseY > 100 && mouseY < 150) {
    currentSkins();
  } else if (shopOpened && gachaShop && mouseX > 20 && mouseX < 20 + 200 && mouseY > 55 + (height / 10) * 2 && mouseY < 55 + (height / 10) * 2 + (height / 10) * 6 + 40) {
    rollGacha();
  } else if (shopOpened && !gachaShop) {
    // Check if the mouse is clicked on an obtained item
    let horizontalSpacing = 160; // Space between items horizontally
    let verticalSpacing = 110; // Space between items vertically
    let itemsPerRow = floor(width / horizontalSpacing); // Calculate how many items can fit per row

    for (let i = 0; i < obtainedItems.length; i++) {
      let item = obtainedItems[i];

      // Calculate row and column for current item
      let col = i % itemsPerRow;
      let row = floor(i / itemsPerRow);

      // Calculate position considering row, column, and scroll
      let posX = 80 + col * horizontalSpacing;
      let posY = 200 + row * verticalSpacing - scrollY;

      // Check if the mouse is within the bounds of the item's rectangle
      if (mouseX > posX - item.size * 3.72 && mouseX < posX + item.size * 3.72 &&
        mouseY > posY - item.size * 2 && mouseY < posY + item.size * 3) {
        // Switch to the selected item
        ballColor = obtainedItems[i].color;
        ballSize = obtainedItems[i].size;

        // Update ballAddRate and gachaInterval based on obtained item
        ballAddRate = obtainedItems[i].ballAddRate || 1000; // Default value is 1000 if not specified
        clearInterval(gachaInterval);
        gachaInterval = setInterval(addBall, ballAddRate);

        selectedItemIndex = i; // Update the selected item index
        saveObtainedItems(); // Save the obtained items

        break;
      }
    }
  }
}


let scrollY = 0; // Initial scroll position
let mouseWheelDelta = 0;
function mouseWheel(event) {
  mouseWheelDelta = event.deltaY;
  scrollY += mouseWheelDelta * 0.1; // Adjust scroll speed as needed
  return false; // Prevent default behavior
}