CREATE DATABASE IF NOT EXISTS reservation_system;
USE reservation_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('na čekanju', 'potvrđeno', 'otkazano') DEFAULT 'na čekanju',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
