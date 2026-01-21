<?php
require_once 'config/database.php';

$sql = "CREATE DATABASE IF NOT EXISTS site_analytics;
        USE site_analytics;

        CREATE TABLE IF NOT EXISTS page_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            url VARCHAR(255) NOT NULL,
            referrer VARCHAR(255),
            user_agent TEXT,
            visit_time DATETIME NOT NULL
        )";

if ($conn->multi_query($sql)) {
    echo "Instalacija uspešna! Baza podataka i tabele su kreirane.";
} else {
    echo "Greška: " . $conn->error;
}

$conn->close();
?>
