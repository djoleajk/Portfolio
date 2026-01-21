<?php
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "UPDATE services
          SET status = 'archived'
          WHERE last_renewed_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND status = 'active'";

$stmt = $db->prepare($query);
$stmt->execute();

echo "Archived " . $stmt->rowCount() . " services\n";
