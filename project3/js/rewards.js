const userId = localStorage.getItem("user_id");
const grid = document.getElementById("rewardsGrid");
const profileBtn = document.getElementById("navProfileBtn");

// NOT LOGGED IN
if (!userId) {
    profileBtn.textContent = "🔑 Login";
    profileBtn.onclick = () => window.location.href = "login.html";
    grid.innerHTML = `
        <div class="reward locked">
            <img src="assets/images/lock.png">
            <h3>Login Required</h3>
            <p>Please log in to see your rewards 🎄</p>
        </div>
    `;
    throw new Error("User not logged in");
}

// REWARD DEFINITIONS
const REWARDS = [
    {
        id: "first_win",
        title: "First Win 🎉",
        desc: "Complete your first puzzle",
        icon: "gift1.png",
        unlock: events => events.some(e => e.event_type === "WIN")
    },
    {
        id: "puzzle_master",
        title: "Puzzle Master 🧩",
        desc: "Win 10 puzzles",
        icon: "gift2.png",
        unlock: events => events.filter(e => e.event_type === "WIN").length >= 10
    },
    {
        id: "big_brain",
        title: "Challenger 🧠",
        desc: "Complete a large puzzle (8×8 or 10×10)",
        icon: "gift3.jpg",
        unlock: events =>
            events.some(e =>
                e.event_type === "WIN" &&
                (e.event_data?.includes("8") || e.event_data?.includes("10"))
            )
    },
    {
        id: "santa_favorite",
        title: "Santa’s Favorite 🎅",
        desc: "Play 25 games",
        icon: "gift4.png",
        unlock: events => events.length >= 25
    }
];

// FETCH ANALYTICS EVENTS
let form = new FormData();
form.append("user_id", userId);

profileBtn.textContent = "👤 Profile";
profileBtn.onclick = () => window.location.href = "profile.html";

fetch("backend/get_rewards.php", {
    method: "POST",
    body: form
})
.then(r => r.json())
.then(events => renderRewards(events))
.catch(() => {
    grid.innerHTML = "<p>Error loading rewards.</p>";
});

// RENDER
function renderRewards(events) {
    grid.innerHTML = "";

    REWARDS.forEach(r => {
        const unlocked = r.unlock(events);

        const card = document.createElement("div");
        card.className = "reward" + (unlocked ? "" : " locked");

        card.innerHTML = `
            <img src="assets/images/${unlocked ? r.icon : "lock.png"}">
            <h3>${r.title}</h3>
            <p>${unlocked ? r.desc : "Locked"}</p>
        `;

        grid.appendChild(card);
    });
}