<?php
require_once 'config/database.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Film Streaming</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav>
        <div class="logo">FilmStream</div>
        <ul>
            <li><a href="index.php">Početna</a></li>
            <li><a href="add-movie.php">Dodaj Film</a></li>
        </ul>
    </nav>

    <div class="filters">
        <select id="year-filter">
            <option value="">Izaberi godinu</option>
            <?php for($i=2024; $i>=1950; $i--): ?>
                <option value="<?php echo $i; ?>"><?php echo $i; ?></option>
            <?php endfor; ?>
        </select>
        <select id="genre-filter">
            <option value="">Izaberi žanr</option>
            <option value="action">Akcija</option>
            <option value="comedy">Komedija</option>
            <option value="drama">Drama</option>
            <option value="horror">Horor</option>
        </select>
    </div>

    <div class="movies-grid" id="movies-container">
        
    </div>

    <script src="js/main.js"></script>
</body>
</html>
