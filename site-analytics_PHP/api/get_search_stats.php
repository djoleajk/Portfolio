<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

$website_id = (int)$_GET['website_id'];

$sql = "SELECT
            search_term,
            search_engine,
            COUNT(*) as count,
            MAX(visit_time) as last_visit
        FROM search_terms
        WHERE website_id = $website_id
        GROUP BY search_term, search_engine
        ORDER BY count DESC, last_visit DESC
        LIMIT 10";

$stats = $conn->query($sql);

$results = [];
while($row = $stats->fetch_assoc()) {
    $results[] = [
        'search_term' => htmlspecialchars($row['search_term']),
        'search_engine' => htmlspecialchars($row['search_engine']),
        'count' => (int)$row['count']
    ];
}

echo json_encode($results);
$conn->close();
?>
