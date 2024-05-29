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
    fill(225, 225, 225, 240);
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
    achievementsPanelOpened = false;
  } else if (!shopOpened && achievementsPanelOpened) {
    displayAchievements();
    shopOpened = false;
    gachaShop = false;
    // Draw the achievements panel content here...
  } else if (!shopOpened && !achievementsPanelOpened) {
    shopOpened = false;
    gachaShop = false;
  }

  
  textSize(32);
  fill(0);
  noStroke();
  if (shopOpened && !achievementsPanelOpened) {
    text('Exit Shop', 27, 40);
    noFill();
    stroke(5);
    rect(22, 8, textWidth('Exit Shop') + 10,42)
    fill(0);
    noStroke();
  } else if (achievementsPanelOpened && !shopOpened) {
    text('Exit Achievements', 27, 40);
    noFill();
    stroke(5);
    rect(22, 8, textWidth('Exit Achievements') + 10,42)
    fill(0);
    noStroke();
  }
  else if (!shopOpened && !achievementsPanelOpened) {
    text('Shop', 27, 40);
    text('Achievements', 27 + textWidth("Shop") + 25, 40);
    noFill();
    stroke(5);
    rect(22, 8, textWidth('Shop') + 10,42)
    rect(22 + textWidth("Shop") + 25, 8, textWidth('Achievements') + 10,42)
    fill(0);
    noStroke();
    text('Highscore: ' + highscore, 20, 120);
  }
  text('Ball Count: ' + ballCount, 20, 80);


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
  if (!shopOpened && mouseX > 15 && mouseX < 10 + 25 + textWidth('Shop') && mouseY > 10 && mouseY < 50) {
      openShop();
  } else if (shopOpened && mouseX > 15 && mouseX < 10 + 50 + textWidth('Exit Shop') && mouseY > 10 && mouseY < 50) {
      closeShop();
  } else if (shopOpened && mouseX > (width / 5) - 50 && mouseX < (width / 5) + 50 + textWidth('Open Gacha') && mouseY > 100 && mouseY < 150) {
      openGacha();
  } else if (shopOpened && mouseX > ((width / 5) * 3) - 50 && mouseX < ((width / 5) * 3) + 50 + textWidth('Current Skins') && mouseY > 100 && mouseY < 150) {
      currentSkins();
  } else if (shopOpened && gachaShop && mouseX > 20 && mouseX < 20 + 200 && mouseY > 55 + (height / 10) * 2 && mouseY < 55 + (height / 10) * 6 + 40) {
      rollGacha();
  } else if (shopOpened && gachaShop && mouseX > 240 && mouseX < 240 + 200 && mouseY > 55 + (height / 10) * 2 && mouseY < 55 + (height / 10) * 6 + 40) {
      rollGachaMultiple();
  } else if (shopOpened && !gachaShop) {
      let horizontalSpacing = 160; // Space between items horizontally
      let verticalSpacing = 110; // Space between items vertically
      let itemsPerRow = floor(width / horizontalSpacing); // Calculate how many items can fit per row

      for (let i = 0; i < obtainedItems.length; i++) {
          let item = obtainedItems[i];

          let col = i % itemsPerRow;
          let row = floor(i / itemsPerRow);

          let posX = 80 + col * horizontalSpacing;
          let posY = 200 + row * verticalSpacing - scrollY;

          if (mouseX > posX - item.size * 3.72 && mouseX < posX + item.size * 3.72 &&
              mouseY > posY - item.size * 2 && mouseY < posY + item.size * 3) {
              ballColor = obtainedItems[i].color;
              ballSize = obtainedItems[i].size;

              ballAddRate = obtainedItems[i].ballAddRate || 1000;
              clearInterval(gachaInterval);
              gachaInterval = setInterval(addBall, ballAddRate);

              selectedItemIndex = i; // Update the selected item index
              saveObtainedItems(); // Save the obtained items

              break;
          }
      }
  } else if (!achievementsPanelOpened && mouseX > 27 + textWidth("Shop") + 25 && mouseX < 27 + textWidth("Shop") + 25 + textWidth("Achievements") && mouseY > 10 && mouseY < 50) {
    achievementsPanelOpened = true; // Open the achievements panel
    shopOpened = false;
    gachaShop = false;
  } else if (achievementsPanelOpened && mouseX > 0 && mouseX < 27 + textWidth("Exit Achievements") && mouseY > 10 && mouseY < 50) {
    achievementsPanelOpened = false; // Close the achievements panel
    shopOpened = false;
    gachaShop = false;
  }
}

let scrollY = 0; // Initial scroll position
let mouseWheelDelta = 0;
function mouseWheel(event) {
  mouseWheelDelta = event.deltaY;
  scrollY += mouseWheelDelta * 0.1; // Adjust scroll speed as needed
  return false; // Prevent default behavior
}