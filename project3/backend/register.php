<?php
require "db.php";

$username = $_POST["username"] ?? "";
$display  = $_POST["display_name"] ?? "";
$password = $_POST["password"] ?? "";

if (!$username || !$display || !$password) {
    echo json_encode(["status"=>"ERR","message"=>"Missing fields"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, display_name, password_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $display, $hash);

if ($stmt->execute()) {
    echo json_encode(["status"=>"OK"]);
} else {
    echo json_encode(["status"=>"ERR","message"=>"Username already exists"]);
}
?>