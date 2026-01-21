<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $client_id = (int)$_POST['client_id'];
    $domain = $conn->real_escape_string($_POST['domain']);

if (!filter_var('http://' . $domain, FILTER_VALIDATE_URL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid domain format']);
        exit;
    }

    $sql = "INSERT INTO websites (client_id, domain) VALUES ($client_id, '$domain')";

    if ($conn->query($sql)) {
        $website_id = $conn->insert_id;

$api_key = $conn->query("SELECT api_key FROM clients WHERE client_id = $client_id")->fetch_assoc()['api_key'];

$tracking_code = <<<HTML

<script>
window.analyticsConfig = {
    websiteId: '{$website_id}',
    apiKey: '{$api_key}'
};
</script>
<script src="http://localhost/PORTFOLIO/site-analytics/tracker.js"></script>
HTML;

        echo json_encode([
            'success' => true,
            'website_id' => $website_id,
            'tracking_code' => $tracking_code
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
