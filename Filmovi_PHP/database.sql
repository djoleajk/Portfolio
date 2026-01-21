CREATE DATABASE IF NOT EXISTS filmovi_db;
USE filmovi_db;

DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    magnet_link TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    poster VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
