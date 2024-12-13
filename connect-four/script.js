const gameBoard = document.getElementById("game-board");
const currentPlayerDisplay = document.getElementById("current-player");
const resetButton = document.getElementById("reset-button");

let currentPlayer = "player-one";
let squares = [];
const width = 7;
const height = 6;

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const square = document.createElement("div");
    square.classList.add("grid-cell");
    square.setAttribute("data-index", i);
    gameBoard.appendChild(square);
    squares.push(square);
  }
}

function checkBoard() {
  const winningArrays = [
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
    [7, 8, 9, 10],
    [8, 9, 10, 11],
    [9, 10, 11, 12],
    [10, 11, 12, 13],
    [14, 15, 16, 17],
    [15, 16, 17, 18],
    [16, 17, 18, 19],
    [17, 18, 19, 20],
    [21, 22, 23, 24],
    [22, 23, 24, 25],
    [23, 24, 25, 26],
    [24, 25, 26, 27],
    [28, 29, 30, 31],
    [29, 30, 31, 32],
    [30, 31, 32, 33],
    [31, 32, 33, 34],
    [35, 36, 37, 38],
    [36, 37, 38, 39],
    [37, 38, 39, 40],
    [38, 39, 40, 41],
    [0, 7, 14, 21],
    [1, 8, 15, 22],
    [2, 9, 16, 23],
    [3, 10, 17, 24],
    [4, 11, 18, 25],
    [5, 12, 19, 26],
    [6, 13, 20, 27],
    [7, 14, 21, 28],
    [8, 15, 22, 29],
    [9, 16, 23, 30],
    [10, 17, 24, 31],
    [11, 18, 25, 32],
    [12, 19, 26, 33],
    [13, 20, 27, 34],
    [14, 21, 28, 35],
    [15, 22, 29, 36],
    [16, 23, 30, 37],
    [17, 24, 31, 38],
    [18, 25, 32, 39],
    [19, 26, 33, 40],
    [20, 27, 34, 41],
    [0, 8, 16, 24],
    [1, 9, 17, 25],
    [2, 10, 18, 26],
    [3, 11, 19, 27],
    [7, 15, 23, 31],
    [8, 16, 24, 32],
    [9, 17, 25, 33],
    [10, 18, 26, 34],
    [14, 22, 30, 38],
    [15, 23, 31, 39],
    [16, 24, 32, 40],
    [17, 25, 33, 41],
    [3, 9, 15, 21],
    [4, 10, 16, 22],
    [5, 11, 17, 23],
    [6, 12, 18, 24],
    [10, 16, 22, 28],
    [11, 17, 23, 29],
    [12, 18, 24, 30],
    [13, 19, 25, 31],
  ];

  for (let combo of winningArrays) {
    const [a, b, c, d] = combo;
    if (
      squares[a].classList.contains("player-one") &&
      squares[b].classList.contains("player-one") &&
      squares[c].classList.contains("player-one") &&
      squares[d].classList.contains("player-one")
    ) {
      alert("Player One Wins!");
      resetGame();
      return;
    }
    if (
      squares[a].classList.contains("player-two") &&
      squares[b].classList.contains("player-two") &&
      squares[c].classList.contains("player-two") &&
      squares[d].classList.contains("player-two")
    ) {
      alert("Player Two Wins!");
      resetGame();
      return;
    }
  }

  const isBoardFull = squares.every(
    (square) =>
      square.classList.contains("player-one") ||
      square.classList.contains("player-two")
  );

  if (isBoardFull) {
    alert("Draw! The board is full.");
    resetGame();
  }
}

function addPiece(event) {
  const clickedColumn = event.target.getAttribute("data-index") % width;

  for (let row = height - 1; row >= 0; row--) {
    const index = row * width + clickedColumn;
    const square = squares[index];

    if (
      !square.classList.contains("player-one") &&
      !square.classList.contains("player-two")
    ) {
      square.classList.add(currentPlayer);

      checkBoard();

      currentPlayer =
        currentPlayer === "player-one" ? "player-two" : "player-one";
      currentPlayerDisplay.textContent = `Current Player: ${
        currentPlayer === "player-one" ? "Player One" : "Player Two"
      }`;

      break;
    }
  }
}

function resetGame() {
  squares.forEach((square) => {
    square.classList.remove("player-one", "player-two");
  });
  currentPlayer = "player-one";
  currentPlayerDisplay.textContent = "Current Player: Player One";
}

createBoard();
gameBoard.addEventListener("click", addPiece);
resetButton.addEventListener("click", resetGame);