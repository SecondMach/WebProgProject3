<?php
require "db.php";

$q = $conn->query("
    SELECT users.display_name, 
           COUNT(game_sessions.id) AS games,
           SUM(success) AS wins,
           MIN(time_seconds) AS best_time
    FROM game_sessions
    LEFT JOIN users ON users.id = game_sessions.user_id
    GROUP BY user_id
    ORDER BY wins DESC, best_time ASC
    LIMIT 20
");

$data = [];
while ($r = $q->fetch_assoc()) $data[] = $r;

echo json_encode($data);
?>