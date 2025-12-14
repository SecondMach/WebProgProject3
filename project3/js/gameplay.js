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
]

let imageObj = new Image();

init();

function init() {
    boardDiv.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    boardDiv.style.gridTemplateRows = `repeat(${size}, 100px)`;

    const paused = localStorage.getItem("pausedGame");

    if (paused) {
        const state = JSON.parse(paused);

        // restore everything
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

function generateBoard() {
    board = [];

    // fill 1..(size*size - 1)
    for (let i = 1; i < size * size; i++) board.push(i);
    board.push(0);

    // strategic shuffling: simulate real moves
    let shuffleMoves = size * size * 6;

    for (let i = 0; i < shuffleMoves; i++) {
        let emptyIndex = board.indexOf(0);
        let movable = getMovableIndexes(emptyIndex);
        let rand = movable[Math.floor(Math.random() * movable.length)];

        [board[emptyIndex], board[rand]] = [board[rand], board[emptyIndex]];
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

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function isSolvable(arr) {
    let inversions = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > 0 && arr[j] > 0 && arr[i] > arr[j]) {
                inversions++;
            }
        }
    }

    // odd grid (3x3, 5x5): solvable if inversions even
    if (size % 2 !== 0) return inversions % 2 === 0;

    // even grid (4x4):
    const emptyRow = Math.floor(arr.indexOf(0) / size);

    // if blank is on even row from bottom (0-based)
    if ((size - emptyRow) % 2 === 0) return inversions % 2 !== 0;
    else return inversions % 2 === 0;
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

function tryMove(index) {
    let emptyIndex = board.indexOf(0);
    
    if (!isMovable(index, emptyIndex)) return;

    // swap
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

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        let m = String(Math.floor(timer / 60)).padStart(2, "0");
        let s = String(timer % 60).padStart(2, "0");
        timerDisplay.textContent = `${m}:${s}`;
    }, 1000);
}

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

    saveWinSession();
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

document.getElementById("hintBtn").onclick = () => {
    if (hintsLeft <= 0) return;

    hintsLeft--;
    showHint();
};

function showHint() {
    let empty = board.indexOf(0);
    let movable = getMovableIndexes(empty);

    movable.forEach(i => {
        boardDiv.children[i].classList.add("hint");
        setTimeout(() => {
            boardDiv.children[i].classList.remove("hint");
        }, 1500);
    });
}

let user_id = localStorage.getItem("user_id");

function saveWinSession() {
    let form = new FormData();
    form.append("user_id", localStorage.getItem("user_id"));
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

const music = document.getElementById("gameMusic");
let musicStarted = false;

function startGameMusic() {
    if (musicStarted) return;

    music.volume = 0.3;
    music.playbackRate = 1.0;

    music.play().catch(() => {});
    musicStarted = true;
}

// Start music after first interaction
document.addEventListener("click", startGameMusic, { once: true });
document.addEventListener("keydown", startGameMusic, { once: true });

function updateMusicIntensity() {
    if (!musicStarted) return;

    // Gradual intensity
    let intensity = Math.min(1, (moves + timer / 2) / (size * size * 3));

    // Volume scaling
    music.volume = 0.3 + intensity * 0.4;   // 0.3 → 0.7

    // Speed scaling (subtle)
    music.playbackRate = 1 + intensity * 0.15; // 1.0 → 1.15

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

function saveGameState() {
    const state = {
        board,
        moves,
        time: timer,
        size,
        image: imageObj.src,
        storyLevel: localStorage.getItem("story_level") || null
    };
    localStorage.setItem("pausedGame", JSON.stringify(state));
}

window.addEventListener("beforeunload", () => {
    saveGameState();
    clearInterval(timerInterval);
});

window.onload = () => {
    const pausedBoard = localStorage.getItem("pausedBoard");
    if (pausedBoard) {
        if (confirm("Resume previous game?")) {
            board = JSON.parse(pausedBoard);
            moves = parseInt(localStorage.getItem("pausedMoves")) || 0;
            timer = parseInt(localStorage.getItem("pausedTime")) || 0;
            drawBoard();
            movesCount.textContent = moves;
            startTimer();
        } else {
            localStorage.removeItem("pausedBoard");
            localStorage.removeItem("pausedMoves");
            localStorage.removeItem("pausedTime");
        }
    }
};

const profileBtn = document.getElementById("navProfileBtn");
const userId = localStorage.getItem("user_id");

if (userId) {
    profileBtn.textContent = "👤 Profile";
    profileBtn.onclick = () => window.location.href = "profile.html";
} else {
    profileBtn.textContent = "🔑 Login";
    profileBtn.onclick = () => window.location.href = "login.html";
}