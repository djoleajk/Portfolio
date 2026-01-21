CREATE DATABASE IF NOT EXISTS site_analytics;
USE site_analytics;

CREATE TABLE page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    referrer VARCHAR(255),
    user_agent TEXT,
    visit_time DATETIME NOT NULL
);
