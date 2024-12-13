let playerScore = 0;
let computerScore = 0;
let ties = 0;

const playerChoiceEl = document.getElementById("player-choice");
const computerChoiceEl = document.getElementById("computer-choice");
const outcomeEl = document.getElementById("outcome");
const scoreEl = document.getElementById("score");
const tiesEl = document.getElementById("ties");
const resetButton = document.getElementById("reset");

// Sound elements
const winSound = document.getElementById("win-sound");
const loseSound = document.getElementById("lose-sound");
const tieSound = document.getElementById("tie-sound");

const choices = ["rock", "paper", "scissors"];

const getComputerChoice = () => {
  return choices[Math.floor(Math.random() * choices.length)];
};

const determineWinner = (playerChoice, computerChoice) => {
  if (playerChoice === computerChoice) {
    ties++;
    tieSound.play();
    return "It's a tie!";
  }
  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "scissors" && computerChoice === "paper") ||
    (playerChoice === "paper" && computerChoice === "rock")
  ) {
    playerScore++;
    winSound.play();
    return "You Win!";
  } else {
    computerScore++;
    loseSound.play();
    return "Computer Wins!";
  }
};

const updateUI = (playerChoice, computerChoice, result) => {
  playerChoiceEl.textContent = `You chose: ${playerChoice}`;
  computerChoiceEl.textContent = `Computer chose: ${computerChoice}`;
  outcomeEl.textContent = `Result: ${result}`;
  outcomeEl.className = result === "You Win!" ? "highlight" : "";
  scoreEl.textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
  tiesEl.textContent = `Ties: ${ties}`;
};

document.querySelectorAll("button").forEach((button) => {
  if (button.id !== "reset") {
    button.addEventListener("click", () => {
      const playerChoice = button.id;
      const computerChoice = getComputerChoice();
      const result = determineWinner(playerChoice, computerChoice);
      updateUI(playerChoice, computerChoice, result);
    });
  }
});

resetButton.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  ties = 0;
  updateUI("", "", "");
  playerChoiceEl.textContent = "You chose: ";
  computerChoiceEl.textContent = "Computer chose: ";
  outcomeEl.textContent = "Result: ";
});
