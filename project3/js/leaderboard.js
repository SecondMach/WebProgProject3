const tbody = document.querySelector("#board tbody");

fetch("backend/get_leaderboard.php")
    .then(r => r.json())
    .then(data => {
        tbody.innerHTML = "";
        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="5">No data yet</td></tr>`;
            return;
        }

        data.forEach((user, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.display_name}</td>
                <td>${user.games}</td>
                <td>${user.wins}</td>
                <td>${user.best_time ?? "-"}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(() => {
        tbody.innerHTML = `<tr><td colspan="5">Error loading leaderboard</td></tr>`;
    });

const profileBtn = document.getElementById("navProfileBtn");
const userId = localStorage.getItem("user_id");

if (userId) {
    profileBtn.textContent = "👤 Profile";
    profileBtn.onclick = () => window.location.href = "profile.html";
} else {
    profileBtn.textContent = "🔑 Login";
    profileBtn.onclick = () => window.location.href = "login.html";
}