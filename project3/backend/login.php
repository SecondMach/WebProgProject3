<?php
require "db.php";

$username = $_POST["username"];
$password = $_POST["password"];

$sql = "SELECT * FROM users WHERE username='$username' LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    echo json_encode(["status"=>"ERR"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["password_hash"])) {
    echo json_encode(["status"=>"ERR"]);
    exit;
}

echo json_encode([
    "status" => "OK",
    "user_id" => $user["id"],
    "display_name" => $user["display_name"]
]);
?>