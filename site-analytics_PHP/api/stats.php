<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

$website_id = (int)$_GET['website_id'];

$today = $conn->query("
    SELECT COUNT(*) as count
    FROM page_views
    WHERE website_id = $website_id
    AND DATE(visit_time) = CURDATE()
")->fetch_assoc()['count'];

$total = $conn->query("
    SELECT COUNT(*) as count
    FROM page_views
    WHERE website_id = $website_id
")->fetch_assoc()['count'];

echo json_encode([
    'today' => (int)$today,
    'total' => (int)$total
]);

$conn->close();
?>
