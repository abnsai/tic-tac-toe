// Gameboard object
const Gameboard = (() => {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = "";
        }
    }

    const getBoard = () => board;

    const placeMark = (row, col, player) => {
        if (board[row][col] === "") {
            board[row][col] = player;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                board[i][j] = "";
            }
        }
    };

    return { getBoard, placeMark, resetBoard };
})();

// Player factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game controller object
const Game = (() => {
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameActive = false;

    const start = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        gameActive = true;
    };

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0] !== "" &&
                board[i][0] === board[i][1] &&
                board[i][0] === board[i][2]
            ) {
                return true;
            }
        }
        // Check columns
        for (let j = 0; j < 3; j++) {
            if (
                board[0][j] !== "" &&
                board[0][j] === board[1][j] &&
                board[0][j] === board[2][j]
            ) {
                return true;
            }
        }
        // Check diagonals
        if (
            board[0][0] !== "" &&
            board[0][0] === board[1][1] &&
            board[0][0] === board[2][2]
        ) {
            return true;
        }
        if (
            board[0][2] !== "" &&
            board[0][2] === board[1][1] &&
            board[0][2] === board[2][0]
        ) {
            return true;
        }
        return false;
    };

    const checkTie = () => {
        const board = Gameboard.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    return false;
                }
            }
        }
        return true;
    };

    const handleClick = (row, col) => {
        if (!gameActive) return;

        if (Gameboard.placeMark(row, col, currentPlayer.mark)) {
            if (checkWin()) {
                gameActive = false;
                return `${currentPlayer.name} wins!`;
            } else if (checkTie()) {
                gameActive = false;
                return "It's a tie!";
            } else {
                switchPlayer();
                return null;
            }
        } else {
            return "Invalid move!";
        }
    };

    return { start, getCurrentPlayer, handleClick, player1, player2 };
})();

// Display controller object
const DisplayController = (() => {
    const gameboardEl = document.querySelector(".gameboard");
    const messageEl = document.querySelector("#message");
    const player1NameEl = document.querySelector("#player1");
    const player2NameEl = document.querySelector("#player2");
    const startBtnEl = document.querySelector("#startBtn");
    const restartBtnEl = document.querySelector("#restartBtn");

    startBtnEl.addEventListener("click", () => {
        const player1Name = player1NameEl.value;
        const player2Name = player2NameEl.value;
        Game.player1.name = player1Name;
        Game.player2.name = player2Name;
        Game.start();
        updateDisplay();
    });

    restartBtnEl.addEventListener("click", () => {
        Game.start();
        updateDisplay();
    });

    gameboardEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("cell")) {
            const index = e.target.dataset.index;
            const row = Math.floor(index / 3);
            const col = index % 3;
            const result = Game.handleClick(row, col);
            updateDisplay();
            if (result) {
                messageEl.textContent = result;
            }
        }
    });

    const updateDisplay = () => {
        const board = Gameboard.getBoard();
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            cell.textContent = board[row][col];
        });
    };

    return { updateDisplay };
})();
