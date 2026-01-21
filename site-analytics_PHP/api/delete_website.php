<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

$website_id = $_POST['website_id'] ?? '';
$api_key = $_POST['api_key'] ?? '';

if (empty($website_id) || empty($api_key)) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

$sql = "DELETE w FROM websites w
        INNER JOIN clients c ON w.client_id = c.client_id
        WHERE w.website_id = ? AND c.api_key = ?";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param('is', $website_id, $api_key);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {

        $conn->query("DELETE FROM daily_stats WHERE website_id = $website_id");
        $conn->query("DELETE FROM referrer_domains WHERE website_id = $website_id");
        $conn->query("DELETE FROM page_views WHERE website_id = $website_id");
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Website not found or unauthorized']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

$conn->close();
