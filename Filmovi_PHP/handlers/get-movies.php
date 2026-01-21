<?php
require_once '../config/database.php';

header('Content-Type: application/json');

$year = isset($_GET['year']) ? $_GET['year'] : '';
$genre = isset($_GET['genre']) ? $_GET['genre'] : '';

$sql = "SELECT * FROM movies WHERE 1=1";
$params = [];

if (!empty($year)) {
    $sql .= " AND year = ?";
    $params[] = $year;
}

if (!empty($genre)) {
    $sql .= " AND genre = ?";
    $params[] = $genre;
}

$sql .= " ORDER BY created_at DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($movies);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error']);
}
