CREATE TABLE search_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    website_id INT,
    search_term VARCHAR(255),
    search_engine VARCHAR(50),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);
