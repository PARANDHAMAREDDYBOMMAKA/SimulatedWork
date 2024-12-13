const grid = document.querySelector('#grid');
const resultDisplay = document.querySelector('#result-display');
const width = 15;
const squares = [];

let currentShooterIndex = 202;
let results = 0;

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29
];
const aliensRemoved = [];

function createGrid() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);
    }
}

function drawInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');
        }
    }
}

function removeInvaders() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader');
    }
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    
    removeInvaders();

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    drawInvaders();

    if (squares[currentShooterIndex].classList.contains('invader')) {
        resultDisplay.innerHTML = 'GAME OVER';
        clearInterval(invadersId);
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = 'YOU WIN';
        clearInterval(invadersId);
    }
}

createGrid();

squares[currentShooterIndex].classList.add('shooter');

let direction = 1;
let goingRight = true;
let invadersId = setInterval(moveInvaders, 500);

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    
    squares[currentShooterIndex].classList.add('shooter');
}

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);

            results++;
            resultDisplay.innerHTML = results;
        }
    }

    if (e.key === 'ArrowUp') {
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', moveShooter);
document.addEventListener('keydown', shoot);

drawInvaders();