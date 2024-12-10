const cardArray = [
  { name: "cheeseburger", img: "./images/cheeseburger.png" },
  { name: "fries", img: "./images/fries.png" },
  { name: "hotdog", img: "./images/hotdog.png" },
  { name: "ice-cream", img: "./images/ice-cream.png" },
  { name: "milkshake", img: "./images/milkshake.png" },
  { name: "pizza", img: "./images/pizza.png" },
  { name: "cheeseburger", img: "./images/cheeseburger.png" },
  { name: "fries", img: "./images/fries.png" },
  { name: "hotdog", img: "./images/hotdog.png" },
  { name: "ice-cream", img: "./images/ice-cream.png" },
  { name: "milkshake", img: "./images/milkshake.png" },
  { name: "pizza", img: "./images/pizza.png" },
];

let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let scoreDisplay = document.getElementById("result");
let gameBoard = document.getElementById("game-board");
let resetBtn = document.getElementById("reset-btn");
let congratsMessage = document.getElementById("congrats-message");

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  cardArray.sort(() => 0.5 - Math.random());

  for (let i = 0; i < cardArray.length; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-id", i);

    let cardImg = document.createElement("img");
    cardImg.setAttribute("src", "images/blank.png");
    cardImg.setAttribute("data-id", i);

    card.appendChild(cardImg);
    gameBoard.appendChild(card);

    card.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (cardsWon.length === cardArray.length / 2) return;

  let selectedCard = this;
  let cardId = selectedCard.getAttribute("data-id");
  selectedCard.querySelector("img").setAttribute("src", cardArray[cardId].img);

  cardsChosen.push(cardArray[cardId].name);
  cardsChosenId.push(cardId);

  if (cardsChosen.length === 2) {
    setTimeout(checkForMatch, 500);
  }
}

function checkForMatch() {
  const cards = document.querySelectorAll(".card img");
  const optionOneId = cardsChosenId[0];
  const optionTwoId = cardsChosenId[1];

  if (optionOneId === optionTwoId) {
    cards[optionOneId].setAttribute("src", "images/blank.png");
    cards[optionTwoId].setAttribute("src", "images/blank.png");
  } else if (cardsChosen[0] === cardsChosen[1]) {
    cards[optionOneId].setAttribute("src", "images/white.png");
    cards[optionTwoId].setAttribute("src", "images/white.png");
    cards[optionOneId].removeEventListener("click", flipCard);
    cards[optionTwoId].removeEventListener("click", flipCard);
    cardsWon.push(cardsChosen);
  } else {
    cards[optionOneId].setAttribute("src", "images/blank.png");
    cards[optionTwoId].setAttribute("src", "images/blank.png");
  }

  cardsChosen = [];
  cardsChosenId = [];
  scoreDisplay.textContent = cardsWon.length;

  if (cardsWon.length === cardArray.length / 2) {
    gameBoard.style.display = "none";
    congratsMessage.classList.remove("hidden");
    resetBtn.style.display = "block";
  }
}

resetBtn.addEventListener("click", () => {
  cardsChosen = [];
  cardsChosenId = [];
  cardsWon = [];
  scoreDisplay.textContent = 0;
  congratsMessage.classList.add("hidden");
  resetBtn.style.display = "none";
  gameBoard.style.display = "block";
  gameBoard.innerHTML = "";
  createBoard();
});

createBoard();
