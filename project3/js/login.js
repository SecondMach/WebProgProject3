function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    let form = new FormData();
    form.append("username", user);
    form.append("password", pass);

    fetch("backend/login.php", {
        method: "POST",
        body: form
    })
    .then(r => r.json())
    .then(res => {
        if (res.status !== "OK") {
            document.getElementById("error").textContent = "Invalid username or password";
            return;
        }

        // Store user session locally
        localStorage.setItem("user_id", res.user_id);
        localStorage.setItem("username", user);
        localStorage.setItem("display_name", res.display_name);

        // Redirect to homepage
        window.location.href = "index.html";
    })
    .catch(() => {
        document.getElementById("error").textContent = "Server error.";
    });
}