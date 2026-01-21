-- Tabela za omiljene oglase
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    service_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Tabela za poruke
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT,
    receiver_id INT,
    service_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Tabela za kategorije
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    parent_id INT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Tabela za prijave oglasa
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT,
    user_id INT,
    reason TEXT,
    status ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Dodavanje statusa oglasima
ALTER TABLE services 
ADD COLUMN status ENUM('active', 'archived') DEFAULT 'active',
ADD COLUMN last_renewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
