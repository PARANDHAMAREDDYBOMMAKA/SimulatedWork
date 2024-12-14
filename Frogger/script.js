const timeLeftDisplay = document.querySelector("#time-left");
const resultDisplay = document.querySelector("#result");
const startPauseButton = document.querySelector("#start-pause-button");
const squares = document.querySelectorAll(".grid div");
const logsLeft = document.querySelectorAll(".log-left");
const logsRight = document.querySelectorAll(".log-right");
const carsLeft = document.querySelectorAll(".car-left");
const carsRight = document.querySelectorAll(".car-right");

let currentIndex = 80; // Initial frog position
const width = 12;
let timerId;
let outcomeTimerId;
let currentTime = 30;

function placeFrog() {
  squares[currentIndex]?.classList.add("frog"); // Set frog's initial position
}

function removeFrog() {
  squares[currentIndex]?.classList.remove("frog"); // Remove frog when it moves
}

function moveFrog(e) {
  removeFrog();
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
      if (currentIndex + width < width * width) currentIndex += width;
      break;
  }
  placeFrog();
}

function autoMoveElements() {
  currentTime--;
  timeLeftDisplay.textContent = currentTime;
  logsLeft.forEach(moveLogLeft);
  logsRight.forEach(moveLogRight);
  carsLeft.forEach(moveCarLeft);
  carsRight.forEach(moveCarRight);
}

function moveLogLeft(log) {
  if (log.classList.contains("l1")) {
    log.classList.remove("l1");
    log.classList.add("l2");
  } else if (log.classList.contains("l2")) {
    log.classList.remove("l2");
    log.classList.add("l3");
  } else if (log.classList.contains("l3")) {
    log.classList.remove("l3");
    log.classList.add("l4");
  } else if (log.classList.contains("l4")) {
    log.classList.remove("l4");
    log.classList.add("l5");
  } else if (log.classList.contains("l5")) {
    log.classList.remove("l5");
    log.classList.add("l1");
  }
}

function moveLogRight(log) {
  if (log.classList.contains("l1")) {
    log.classList.remove("l1");
    log.classList.add("l5");
  } else if (log.classList.contains("l5")) {
    log.classList.remove("l5");
    log.classList.add("l4");
  } else if (log.classList.contains("l4")) {
    log.classList.remove("l4");
    log.classList.add("l3");
  } else if (log.classList.contains("l3")) {
    log.classList.remove("l3");
    log.classList.add("l2");
  } else if (log.classList.contains("l2")) {
    log.classList.remove("l2");
    log.classList.add("l1");
  }
}

function moveCarLeft(car) {
  if (car.classList.contains("c1")) {
    car.classList.remove("c1");
    car.classList.add("c3");
  } else if (car.classList.contains("c3")) {
    car.classList.remove("c3");
    car.classList.add("c2");
  } else if (car.classList.contains("c2")) {
    car.classList.remove("c2");
    car.classList.add("c1");
  }
}

function moveCarRight(car) {
  if (car.classList.contains("c1")) {
    car.classList.remove("c1");
    car.classList.add("c2");
  } else if (car.classList.contains("c2")) {
    car.classList.remove("c2");
    car.classList.add("c3");
  } else if (car.classList.contains("c3")) {
    car.classList.remove("c3");
    car.classList.add("c1");
  }
}

function lose() {
  if (
    squares[currentIndex]?.classList.contains("c1") ||
    squares[currentIndex]?.classList.contains("l4") ||
    squares[currentIndex]?.classList.contains("l5") ||
    currentTime <= 0
  ) {
    resultDisplay.textContent = "You lose!";
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    document.removeEventListener("keyup", moveFrog);
  }
}

function win() {
  if (squares[currentIndex]?.classList.contains("ending-block")) {
    resultDisplay.textContent = "You Win!";
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    document.removeEventListener("keyup", moveFrog);
  }
}

function checkOutcomes() {
  lose();
  win();
}

startPauseButton.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    clearInterval(outcomeTimerId);
    timerId = null;
    outcomeTimerId = null;
    document.removeEventListener("keyup", moveFrog);
  } else {
    placeFrog(); // Ensure frog is placed at the correct starting position
    timerId = setInterval(autoMoveElements, 1200);
    outcomeTimerId = setInterval(checkOutcomes, 50);
    document.addEventListener("keyup", moveFrog);
  }
});
