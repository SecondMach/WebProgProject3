<?php
require "db.php";

$user = $_POST["user_id"];

$q = $conn->query("
    SELECT COUNT(*) AS completed 
    FROM game_sessions
    WHERE user_id=$user AND success=1
");

$result = $q->fetch_assoc();
echo json_encode($result);
?>