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

  setInterval(addBall, ballAddRate);

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

  fill(0);
  textSize(32);
  text('Ball Count: ' + ballCount, 10, 40);
  text('Highscore: ' + highscore, 10, 80);

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
