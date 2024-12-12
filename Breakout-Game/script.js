document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".game-board");
  const ball = document.querySelector(".ball");
  const paddle = document.querySelector(".paddle");
  const scoreDisplay = document.getElementById("score");
  const restartButton = document.getElementById("restart-btn");

  let score = 0;
  let ballX = 0;
  let ballY = 0;
  let ballSpeedX = 1;
  let ballSpeedY = -3;
  let paddleX = 0;
  const paddleWidth = 100;
  const ballWidth = 20;
  const boardWidth = board.offsetWidth;
  const boardHeight = board.offsetHeight;
  let blocks = [];
  let gameLoop;

  function initializeGame() {
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    restartButton.style.display = "none";

    ballX = paddle.offsetLeft + paddleWidth / 2 - ballWidth / 2;
    ballY = paddle.offsetTop - ballWidth;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    paddleX = (boardWidth - paddleWidth) / 2;
    paddle.style.left = `${paddleX}px`;

    createBlocks();
    bindEvents();
  }

  function createBlocks() {
    const container = document.querySelector(".blocks-container");
    container.innerHTML = "";
    blocks = [];

    const rows = 5;
    const columns = 10;
    const blockWidth = 60;
    const blockHeight = 20;
    const padding = 5;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.width = `${blockWidth}px`;
        block.style.height = `${blockHeight}px`;
        block.style.left = `${col * (blockWidth + padding)}px`;
        block.style.top = `${row * (blockHeight + padding)}px`;
        container.appendChild(block);
        blocks.push(block);
      }
    }
  }

  function bindEvents() {
    window.addEventListener("keydown", movePaddle);
    window.addEventListener("mousemove", handleMouseMove);
  }

  function handleMouseMove(e) {
    const boardRect = board.getBoundingClientRect();
    const mouseX = e.clientX - boardRect.left;
    paddleX = Math.max(
      0,
      Math.min(mouseX - paddleWidth / 2, boardWidth - paddleWidth)
    );
    paddle.style.left = `${paddleX}px`;
  }

  function movePaddle(e) {
    if (e.key === "ArrowLeft" && paddleX > 0) {
      paddleX -= 20;
    }
    if (e.key === "ArrowRight" && paddleX < boardWidth - paddleWidth) {
      paddleX += 20;
    }
    paddle.style.left = `${paddleX}px`;
  }

  function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    checkWallCollision();
    checkPaddleCollision();
    checkBlockCollision();
    checkGameOver();
  }

  function checkWallCollision() {
    if (ballX <= 0 || ballX + ballWidth >= boardWidth) {
      ballSpeedX = -ballSpeedX;
    }
    if (ballY <= 0) {
      ballSpeedY = -ballSpeedY;
    }
  }

  function checkPaddleCollision() {
    const paddleRect = paddle.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();

    if (
      ballRect.bottom >= paddleRect.top &&
      ballRect.left >= paddleRect.left &&
      ballRect.right <= paddleRect.right
    ) {
      ballSpeedY = -Math.abs(ballSpeedY);

      let hitPosition = ballRect.left + ballWidth / 2 - paddleRect.left;
      let normalizedHitPosition = hitPosition / paddleWidth;
      let bounceAngle = (normalizedHitPosition * Math.PI) / 2 - Math.PI / 4;

      ballSpeedX = 5 * Math.sin(bounceAngle);
      ballSpeedY = -Math.abs(ballSpeedY);
    }
  }

  function checkBlockCollision() {
    blocks.forEach((block, index) => {
      const blockRect = block.getBoundingClientRect();
      const ballRect = ball.getBoundingClientRect();

      if (
        ballRect.bottom >= blockRect.top &&
        ballRect.top <= blockRect.bottom &&
        ballRect.right >= blockRect.left &&
        ballRect.left <= blockRect.right
      ) {
        block.remove();
        blocks.splice(index, 1);
        ballSpeedY = -ballSpeedY;

        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
      }
    });

    if (blocks.length === 0) {
      endGame(true);
    }
  }

  function checkGameOver() {
    if (ballY + ballWidth >= boardHeight) {
      endGame(false);
    }
  }

  function endGame(won) {
    clearInterval(gameLoop);
    window.removeEventListener("keydown", movePaddle);
    window.removeEventListener("mousemove", handleMouseMove);

    scoreDisplay.textContent = won ? "You Win!" : "Game Over!";
    restartButton.style.display = "block";
  }

  restartButton.addEventListener("click", () => {
    window.removeEventListener("keydown", movePaddle);
    window.removeEventListener("mousemove", handleMouseMove);
    clearInterval(gameLoop);
    initializeGame();
    startGame();
  });

  function startGame() {
    gameLoop = setInterval(moveBall, 16);
  }

  initializeGame();
  startGame();
});
