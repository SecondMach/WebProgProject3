<?php
require "db.php";

$user = $_POST["user_id"];

$q = $conn->query("
    SELECT event_type, event_data, created_at
    FROM analytics_events
    WHERE user_id=$user
");

$rows = [];
while($r = $q->fetch_assoc()) $rows[] = $r;

echo json_encode($rows);
?>