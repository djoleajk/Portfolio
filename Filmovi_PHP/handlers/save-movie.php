<?php
require_once '../config/database.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    error_log("POST data: " . print_r($_POST, true));
    error_log("FILES data: " . print_r($_FILES, true));

$required_fields = ['title', 'year', 'genre', 'description', 'video_source', 'source_type'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            error_log("Missing required field: " . $field);
            header("Location: ../add-movie.php?error=missing_fields");
            exit();
        }
    }

$title = trim($_POST['title']);
    $year = intval($_POST['year']);
    $genre = trim($_POST['genre']);
    $description = trim($_POST['description']);
    $video_source = trim($_POST['video_source']);
    $source_type = trim($_POST['source_type']);

if (!isset($_FILES['poster']) || $_FILES['poster']['error'] !== UPLOAD_ERR_OK) {
        error_log("Poster upload error: " . $_FILES['poster']['error']);
        header("Location: ../add-movie.php?error=poster");
        exit();
    }

$poster = $_FILES['poster'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!in_array($poster['type'], $allowed_types)) {
        error_log("Invalid file type: " . $poster['type']);
        header("Location: ../add-movie.php?error=file_type");
        exit();
    }

    $poster_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "", $poster['name']);
    $target_path = "../uploads/" . $poster_name;

if (!is_dir("../uploads")) {
        mkdir("../uploads", 0777, true);
    }

    if (move_uploaded_file($poster['tmp_name'], $target_path)) {
        try {
            $sql = "INSERT INTO movies (title, year, genre, description, magnet_link, source_type, poster)
                    VALUES (?, ?, ?, ?, ?, ?, ?)";

            $stmt = $pdo->prepare($sql);
            $params = [$title, $year, $genre, $description, $video_source, $source_type, $poster_name];

            error_log("Executing SQL with params: " . print_r($params, true));

            $result = $stmt->execute($params);

            if ($result) {
                error_log("Movie added successfully");
                header("Location: ../index.php?success=1");
                exit();
            } else {
                error_log("DB Error: " . print_r($stmt->errorInfo(), true));
                header("Location: ../add-movie.php?error=db");
                exit();
            }
        } catch(PDOException $e) {
            error_log("PDO Error: " . $e->getMessage());
            header("Location: ../add-movie.php?error=db");
            exit();
        }
    } else {
        error_log("Failed to move uploaded file from {$poster['tmp_name']} to {$target_path}");
        header("Location: ../add-movie.php?error=upload");
        exit();
    }
} else {
    header("Location: ../add-movie.php");
    exit();
}
