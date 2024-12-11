document.addEventListener("DOMContentLoaded", function () {
  const timeLeft = document.querySelector("#time-left");
  const score = document.querySelector("#score");
  const resetBtn = document.querySelector("#reset-btn");
  let result = 0;
  let hitPosition;
  let currentTime = 60;
  let timerId = null;
  let countDownTimerId = null;

  const moleImageLink =
    "https://raw.githubusercontent.com/Kalvium-Program/Image-files/refs/heads/main/mole.jpg";

  function createBoard() {
    const grid = document.querySelector(".grid");
    for (let i = 0; i < 9; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.setAttribute("id", i);
      grid.appendChild(square);
    }
    // console.log("Squares created:", grid);
  }

  function randomSquare() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
      square.classList.remove("mole");
      square.style.backgroundImage = "";
    });

    let randomSquare = squares[Math.floor(Math.random() * 9)];
    randomSquare.classList.add("mole");

    // console.log("Random square selected:", randomSquare);

    randomSquare.style.backgroundImage = `url(${moleImageLink})`;
    randomSquare.style.backgroundSize = "cover";

    hitPosition = randomSquare.id;
  }

  function handleSquareClick() {
    const squares = document.querySelectorAll(".square");

    squares.forEach((square) => {
      square.addEventListener("mousedown", () => {
        if (square.id == hitPosition) {
          result++;
          score.textContent = result;
          hitPosition = null;
        }
      });
    });
  }

  function moveMole() {
    timerId = setInterval(randomSquare, 700);
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
