<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['website_id'])) {
    echo json_encode(['error' => 'Missing website_id']);
    exit;
}

$website_id = (int)$data['website_id'];
$url = $conn->real_escape_string($data['url']);
$referrer = $conn->real_escape_string($data['referrer'] ?: 'direct');
$user_agent = $conn->real_escape_string($data['user_agent']);
$ip_address = $_SERVER['REMOTE_ADDR'];

$sql = "INSERT INTO page_views (website_id, url, referrer, user_agent, ip_address)
        VALUES ($website_id, '$url', '$referrer', '$user_agent', '$ip_address')";

if ($conn->query($sql)) {

    if (!empty($data['referrer_domain'])) {
        $domain = $conn->real_escape_string($data['referrer_domain']);

        $conn->query("
            INSERT INTO referrer_domains (website_id, domain)
            VALUES ($website_id, '$domain')
            ON DUPLICATE KEY UPDATE
            visit_count = visit_count + 1,
            last_visit = CURRENT_TIMESTAMP
        ");
    }

$date = date('Y-m-d');
    $conn->query("INSERT INTO daily_stats (website_id, visit_date, page_views, unique_visitors)
        VALUES ($website_id, '$date', 1, 1)
        ON DUPLICATE KEY UPDATE
        page_views = page_views + 1,
        unique_visitors = (
            SELECT COUNT(DISTINCT ip_address)
            FROM page_views
            WHERE website_id = $website_id
            AND DATE(visit_time) = '$date'
        )");

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['error' => $conn->error]);
}

$conn->close();
?>
