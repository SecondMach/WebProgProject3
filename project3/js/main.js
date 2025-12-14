function openPlay() {
    if (localStorage.getItem("pausedGame")) {
        document.getElementById("resumePopup").classList.remove("hidden");
    } else {
        document.getElementById("sizePopup").classList.remove("hidden");
    }
}

function closePlay() {
    document.getElementById("sizePopup").classList.add("hidden");
}

function startGame(size) {
    localStorage.setItem("puzzleSize", size);
    window.location.href = "gameplay.html";
}

function resumeGame() {
    window.location.href = "gameplay.html";
}

function discardGame() {
    localStorage.removeItem("pausedGame");
    document.getElementById("resumePopup").classList.add("hidden");
    document.getElementById("sizePopup").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    const authBtn = document.getElementById("authBtn");
    const authLabel = document.getElementById("authLabel");

    if (!authBtn || !authLabel) return;

    const userId = localStorage.getItem("user_id");

    if (userId) {
        // Logged in → Profile
        authLabel.textContent = "Profile";
        authBtn.onclick = () => {
            window.location.href = "profile.html";
        };
    } else {
        // Logged out → Login
        authLabel.textContent = "Login";
        authBtn.onclick = () => {
            window.location.href = "login.html";
        };
    }
});

const bells = document.getElementById("bells");

function startMusic() {
    bells.volume = 0.4; // festive but not annoying
    bells.play().catch(() => {});
}

// Start music on first interaction
document.addEventListener("click", startMusic, { once: true });
document.addEventListener("keydown", startMusic, { once: true });