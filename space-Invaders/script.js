const grid = document.querySelector("#grid");
const resultDisplay = document.querySelector("#result-display");
const restartBtn = document.querySelector("#restart-btn");
const width = 15;
const squares = [];

let currentShooterIndex = 202;
let results = 0;
let level = 1;
let invadersId;
let bossInvader = false;

let alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29,
];
const aliensRemoved = [];
const invaderTypes = ["standard", "zigzag"];

function createGrid() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }
}

function resetGame() {
  squares.forEach((square) =>
    square.classList.remove(
      "invader",
      "shooter",
      "laser",
      "boom",
      "boss",
      "zigzag",
      "standard"
    )
  );
  alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29,
  ];
  aliensRemoved.length = 0;
  currentShooterIndex = 202;
  results = 0;
  level = 1;
  bossInvader = false;
  resultDisplay.innerHTML = results;
  drawInvaders();
  invadersId = setInterval(moveInvaders, 500);
  restartBtn.style.display = "none";
}

function drawInvaders() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      const invader = squares[alienInvaders[i]];
      if (invader) invader.classList.add("invader");
      if (Math.random() > 0.5) invader.classList.add(invaderTypes[0]);
    }
  }

  if (bossInvader) {
    const boss = squares[alienInvaders[0] + 7];
    if (boss) boss.classList.add("invader", "boss");
  }
}

function removeInvaders() {
  for (let i = 0; i < alienInvaders.length; i++) {
    const invader = squares[alienInvaders[i]];
    if (invader) invader.classList.remove("invader", "zigzag", "standard");
  }
  if (bossInvader) {
    const boss = squares[alienInvaders[0] + 7];
    if (boss) boss.classList.remove("invader", "boss");
  }
}

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;

  removeInvaders();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
    if (
      squares[alienInvaders[i]] &&
      squares[alienInvaders[i]].classList.contains("zigzag")
    ) {
      alienInvaders[i] += i % 2 === 0 ? width : -width;
    }
  }

  drawInvaders();

  if (
    squares[currentShooterIndex] &&
    (squares[currentShooterIndex].classList.contains("invader") ||
      squares[currentShooterIndex].classList.contains("boss"))
  ) {
    gameOver();
  }

  if (aliensRemoved.length === alienInvaders.length) {
    if (bossInvader) {
      levelUp();
    } else {
      startBossFight();
    }
  }
}

function gameOver() {
  resultDisplay.innerHTML = "GAME OVER";
  clearInterval(invadersId);
  restartBtn.style.display = "block";
  document.removeEventListener("keydown", moveShooter);
  document.removeEventListener("keydown", shoot);
}

function levelUp() {
  level++;
  results += 10;
  resultDisplay.innerHTML = `LEVEL ${level}`;
  alienInvaders = [];
  for (let i = 0; i < 30; i++) {
    alienInvaders.push(i + level * 30);
  }
  aliensRemoved.length = 0;
  createGrid();
  drawInvaders();
  invadersId = setInterval(moveInvaders, 500 - level * 50);
}

function startBossFight() {
  bossInvader = true;
  invadersId = setInterval(moveInvaders, 500 - level * 50);
}

createGrid();

squares[currentShooterIndex].classList.add("shooter");

let direction = 1;
let goingRight = true;
invadersId = setInterval(moveInvaders, 500);

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");

  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }

  squares[currentShooterIndex].classList.add("shooter");
}

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;

    if (currentLaserIndex < 0) {
      clearInterval(laserId);
      return;
    }

    squares[currentLaserIndex].classList.add("laser");

    if (
      squares[currentLaserIndex] &&
      (squares[currentLaserIndex].classList.contains("invader") ||
        squares[currentLaserIndex].classList.contains("boss"))
    ) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.remove("boss");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);

      results++;
      resultDisplay.innerHTML = results;
    }
  }

  if (e.key === "ArrowUp") {
    laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", moveShooter);
document.addEventListener("keydown", shoot);
restartBtn.addEventListener("click", () => {
  restartBtn.style.display = "none";
  resetGame();
});
resetGame();
