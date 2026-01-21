-- Kreiranje baze
CREATE DATABASE IF NOT EXISTS site_analytics;
USE site_analytics;

-- Brisanje postojećih tabela ako postoje
DROP TABLE IF EXISTS search_terms;
DROP TABLE IF EXISTS referrer_domains;
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS daily_stats;
DROP TABLE IF EXISTS websites;
DROP TABLE IF EXISTS clients;

-- Kreiranje tabela
CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    api_key VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE websites (
    website_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    domain VARCHAR(255) NOT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE page_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    url VARCHAR(255) NOT NULL,
    referrer VARCHAR(255),
    user_agent TEXT,
    ip_address VARCHAR(45),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);

CREATE TABLE daily_stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    visit_date DATE,
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    FOREIGN KEY (website_id) REFERENCES websites(website_id),
    UNIQUE KEY website_date (website_id, visit_date)
);

CREATE TABLE search_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    search_term VARCHAR(255),
    search_engine VARCHAR(50),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);

CREATE TABLE referrer_domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    domain VARCHAR(255),
    visit_count INT DEFAULT 1,
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY website_domain (website_id, domain),
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);

-- Test podaci
INSERT INTO clients (name, email, api_key) VALUES 
('Test Client', 'test@example.com', 'test123api');

INSERT INTO websites (client_id, domain) VALUES 
(1, 'example.com');
