// Player vs AI Game Mode Logic
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        console.log("Player clicked on cell:", index);
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
                currentPlayer = 'O';
                aiMove(); // AI plays next
            }
        }
    });
});

// AI Move
function aiMove() {
    console.log("AI is making a move...");
    const bestMove = getBestMove(board, currentPlayer, 0, -Infinity, Infinity);
    console.log("Best Move:", bestMove);

    if (bestMove && bestMove.index !== undefined) {
        const bestIndex = bestMove.index;
        board[bestIndex] = currentPlayer;

        const cell = cells[bestIndex];
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
            currentPlayer = 'X'; // Switch back to the player
        }
    } else {
        console.error("No valid move found for AI!");
    }
}

// Minimax Algorithm with Alpha-Beta Pruning
function getBestMove(board, player, depth, alpha, beta) {
    const opponent = player === 'O' ? 'X' : 'O';
    const emptyCells = board.map((value, index) => (value === '' ? index : null)).filter(index => index !== null);

    // Base case: check for terminal states
    if (checkWinForPlayer(board, 'O')) return { score: 10 - depth };  // AI wins
    if (checkWinForPlayer(board, 'X')) return { score: depth - 10 }; // Player wins
    if (emptyCells.length === 0) return { score: 0 };                // Draw

    // Depth limitation for faster response
    const maxDepth = 6; // Can adjust this value to balance speed and intelligence
    if (depth >= maxDepth) {
        return { score: 0 }; // Neutral evaluation at depth limit
    }

    // Recursive case: explore possible moves
    const moves = [];
    for (const index of emptyCells) {
        const newBoard = [...board];
        newBoard[index] = player; // Simulate the move

        const result = getBestMove(newBoard, opponent, depth + 1, alpha, beta); // Recursively evaluate
        moves.push({ index, score: result.score });

        // Alpha-Beta Pruning
        if (player === 'O') {
            alpha = Math.max(alpha, result.score);
            if (beta <= alpha) break; // Prune the branch
        } else {
            beta = Math.min(beta, result.score);
            if (beta <= alpha) break; // Prune the branch
        }
    }

    // Choose the best move for the current player
    let bestMove;
    if (player === 'O') {
        // Maximize AI's score
        let maxScore = -Infinity;
        for (const move of moves) {
            if (move.score > maxScore) {
                maxScore = move.score;
                bestMove = move;
            }
        }
    } else {
        // Minimize Player's score
        let minScore = Infinity;
        for (const move of moves) {
            if (move.score < minScore) {
                minScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// Check if a specific player has won (helper for Minimax)
function checkWinForPlayer(board, player) {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

// General Check for Win (for the current game state)
function checkWin() {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winCombinations.some(combination =>
        combination.every(index => board[index] === currentPlayer)
    );
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

window.onload = fetchGameHistory();