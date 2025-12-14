let user_id = localStorage.getItem("user_id");
if (!user_id) {
    // Not logged in → redirect
    window.location.href = "login.html";
}

let form = new FormData();
form.append("user_id", user_id);

fetch("backend/get_profile.php", { method: "POST", body: form })
    .then(r => r.json())
    .then(p => {
        document.getElementById("displayName").textContent = p.display_name;
        document.getElementById("username").textContent = p.username;
        document.getElementById("games").textContent = p.total_games;
        document.getElementById("wins").textContent = p.wins;
        document.getElementById("avgMoves").textContent = p.avg_moves;
    });

function back() { window.location.href = "index.html"; }

// ------------------------------
// LOGOUT
// ------------------------------
function logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("display_name");

    window.location.href = "index.html";
}