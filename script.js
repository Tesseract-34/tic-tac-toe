let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let playerColor = '#00ffff';

const cells = document.querySelectorAll('.cell');
const resultElement = document.getElementById('result');
const resetButton = document.getElementById('resetButton');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const gameHistory = document.getElementById('gameHistory');
const colorPicker = document.getElementById('colorPicker');
const welcomePopup = document.getElementById('welcomePopup');
const modeSelection = document.getElementById('modeSelection');
const container = document.querySelector('.container');
const startGameButton = document.getElementById('startGameButton');
const playerVsPlayer = document.getElementById('playerVsPlayer');
const playerVsAI = document.getElementById('playerVsAI');

// Show welcome popup
startGameButton.addEventListener('click', () => {
    welcomePopup.classList.add('hidden');
    modeSelection.classList.remove('hidden');
});

// Select game mode
playerVsPlayer.addEventListener('click', () => {
    modeSelection.classList.add('hidden');
    container.classList.remove('hidden');
    loadScript('1v1.js');
});

playerVsAI.addEventListener('click', () => {
    modeSelection.classList.add('hidden');
    container.classList.remove('hidden');
    loadScript('player-vs-ai.js');
});

// Color Picker
colorPicker.addEventListener('input', (e) => {
    playerColor = e.target.value;
    cells.forEach(cell => cell.style.color = playerColor);
});

// Load specific game mode script dynamically
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

// Fetch game history
function fetchGameHistory() {
    fetch('http://localhost:5000/get_results')
        .then(response => response.json())
        .then(data => {
            gameHistory.innerHTML = '';
            data.forEach((game, index) => {
                const li = document.createElement('li');
                li.textContent = `Game ${index + 1}: ${game.result}`;
                gameHistory.appendChild(li);
            });
        });
}

// Clear game history
function clearGameHistory() {
    fetch('http://localhost:5000/clear_history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(() => {
        gameHistory.innerHTML = '';
    });
}

// Reset button event
resetButton.addEventListener('click', resetGame);
clearHistoryButton.addEventListener('click', clearGameHistory);

// Reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.pointerEvents = 'auto';
    });
    resultElement.innerText = '';
    currentPlayer = 'X';
}

// Window load actions
window.onload = fetchGameHistory();
