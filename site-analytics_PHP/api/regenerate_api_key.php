<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents('php://input'), true);
$client_id = (int)$data['client_id'];
$new_api_key = md5(uniqid(rand(), true));

$sql = "UPDATE clients SET api_key = '$new_api_key' WHERE client_id = $client_id";

if ($conn->query($sql)) {
    echo json_encode([
        'success' => true,
        'api_key' => $new_api_key
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => $conn->error
    ]);
}

$conn->close();
?>
