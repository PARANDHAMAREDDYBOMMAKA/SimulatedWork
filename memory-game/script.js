const cardArray = {
  easy: [
    { name: "cheeseburger", img: "./images/cheeseburger.png" },
    { name: "fries", img: "./images/fries.png" },
    { name: "hotdog", img: "./images/hotdog.png" },
  ],
  medium: [
    { name: "cheeseburger", img: "./images/cheeseburger.png" },
    { name: "fries", img: "./images/fries.png" },
    { name: "hotdog", img: "./images/hotdog.png" },
    { name: "ice-cream", img: "./images/ice-cream.png" },
    { name: "milkshake", img: "./images/milkshake.png" },
    { name: "pizza", img: "./images/pizza.png" },
  ],
  hard: [
    { name: "cheeseburger", img: "./images/cheeseburger.png" },
    { name: "fries", img: "./images/fries.png" },
    { name: "hotdog", img: "./images/hotdog.png" },
    { name: "ice-cream", img: "./images/ice-cream.png" },
    { name: "milkshake", img: "./images/milkshake.png" },
    { name: "pizza", img: "./images/pizza.png" },
    { name: "burger", img: "./images/burger.png" },
    { name: "soda", img: "./images/soda.png" },
    { name: "sandwich", img: "./images/sandwich.png" },
  ],
};

class MemoryGame {
  constructor() {
    this.cardsChosen = [];
    this.cardsChosenId = [];
    this.cardsWon = [];
    this.timer = 0;
    this.timerInterval = null;

    // DOM Elements
    this.scoreDisplay = document.getElementById("result");
    this.gameBoard = document.getElementById("game-board");
    this.resetBtn = document.getElementById("reset-btn");
    this.congratsMessage = document.getElementById("congrats-message");
    this.timerDisplay = document.getElementById("timer");
    this.bestTimeDisplay = document.getElementById("best-time");
    this.difficultySelector = document.getElementById("difficulty");

    // Event Listeners
    this.resetBtn.addEventListener("click", () => this.resetGame());
    this.difficultySelector.addEventListener("change", () => this.resetGame());

    this.loadBestTime();
  }

  shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
  }

  createBoard() {
    const difficulty = this.difficultySelector.value;
    const currentCardArray = [
      ...cardArray[difficulty],
      ...cardArray[difficulty],
    ];
    this.shuffleArray(currentCardArray);

    // Dynamically set grid columns based on difficulty
    const columnMap = {
      easy: 3,
      medium: 4,
      hard: 6,
    };
    const columns = columnMap[difficulty];
    this.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    currentCardArray.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-id", index);
      cardElement.setAttribute("data-name", card.name);

      const cardInner = document.createElement("div");
      cardInner.classList.add("card-inner");

      const cardBack = document.createElement("div");
      cardBack.classList.add("card-back");
      const backImg = document.createElement("img");
      backImg.src = "images/blank.png";
      cardBack.appendChild(backImg);

      const cardFront = document.createElement("div");
      cardFront.classList.add("card-front");
      const frontImg = document.createElement("img");
      frontImg.src = card.img;
      cardFront.appendChild(frontImg);

      cardInner.appendChild(cardBack);
      cardInner.appendChild(cardFront);
      cardElement.appendChild(cardInner);

      cardElement.addEventListener("click", () => this.flipCard(cardElement));
      this.gameBoard.appendChild(cardElement);
    });

    this.startTimer();
  }

  flipCard(selectedCard) {
    if (
      this.cardsWon.length === cardArray[this.difficultySelector.value].length
    )
      return;

    const cardInner = selectedCard.querySelector(".card-inner");
    const cardId = selectedCard.getAttribute("data-id");
    const cardName = selectedCard.getAttribute("data-name");

    if (cardInner.classList.contains("flipped")) return;
    cardInner.classList.add("flipped");

    this.cardsChosen.push(cardName);
    this.cardsChosenId.push(cardId);

    if (this.cardsChosen.length === 2) {
      setTimeout(() => this.checkForMatch(), 1000);
    }
  }

  checkForMatch() {
    const cards = document.querySelectorAll(".card");
    const [optionOneId, optionTwoId] = this.cardsChosenId;

    const card1 = cards[optionOneId].querySelector(".card-inner");
    const card2 = cards[optionTwoId].querySelector(".card-inner");

    if (optionOneId === optionTwoId) {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    } else if (this.cardsChosen[0] === this.cardsChosen[1]) {
      cards[optionOneId].classList.add("matched");
      cards[optionTwoId].classList.add("matched");
      this.cardsWon.push(this.cardsChosen);
    } else {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }

    this.cardsChosen = [];
    this.cardsChosenId = [];
    this.scoreDisplay.textContent = this.cardsWon.length;

    const difficulty = this.difficultySelector.value;
    if (this.cardsWon.length === cardArray[difficulty].length) {
      this.endGame();
    }
  }

  startTimer() {
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimerDisplay();
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.timerDisplay.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.gameBoard.style.display = "none";
    this.congratsMessage.classList.remove("hidden");
    this.resetBtn.style.display = "block";
    this.updateBestTime();
  }

  resetGame() {
    clearInterval(this.timerInterval);
    this.cardsChosen = [];
    this.cardsChosenId = [];
    this.cardsWon = [];

    this.scoreDisplay.textContent = 0;
    this.timerDisplay.textContent = "00:00";
    this.congratsMessage.classList.add("hidden");
    this.resetBtn.style.display = "none";
    this.gameBoard.style.display = "grid";
    this.gameBoard.innerHTML = "";

    this.createBoard();
  }

  updateBestTime() {
    const difficulty = this.difficultySelector.value;
    const bestTime = localStorage.getItem(`bestTime_${difficulty}`);

    if (!bestTime || this.timer < parseInt(bestTime)) {
      localStorage.setItem(`bestTime_${difficulty}`, this.timer);
      this.loadBestTime();
    }
  }

  loadBestTime() {
    const difficulty = this.difficultySelector.value;
    const bestTime = localStorage.getItem(`bestTime_${difficulty}`);

    if (bestTime) {
      const minutes = Math.floor(bestTime / 60);
      const seconds = bestTime % 60;
      this.bestTimeDisplay.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      this.bestTimeDisplay.textContent = "--:--";
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const memoryGame = new MemoryGame();
  memoryGame.createBoard();
});
