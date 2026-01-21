-- Kreiranje baze podataka
CREATE DATABASE IF NOT EXISTS site_analytics;
USE site_analytics;

-- Tabela za klijente
CREATE TABLE IF NOT EXISTS clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela za sajtove
CREATE TABLE IF NOT EXISTS websites (
    website_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    domain VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Tabela za posete
CREATE TABLE IF NOT EXISTS page_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    url VARCHAR(255) NOT NULL,
    referrer VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);

-- Tabela za dnevnu statistiku
CREATE TABLE IF NOT EXISTS daily_stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    visit_date DATE,
    visit_count INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);

-- Test podaci
INSERT INTO clients (name, email) VALUES 
('Test Client', 'test@example.com');

INSERT INTO websites (client_id, domain) VALUES 
(1, 'example.com');
