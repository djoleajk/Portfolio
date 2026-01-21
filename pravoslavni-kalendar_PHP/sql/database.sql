DROP TABLE IF EXISTS saints;
CREATE TABLE saints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    julian_date DATE,
    gregorian_date DATE,
    name VARCHAR(255),
    description TEXT,
    importance ENUM('велики празник', 'средњи празник', 'мали празник') DEFAULT 'мали празник',
    celebration_type ENUM('црвено слово', 'подебљано', 'обично') DEFAULT 'обично'
);

CREATE TABLE fasting_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    julian_date DATE,
    fasting_type ENUM('мрсни дан', 'пост на води', 'пост на уљу', 'риба дозвољена'),
    description TEXT
);

CREATE TABLE customs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255),
    before_celebration TEXT,
    during_celebration TEXT,
    after_celebration TEXT
);

INSERT INTO saints (julian_date, gregorian_date, name, description, importance, celebration_type)
VALUES 
('2023-12-19', '2023-12-31', 'Свети мученик Бонифатије', 
'Свети мученик Бонифатије је био хришћански мученик који је страдао за веру у 3. веку. Његова прича је пример покајања и вере.', 
'средњи празник', 'обично');
