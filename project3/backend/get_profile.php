<?php
require "db.php";

if (!isset($_POST["user_id"])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$id = intval($_POST["user_id"]);
// ---- USER INFO ----
$stmt1 = $conn->prepare(
    "SELECT username, display_name FROM users WHERE id = ?"
);
$stmt1->bind_param("i", $id);
$stmt1->execute();
$usr = $stmt1->get_result()->fetch_assoc();

// ---- STATS ----
$stmt2 = $conn->prepare(
    "SELECT COUNT(*) AS total_games,
            SUM(success) AS wins,
            AVG(moves) AS avg_moves
     FROM game_sessions
     WHERE user_id = ?"
);
$stmt2->bind_param("i", $id);
$stmt2->execute();
$stats = $stmt2->get_result()->fetch_assoc();

echo json_encode([
    "username" => $usr["username"] ?? "",
    "display_name" => $usr["display_name"] ?? "",
    "total_games" => $stats["total_games"] ?? 0,
    "wins" => $stats["wins"] ?? 0,
    "avg_moves" => round($stats["avg_moves"] ?? 0, 1)
]);
?>