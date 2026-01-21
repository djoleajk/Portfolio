<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $api_key = md5(uniqid(rand(), true));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }

    $sql = "INSERT INTO clients (name, email, api_key) VALUES ('$name', '$email', '$api_key')";

    if ($conn->query($sql)) {
        echo json_encode([
            'success' => true,
            'client_id' => $conn->insert_id,
            'api_key' => $api_key
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => $conn->error
        ]);
    }
}

$conn->close();
?>
