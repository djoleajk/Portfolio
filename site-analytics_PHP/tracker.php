<?php
require_once 'config/database.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$url = $conn->real_escape_string($data['url']);
$referrer = $conn->real_escape_string($data['referrer']);
$userAgent = $conn->real_escape_string($data['userAgent']);
$timestamp = date('Y-m-d H:i:s');

$sql = "INSERT INTO page_views (url, referrer, user_agent, visit_time)
        VALUES ('$url', '$referrer', '$userAgent', '$timestamp')";

if ($conn->query($sql)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$conn->close();
?>
