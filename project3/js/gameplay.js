let size = parseInt(localStorage.getItem("puzzleSize")) || 4;

const ALLOWED_SIZES = [3, 4, 6, 8, 10];
if (!ALLOWED_SIZES.includes(size)) size = 4;

let board = [];
let moves = 0;
let timer = 0;
let timerInterval;

const boardDiv = document.getElementById("puzzleBoard");
const movesCount = document.getElementById("movesCount");
const timerDisplay = document.getElementById("timer");

let difficultyLevel = parseInt(localStorage.getItem("difficulty")) || 1;
let hintsLeft = Math.max(1, 5 - difficultyLevel);

const TILE_SIZE = 100;

const BUILT_IN_IMAGES = [
    "assets/images/santa.png",
    "assets/images/reindeer.png",
    "assets/images/snowman.jpg",
    "assets/images/treepuzzle.jpg",
    "assets/images/gingerbread.avif"
];

let imageObj = new Image();

/* ================= INIT ================= */

init();

function init() {
    boardDiv.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    boardDiv.style.gridTemplateRows = `repeat(${size}, 100px)`;

    const paused = localStorage.getItem("pausedGame");

    if (paused) {
        const state = JSON.parse(paused);

        size = state.size;
        board = state.board;
        moves = state.moves;
        timer = state.time;

        movesCount.textContent = moves;
        timerDisplay.textContent = formatTime(timer);

        imageObj.src = state.image;
        imageObj.onload = () => {
            drawBoard();
            startTimer();
        };
    } else {
        pickrandomImage();
    }
}

/* ================= LOGIN CHECK ================= */

function isUserLoggedIn() {
    const userId = localStorage.getItem("user_id");
    return userId && userId !== "null" && userId !== "undefined";
}

/* ================= IMAGE ================= */

function pickrandomImage() {
    let img = BUILT_IN_IMAGES[Math.floor(Math.random() * BUILT_IN_IMAGES.length)];
    loadImage(img);
}

function loadImage(src) {
    imageObj.src = src;
    imageObj.onload = () => {
        generateBoard();
        drawBoard();
        startTimer();
    };
}

const uploadInput = document.getElementById("imageUpload");
if (uploadInput) {
    uploadInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => loadImage(reader.result);
        reader.readAsDataURL(file);
    });
}

/* ================= BOARD ================= */

function generateBoard() {
    board = [];
    for (let i = 1; i < size * size; i++) board.push(i);
    board.push(0);

    let shuffleMoves = size * size * 6;
    for (let i = 0; i < shuffleMoves; i++) {
        let empty = board.indexOf(0);
        let movable = getMovableIndexes(empty);
        let rand = movable[Math.floor(Math.random() * movable.length)];
        [board[empty], board[rand]] = [board[rand], board[empty]];
    }
}

function getMovableIndexes(empty) {
    let moves = [];
    let row = Math.floor(empty / size);
    let col = empty % size;

    if (col > 0) moves.push(empty - 1);
    if (col < size - 1) moves.push(empty + 1);
    if (row > 0) moves.push(empty - size);
    if (row < size - 1) moves.push(empty + size);

    return moves;
}

function drawBoard() {
    boardDiv.innerHTML = "";
    let emptyIndex = board.indexOf(0);

    board.forEach((value, index) => {
        let tile = document.createElement("div");
        tile.classList.add("tile");

        if (value === 0) {
            tile.classList.add("empty");
        } else {
            const imgRow = Math.floor((value - 1) / size);
            const imgCol = (value - 1) % size;

            tile.style.backgroundImage = `url(${imageObj.src})`;
            tile.style.backgroundSize = `${size * TILE_SIZE}px ${size * TILE_SIZE}px`;
            tile.style.backgroundPosition =
                `-${imgCol * TILE_SIZE}px -${imgRow * TILE_SIZE}px`;

            const number = document.createElement("span");
            number.className = "tile-number";
            number.textContent = value;
            tile.appendChild(number);

            tile.addEventListener("click", () => tryMove(index));

            if (isMovable(index, emptyIndex)) {
                tile.classList.add("movable");
            }
        }

        boardDiv.appendChild(tile);
    });
}

/* ================= MOVES ================= */

function tryMove(index) {
    let emptyIndex = board.indexOf(0);
    if (!isMovable(index, emptyIndex)) return;

    [board[index], board[emptyIndex]] = [board[emptyIndex], board[index]];

    moves++;
    movesCount.textContent = moves;

    updateMusicIntensity();
    drawBoard();
    checkWin();
}

function isMovable(i, empty) {
    let row = Math.floor(i / size);
    let eRow = Math.floor(empty / size);

    return (i === empty - 1 && row === eRow) ||
           (i === empty + 1 && row === eRow) ||
           (i === empty - size) ||
           (i === empty + size);
}

/* ================= TIMER ================= */

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = formatTime(timer);
    }, 1000);
}

function formatTime(t) {
    let m = String(Math.floor(t / 60)).padStart(2, "0");
    let s = String(t % 60).padStart(2, "0");
    return `${m}:${s}`;
}

/* ================= WIN ================= */

function checkWin() {
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i] !== i + 1) return;
    }

    clearInterval(timerInterval);
    adjustDifficulty();

    music.pause();
    music.currentTime = 0;

    localStorage.setItem("moves", moves);
    localStorage.setItem("time", timer);
    localStorage.setItem("difficulty", difficultyLevel);

    // ✅ ONLY save if logged in
    if (isUserLoggedIn()) {
        saveWinSession();
    }

    window.location.href = "victory.html";
}

function adjustDifficulty() {
    let expectedMoves = size * size * 2;
    let expectedTime = size * size * 3;

    if (moves < expectedMoves && timer < expectedTime) {
        difficultyLevel++;
    } else if (moves > expectedMoves * 1.5) {
        difficultyLevel = Math.max(1, difficultyLevel - 1);
    }
}

/* ================= SMART HINT (AUTO MOVE) ================= */

function cloneBoard(arr) {
    return arr.slice();
}

function countWrongTiles(arr) {
    let wrong = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] !== i + 1) wrong++;
    }
    return wrong;
}

function showHint() {
    let empty = board.indexOf(0);
    let movable = getMovableIndexes(empty);

    let bestMove = null;
    let bestScore = Infinity;

    for (let i of movable) {
        let testBoard = cloneBoard(board);
        [testBoard[i], testBoard[empty]] = [testBoard[empty], testBoard[i]];

        let score = countWrongTiles(testBoard);
        if (score < bestScore) {
            bestScore = score;
            bestMove = i;
        }
    }

    if (bestMove === null) {
        bestMove = movable[Math.floor(Math.random() * movable.length)];
    }

    const tileEl = boardDiv.children[bestMove];
    tileEl.classList.add("hint");

    setTimeout(() => {
        tileEl.classList.remove("hint");
        [board[bestMove], board[empty]] = [board[empty], board[bestMove]];
        drawBoard();
        checkWin();
    }, 300);
}

document.getElementById("hintBtn").onclick = () => {
    if (hintsLeft <= 0) return;
    hintsLeft--;
    showHint();
};

/* ================= MUSIC ================= */

const music = document.getElementById("gameMusic");
let musicStarted = false;

function startGameMusic() {
    if (musicStarted) return;
    music.volume = 0.3;
    music.playbackRate = 1.0;
    music.play().catch(() => {});
    musicStarted = true;
}

document.addEventListener("click", startGameMusic, { once: true });
document.addEventListener("keydown", startGameMusic, { once: true });

function updateMusicIntensity() {
    if (!musicStarted) return;

    let intensity = Math.min(1, (moves + timer / 2) / (size * size * 3));
    music.volume = 0.3 + intensity * 0.4;
    music.playbackRate = 1 + intensity * 0.15;

    if (tilesOutOfPlace() <= 3) {
        music.volume = 0.85;
        music.playbackRate = 1.25;
    }
}

function tilesOutOfPlace() {
    let wrong = 0;
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i] !== i + 1) wrong++;
    }
    return wrong;
}

/* ================= SAVE ================= */

function saveWinSession() {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    let form = new FormData();
    form.append("user_id", userId);
    form.append("moves", moves);
    form.append("time", timer);
    form.append("size", size);
    form.append("success", 1);
    form.append("difficulty", difficultyLevel);

    fetch("backend/save_session.php", {
        method: "POST",
        body: form
    });
}

function saveGameState() {
    const state = {
        board,
        moves,
        time: timer,
        size,
        image: imageObj.src
    };
    localStorage.setItem("pausedGame", JSON.stringify(state));
}

window.addEventListener("beforeunload", () => {
    saveGameState();
    clearInterval(timerInterval);
});

/* ================= PROFILE BUTTON ================= */

const profileBtn = document.getElementById("navProfileBtn");
const userId = localStorage.getItem("user_id");

if (userId) {
    profileBtn.textContent = "👤 Profile";
    profileBtn.onclick = () => window.location.href = "profile.html";
} else {
    profileBtn.textContent = "🔑 Login";
    profileBtn.onclick = () => window.location.href = "login.html";
}
