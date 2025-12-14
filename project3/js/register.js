function register() {
    let u = document.getElementById("username").value.trim();
    let d = document.getElementById("displayName").value.trim();
    let p = document.getElementById("password").value.trim();
    let c = document.getElementById("confirmPassword").value.trim();

    if (!u || !d || !p) {
        document.getElementById("error").textContent = "All fields required.";
        return;
    }
    if (p !== c) {
        document.getElementById("error").textContent = "Passwords do not match.";
        return;
    }

    let form = new FormData();
    form.append("username", u);
    form.append("display_name", d);
    form.append("password", p);

    fetch("backend/register.php", { method: "POST", body: form })
        .then(r => r.json())
        .then(data => {
            if (data.status !== "OK") {
                document.getElementById("error").textContent = data.message;
                return;
            }
            window.location.href = "login.html";
        });
}