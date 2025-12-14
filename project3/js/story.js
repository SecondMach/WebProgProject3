const mapContainer = document.querySelector(".map-container");
const map = document.querySelector(".map");
const levels = map.querySelectorAll(".level");

// Check if user is logged in
const userId = localStorage.getItem("user_id");

const profileBtn = document.getElementById("navProfileBtn");

if (!userId) {
    mapContainer.innerHTML = `<p class="not-logged-in">Please log in to play Story Mode</p>`;
    profileBtn.textContent = "🔑 Login";
    profileBtn.onclick = () => window.location.href = "login.html";
} else {
    // Fetch progress
    let form = new FormData();
    form.append("user_id", userId);

    profileBtn.textContent = "👤 Profile";
    profileBtn.onclick = () => window.location.href = "profile.html";

    fetch("backend/story_progress.php", { method: "POST", body: form })
        .then(r => r.json())
        .then(data => {
            const completed = parseInt(data.completed) || 0;

            levels.forEach(level => {
                const levelNum = parseInt(level.dataset.level);
                const puzzleSize = parseInt(level.dataset.size);

                // Unlock logic: completed levels + next one
                if (levelNum <= completed + 1) {
                    level.classList.remove("locked");
                    level.classList.add("unlocked");
                } else {
                    level.classList.remove("unlocked");
                    level.classList.add("locked");
                }

                // Click handler
                level.onclick = () => {
                    if (!level.classList.contains("unlocked")) return;

                    // Story metadata
                    localStorage.setItem("story_level", levelNum);
                    localStorage.setItem("puzzleSize", puzzleSize);
                    localStorage.setItem("gameMode", "story");

                    window.location.href = "gameplay.html";
                };
            });
        })
        .catch(() => {
            mapContainer.innerHTML = `<p class="not-logged-in">Error loading Story Mode progress</p>`;
        });
}