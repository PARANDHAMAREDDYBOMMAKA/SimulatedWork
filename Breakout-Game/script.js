const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = -2;
let yDirection = 2;

const userStart = [230, 10];
let currentPosition = userStart;

let balls = [
  {
    position: [270, 40],
    xDirection: -2,
    yDirection: 2,
    element: null,
  },
];
let timerId;
let score = 0;
let lives = 3;
let powerUps = [];
let gameRunning = true;

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    this.topLeft = [xAxis, yAxis + blockHeight];
  }
}

class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.element = document.createElement("div");
    this.element.classList.add("power-up");
    this.element.style.left = `${x}px`;
    this.element.style.bottom = `${y}px`;
    grid.appendChild(this.element);
  }
}

const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
];

function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}
addBlocks();

const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();

function drawBall(ball) {
  if (!ball.element) {
    ball.element = document.createElement("div");
    ball.element.classList.add("ball");
    grid.appendChild(ball.element);
  }
  ball.element.style.left = `${ball.position[0]}px`;
  ball.element.style.bottom = `${ball.position[1]}px`;
}

function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (currentPosition[0] < boardWidth - blockWidth) {
        currentPosition[0] += 10;
        drawUser();
      }
      break;
  }
}
document.addEventListener("keydown", moveUser);

function drawUser() {
  user.style.left = currentPosition[0] + "px";
  user.style.bottom = currentPosition[1] + "px";
}

function checkForCollisions() {
  balls.forEach((ball, ballIndex) => {
    blocks.forEach((block, index) => {
      if (
        ball.position[0] > block.bottomLeft[0] &&
        ball.position[0] < block.bottomRight[0] &&
        ball.position[1] + ballDiameter > block.bottomLeft[1] &&
        ball.position[1] < block.topLeft[1]
      ) {
        const allBlocks = Array.from(document.querySelectorAll(".block"));
        allBlocks[index].classList.remove("block");
        blocks.splice(index, 1);
        score++;
        scoreDisplay.innerHTML = `Score: ${score}`;

        if (blocks.length === 0) {
          endGame("You Win!");
        }
      }
    });

    if (
      ball.position[0] >= boardWidth - ballDiameter ||
      ball.position[0] <= 0
    ) {
      ball.xDirection = -ball.xDirection;
    }

    if (ball.position[1] >= boardHeight - ballDiameter) {
      ball.yDirection = -ball.yDirection;
    }

    if (
      ball.position[0] > currentPosition[0] &&
      ball.position[0] < currentPosition[0] + blockWidth &&
      ball.position[1] > currentPosition[1] &&
      ball.position[1] < currentPosition[1] + blockHeight
    ) {
      ball.yDirection = -ball.yDirection;
    }

    if (ball.position[1] <= 0) {
      lives--;
      if (lives === 0) {
        endGame("Game Over!");
      } else {
        ball.position = [270, 40];
      }
    }
  });
}

function moveBalls() {
  if (!gameRunning) return;
  balls.forEach((ball) => {
    ball.position[0] += ball.xDirection;
    ball.position[1] += ball.yDirection;
    drawBall(ball);
  });

  checkForCollisions();
}

timerId = setInterval(moveBalls, 30);

function endGame(message) {
  clearInterval(timerId);
  gameRunning = false;
  scoreDisplay.innerHTML = message;

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  restartBtn.classList.add("restart-btn");
  restartBtn.addEventListener("click", () => location.reload());
  document.body.appendChild(restartBtn);
}

function spawnMultipleBalls() {
  if (score % 15 === 0 && score !== 0 && balls.length < 3) {
    balls.push({
      position: [270, 40],
      xDirection: -2,
      yDirection: 2,
      element: null,
    });
  }
}

setInterval(() => {
  if (gameRunning) {
    moveBalls();
    spawnMultipleBalls();
  }
}, 30);
