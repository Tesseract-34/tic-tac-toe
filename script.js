let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
const cells = document.querySelectorAll('.cell');
const resultElement = document.getElementById('result');
const resetButton = document.getElementById('resetButton');
const gameHistory = document.getElementById('gameHistory');
const clearHistoryButton = document.getElementById('clearHistoryButton');
// Initialize event listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (board[index] === '' && resultElement.innerText === '') {
            board[index] = currentPlayer;
            cell.innerText = currentPlayer;
            if (checkWin()) {
                resultElement.innerText = `${currentPlayer} Wins!`;
                sendGameResult(`${currentPlayer} wins`);
                disableBoard();
            } else if (boardFull()) {
                resultElement.innerText = `Draw!`;
                sendGameResult('Draw');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    });
});

resetButton.addEventListener('click', resetGame);
clearHistoryButton.addEventListener('click', clearGameHistory);

// Check if the current player has won
function checkWin() {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winCombinations.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

// Check if the board is full
function boardFull() {
    return board.every(cell => cell !== '');
}

// Disable the board when the game is over
function disableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

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

// Send game result to the backend
function sendGameResult(result) {
    fetch('http://localhost:5000/submit_result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            player: currentPlayer,
            result: result,
            board: board
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        fetchGameHistory(); // Update game history after submitting the result
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Fetch game history from the backend
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Clear game history on the backend
function clearGameHistory() {
    fetch('http://localhost:5000/clear_history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('History cleared:', data);
        gameHistory.innerHTML = ''; // Clear the history in the frontend
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Fetch the game history when the page loads
window.onload = fetchGameHistory;
