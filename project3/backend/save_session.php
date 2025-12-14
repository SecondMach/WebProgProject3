<?php
require "db.php";

$user = $_POST["user_id"] ?? null;
$moves = $_POST["moves"] ?? 0;
$time = $_POST["time"] ?? 0;
$size = $_POST["size"] ?? 3;
$success = $_POST["success"] ?? 1;
$diff = $_POST["difficulty"] ?? 1;

$stmt = $conn->prepare("
    INSERT INTO game_sessions 
    (user_id, board_size, moves, time_seconds, difficulty_level, success)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param("iiiiii", $user, $size, $moves, $time, $diff, $success);
$stmt->execute();

echo json_encode(["status" => "OK"]);
?>