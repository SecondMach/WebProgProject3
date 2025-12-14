window.onload = () => {
    const moves = parseInt(localStorage.getItem("moves")) || 0;
    const time = parseInt(localStorage.getItem("time")) || 0;
    const size = localStorage.getItem("size") || 4;
    const storyLevel = localStorage.getItem("story_level");

    animateCount("vMoves", moves, 1200);
    animateTime("vTime", time, 1500);
    document.getElementById("vSize").textContent = `${size} × ${size}`;

    // Conditionally show buttons
    if (storyLevel) {
        document.getElementById("nextBtn").classList.remove("hidden");
    } else {
        document.getElementById("newGameBtn").classList.remove("hidden");
    }

    // Reveal stats + confetti after sleigh lands
    setTimeout(() => {
        document.getElementById("stats").classList.remove("hidden");
        launchConfetti();
    }, 3000);

    // Audio fallback (browser-safe)
    const music = document.getElementById("victoryMusic");
    document.addEventListener("click", () => music.play(), { once: true });
};

// Replay same puzzle size
function replay() {
    const size = localStorage.getItem("size");
    localStorage.setItem("size", size);
    window.location.href = "gameplay.html";
}

// Next story level
function nextLevel() {
    let level = parseInt(localStorage.getItem("story_level")) || 1;
    level++;

    localStorage.setItem("story_level", level);

    // Map levels → puzzle sizes
    const sizes = [3, 4, 5, 6, 8, 10];
    const nextSize = sizes[level - 1] || 10;
    localStorage.setItem("size", nextSize);

    window.location.href = "gameplay.html";
}

// New game popup (regular mode only)
function newGame() {
    document.getElementById("sizePopup").classList.remove("hidden");
}

function closePopup() {
    document.getElementById("sizePopup").classList.add("hidden");
}

function startNewGame(size) {
    localStorage.removeItem("story_level");
    localStorage.setItem("size", size);
    window.location.href = "gameplay.html";
}

// Home button
function goHome() {
    window.location.href = "index.html";
}

// Smooth number animation
function animateCount(id, target, duration) {
    let el = document.getElementById(id);
    let start = 0;
    let step = target / (duration / 30);

    let interval = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target;
            clearInterval(interval);
        } else {
            el.textContent = Math.floor(start);
        }
    }, 30);
}

// Animate time MM:SS
function animateTime(id, seconds, duration) {
    let el = document.getElementById(id);
    let current = 0;
    let step = seconds / (duration / 30);

    let interval = setInterval(() => {
        current += step;
        if (current >= seconds) {
            current = seconds;
            clearInterval(interval);
        }
        let m = String(Math.floor(current / 60)).padStart(2, "0");
        let s = String(Math.floor(current % 60)).padStart(2, "0");
        el.textContent = `${m}:${s}`;
    }, 30);
}

// Sparkles
const sparklesContainer = document.getElementById("sparkles");
const sleigh = document.querySelector(".sleigh");

function emitSparkle() {
    if (!sleigh) return;

    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";

    const sleighRect = sleigh.getBoundingClientRect();
    const containerRect = sparklesContainer.getBoundingClientRect();

    // Position sparkles slightly BEHIND sleigh
    sparkle.style.left =
        (sleighRect.left - containerRect.left + Math.random() * 30) + "px";

    sparkle.style.top =
        (sleighRect.top - containerRect.top + 40 + Math.random() * 30) + "px";

    sparklesContainer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
}

let sparkleTimer = setInterval(emitSparkle, 80);
setTimeout(() => clearInterval(sparkleTimer), 3000);

// Confetti burst
function launchConfetti() {
    for (let i = 0; i < 120; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * window.innerWidth + "px";
        c.style.background = ["gold", "red", "white", "green"][Math.floor(Math.random() * 4)];
        c.style.animationDuration = 2 + Math.random() * 2 + "s";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}

const profileBtn = document.getElementById("navProfileBtn");
const userId = localStorage.getItem("user_id");

if (userId) {
    profileBtn.textContent = "👤 Profile";
    profileBtn.onclick = () => window.location.href = "profile.html";
} else {
    profileBtn.textContent = "🔑 Login";
    profileBtn.onclick = () => window.location.href = "login.html";
}