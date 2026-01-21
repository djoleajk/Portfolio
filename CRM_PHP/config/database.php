<?php
$host = 'localhost';
$dbname = 'crm_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

$tables = [
    "CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        status ENUM('lead', 'contacted', 'customer'),
        email VARCHAR(100),
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",
    "CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        name VARCHAR(100),
        position VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(50),
        FOREIGN KEY (client_id) REFERENCES clients(id)
    )",
    "CREATE TABLE IF NOT EXISTS meetings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        date_time DATETIME,
        description TEXT,
        status ENUM('scheduled', 'completed', 'cancelled'),
        FOREIGN KEY (client_id) REFERENCES clients(id)
    )",
    "CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT,
        amount DECIMAL(10,2),
        date DATE,
        status ENUM('pending', 'completed', 'cancelled'),
        FOREIGN KEY (client_id) REFERENCES clients(id)
    )"
];

foreach ($tables as $sql) {
    $pdo->exec($sql);
}
?>
