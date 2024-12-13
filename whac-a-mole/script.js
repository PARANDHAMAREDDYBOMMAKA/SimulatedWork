document.addEventListener("DOMContentLoaded", function () {
  const timeLeft = document.querySelector("#time-left");
  const score = document.querySelector("#score");
  const resetBtn = document.querySelector("#reset-btn");
  let result = 0;
  let hitPosition;
  let currentTime = 60;
  let timerId = null;
  let countDownTimerId = null;
  let moleImageLink =
    "https://raw.githubusercontent.com/Kalvium-Program/Image-files/refs/heads/main/mole.jpg";
  let bonusMoleImageLink =
    "https://raw.githubusercontent.com/Kalvium-Program/Image-files/refs/heads/main/mole.jpg";

  function createBoard() {
    const grid = document.querySelector(".grid");
    for (let i = 0; i < 9; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", i);
      grid.appendChild(square);
    }
  }

  function randomSquare() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
      square.classList.remove("mole", "bonus-mole");
      square.style.backgroundImage = "";
    });

    let randomSquare = squares[Math.floor(Math.random() * 9)];
    randomSquare.classList.add("mole");

    if (Math.random() < 0.1) {
      randomSquare.classList.add("bonus-mole");
      randomSquare.style.backgroundImage = `url(${bonusMoleImageLink})`;
      randomSquare.style.backgroundSize = "cover";
      hitPosition = randomSquare.id;
    } else {
      randomSquare.style.backgroundImage = `url(${moleImageLink})`;
      randomSquare.style.backgroundSize = "cover";
      hitPosition = randomSquare.id;
    }
  }

  function handleSquareClick() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
      square.addEventListener("mousedown", () => {
        if (square.id == hitPosition) {
          result++;
          score.textContent = result;
          hitPosition = null;

          if (result % 5 === 0) {
            adjustDifficulty();
          }
        }
      });
    });
  }

  function moveMole() {
    const randomTime = Math.floor(Math.random() * 500) + 500;
    timerId = setInterval(randomSquare, randomTime);
  }

  function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime == 0) {
      clearInterval(countDownTimerId);
      clearInterval(timerId);
      document.querySelector(".grid").style.display = "none";
      resetBtn.style.display = "inline";
      alert("GAME OVER! Your final score is " + result);
    }
  }

  function adjustDifficulty() {
    if (timerId) clearInterval(timerId);
    const newInterval = Math.max(300, 700 - Math.floor(result / 2) * 50);
    moveMole();
  }

  createBoard();
  handleSquareClick();
  moveMole();
  countDownTimerId = setInterval(countDown, 1000);

  resetBtn.addEventListener("click", () => {
    result = 0;
    currentTime = 60;
    score.textContent = result;
    timeLeft.textContent = currentTime;
    document.querySelector(".grid").style.display = "grid";
    resetBtn.style.display = "none";
    handleSquareClick();
    moveMole();
    countDownTimerId = setInterval(countDown, 1000);
  });
});
