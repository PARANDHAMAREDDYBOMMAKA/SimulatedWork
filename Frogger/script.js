document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const startBtn = document.getElementById("start-btn");
  const timerDisplay = document.getElementById("timer");

  const width = 10;
  const gridSize = width * width;
  let squares = [];
  let currentIndex = 99;
  let gameInterval;
  let timerInterval;
  let timeLeft = 20;
  let isGameRunning = false;

  function createGrid() {
    grid.innerHTML = "";
    squares = [];
    currentIndex = 99;

    for (let i = 0; i < gridSize; i++) {
      const square = document.createElement("div");

      if (i >= 90 && i < 100) square.classList.add("starting-block");
      if (i >= 0 && i < 10) square.classList.add("ending-block");

      grid.appendChild(square);
      squares.push(square);
    }

    squares[currentIndex].classList.add("frog");
  }

  function moveFrog(e) {
    if (!isGameRunning) return;

    squares[currentIndex].classList.remove("frog");

    switch (e.key) {
      case "ArrowLeft":
        if (currentIndex % width !== 0) currentIndex -= 1;
        break;
      case "ArrowRight":
        if (currentIndex % width < width - 1) currentIndex += 1;
        break;
      case "ArrowUp":
        if (currentIndex - width >= 0) currentIndex -= width;
        break;
      case "ArrowDown":
        if (currentIndex + width < gridSize) currentIndex += width;
        break;
    }

    squares[currentIndex].classList.add("frog");
    checkGameStatus();
  }

  function addObstacle(type, className) {
    const randomIndex = Math.floor(Math.random() * gridSize);
    squares[randomIndex].classList.add(type, className);
  }

  function moveElements() {
    moveCarLeft();
    moveCarRight();
    moveLogLeft();
    moveLogRight();
  }

  function moveCarLeft() {
    const cars = squares.filter((square) => square.classList.contains("car"));
    cars.forEach((car) => {
      const index = squares.indexOf(car);
      car.classList.remove("car");

      let newIndex = index - 1;
      if (newIndex % width === width - 1) newIndex += width;

      squares[newIndex].classList.add("car");
    });
  }

  function moveCarRight() {
    const cars = squares.filter((square) => square.classList.contains("car"));
    cars.forEach((car) => {
      const index = squares.indexOf(car);
      car.classList.remove("car");

      let newIndex = index + 1;
      if (newIndex % width === 0) newIndex -= width;

      squares[newIndex].classList.add("car");
    });
  }

  function moveLogLeft() {
    const logs = squares.filter((square) => square.classList.contains("log"));
    logs.forEach((log) => {
      const index = squares.indexOf(log);
      log.classList.remove("log");

      let newIndex = index - 1;
      if (newIndex % width === width - 1) newIndex += width;

      squares[newIndex].classList.add("log");
    });
  }

  function moveLogRight() {
    const logs = squares.filter((square) => square.classList.contains("log"));
    logs.forEach((log) => {
      const index = squares.indexOf(log);
      log.classList.remove("log");

      let newIndex = index + 1;
      if (newIndex % width === 0) newIndex -= width;

      squares[newIndex].classList.add("log");
    });
  }

  function checkGameStatus() {
    if (!isGameRunning) return;

    const currentSquare = squares[currentIndex];

    if (currentSquare.classList.contains("ending-block")) {
      endGame(true);
      return;
    }

    const hitByCar = currentSquare.classList.contains("car");
    const hitByLog = currentSquare.classList.contains("log");
    const notOnLog = squares
      .filter(
        (square) =>
          square.classList.contains("water") &&
          !square.classList.contains("log")
      )
      .includes(currentSquare);

    if (hitByCar || hitByLog || notOnLog || timeLeft <= 0) {
      endGame(false);
    }
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      if (!isGameRunning) {
        clearInterval(timerInterval);
        return;
      }

      timeLeft--;
      timerDisplay.textContent = `Time Left: ${timeLeft}`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame(false);
      }
    }, 1000);
  }

  function startGame() {
    if (isGameRunning) return;

    isGameRunning = true;
    timeLeft = 20;
    timerDisplay.textContent = `Time Left: ${timeLeft}`;

    document.addEventListener("keydown", moveFrog);
    startTimer();

    gameInterval = setInterval(() => {
      if (!isGameRunning) {
        clearInterval(gameInterval);
        return;
      }

      if (Math.random() < 0.3) addObstacle("car", "road");
      if (Math.random() < 0.3) addObstacle("log", "water");

      moveElements();
      checkGameStatus();
    }, 500);
  }

  function pauseGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    document.removeEventListener("keydown", moveFrog);
  }

  function endGame(won) {
    if (!isGameRunning) return;

    isGameRunning = false;
    document.removeEventListener("keydown", moveFrog);
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    if (won) {
      alert("Congratulations! You won!");
    } else {
      alert("Game Over! Try again.");
    }
  }

  startBtn.addEventListener("click", () => {
    if (isGameRunning) {
      pauseGame();
    } else {
      createGrid();
      startGame();
    }
  });

  createGrid();
});
