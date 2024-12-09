let playerScore = 0;
let computerScore = 0;

const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const outcomeEl = document.getElementById('outcome');
const scoreEl = document.getElementById('score');
const resetButton = document.getElementById('reset');

const choices = ['rock', 'paper', 'scissors'];

const getComputerChoice = () => {
    return choices[Math.floor(Math.random() * choices.length)];
};

const determineWinner = (playerChoice, computerChoice) => {
    if (playerChoice === computerChoice) return "It's a tie!";
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'scissors' && computerChoice === 'paper') ||
        (playerChoice === 'paper' && computerChoice === 'rock')
    ) {
        playerScore++;
        return "You Win!";
    } else {
        computerScore++;
        return "Computer Wins!";
    }
};

const updateUI = (playerChoice, computerChoice, result) => {
    playerChoiceEl.textContent = `You chose: ${playerChoice}`;
    computerChoiceEl.textContent = `Computer chose: ${computerChoice}`;
    outcomeEl.textContent = `Result: ${result}`;
    outcomeEl.className = result === "You Win!" ? "highlight" : "";
    scoreEl.textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
};


document.querySelectorAll('button').forEach(button => {
    if (button.id !== 'reset') {
        button.addEventListener('click', () => {
            const playerChoice = button.id;
            const computerChoice = getComputerChoice();
            const result = determineWinner(playerChoice, computerChoice);
            updateUI(playerChoice, computerChoice, result);
        });
    }
});

resetButton.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    updateUI('', '', '');
    playerChoiceEl.textContent = 'You chose: ';
    computerChoiceEl.textContent = 'Computer chose: ';
    outcomeEl.textContent = 'Result: ';
});