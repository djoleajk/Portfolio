<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

$websites = $conn->query("
    SELECT w.website_id, w.domain, c.api_key
    FROM websites w
    JOIN clients c ON w.client_id = c.client_id
");

$results = [];
while($site = $websites->fetch_assoc()) {
    $results[] = $site;
}

echo json_encode($results);
$conn->close();
?>
