// 1v1 Game Mode Logic
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (board[index] === '' && resultElement.innerText === '') {
            board[index] = currentPlayer;
            cell.innerText = currentPlayer;
            cell.style.color = playerColor;

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

// Check for win
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

// Disable the board
function disableBoard() {
    cells.forEach(cell => cell.style.pointerEvents = 'none');
}

// Send game result
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
    });
}
window.onload = fetchGameHistory;