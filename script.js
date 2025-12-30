let mode = '', player1 = '', player2 = '', currentPlayer = 'X', gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

function showInputScreen(selectedMode) {
    mode = selectedMode;
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('input-screen').classList.remove('hidden');
    document.getElementById('p2-name').style.display = (mode === 'cpu') ? 'none' : 'block';
}

function startGame() {
    player1 = document.getElementById('p1-name').value || "Player 1";
    player2 = mode === 'cpu' ? "AI Master" : (document.getElementById('p2-name').value || "Player 2");
    document.getElementById('p1-display').innerText = `${player1}: X`;
    document.getElementById('p2-display').innerText = `${player2}: O`;
    document.getElementById('input-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    currentPlayer = 'X';
    updateActiveStatus();
}

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => cell.addEventListener('click', (e) => {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (board[index] !== "" || !gameActive) return;
    makeMove(index, currentPlayer);
    if (gameActive) {
        if (mode === 'cpu' && currentPlayer === 'X') {
            currentPlayer = 'O'; updateActiveStatus();
            setTimeout(bestMove, 500);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateActiveStatus();
        }
    }
}));

function makeMove(index, symbol) {
    board[index] = symbol;
    cells[index].innerText = symbol;
    cells[index].style.color = symbol === 'X' ? '#ffcc00' : '#00ffcc';
    checkResult();
}

// Impossible AI Logic (Minimax)
function bestMove() {
    let bestScore = -Infinity, move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) { bestScore = score; move = i; }
        }
    }
    if (move !== undefined) makeMove(move, "O");
    if (gameActive) { currentPlayer = 'X'; updateActiveStatus(); }
}

function minimax(board, depth, isMaximizing) {
    let res = checkWinnerRaw();
    if (res !== null) return {X: -10, O: 10, tie: 0}[res];
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                bestScore = Math.max(minimax(board, depth + 1, false), bestScore);
                board[i] = "";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                bestScore = Math.min(minimax(board, depth + 1, true), bestScore);
                board[i] = "";
            }
        }
        return bestScore;
    }
}

function checkWinnerRaw() {
    for (let cond of winConditions) {
        let [a, b, c] = cond;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes("") ? null : 'tie';
}

function checkResult() {
    let result = checkWinnerRaw();
    if (result) {
        gameActive = false;
        setTimeout(() => {
            if (result === 'tie') {
                Swal.fire({ title: 'Draw!', text: 'Rematch starting...', icon: 'info', background: '#2b2b3d', color: '#fff', timer: 2000, timerProgressBar: true }).then(autoRematch);
            } else {
                Swal.fire({ title: 'Winner!', text: `${result === 'X' ? player1 : player2} Wins!`, icon: 'success', background: '#2b2b3d', color: '#fff', confirmButtonColor: '#ffcc00' });
            }
        }, 200);
    }
}

function autoRematch() {
    board = ["", "", "", "", "", "", "", "", ""]; gameActive = true; currentPlayer = 'X';
    cells.forEach(c => { c.innerText = ""; c.style.color = "white"; });
    updateActiveStatus();
}

function updateActiveStatus() {
    document.getElementById('p1-display').classList.toggle('active', currentPlayer === 'X');
    document.getElementById('p2-display').classList.toggle('active', currentPlayer === 'O');
}

function resetGame() {
    location.reload(); // Shobcheye shohoj reset
}

function backToMenu() {
    document.getElementById('input-screen').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
}