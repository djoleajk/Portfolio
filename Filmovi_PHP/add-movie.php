<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dodaj Film</title>
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

    <div class="form-container">
        <?php if (isset($_GET['error'])): ?>
            <div class="error-message">
                <?php
                    switch($_GET['error']) {
                        case 'db':
                            echo "Greška pri čuvanju filma u bazi.";
                            break;
                        case 'upload':
                            echo "Greška pri uploadu postera.";
                            break;
                        default:
                            echo "Došlo je do greške.";
                    }
                ?>
            </div>
        <?php endif; ?>
        <?php if (isset($_GET['success'])): ?>
            <div class="success-message">Film je uspešno dodat!</div>
        <?php endif; ?>
        <form id="add-movie-form" method="POST" action="handlers/save-movie.php" enctype="multipart/form-data">
            <input type="text" name="title" placeholder="Naslov filma" required>
            <input type="number" name="year" placeholder="Godina" required>
            <select name="genre" required>
                <option value="">Izaberi žanr</option>
                <option value="action">Akcija</option>
                <option value="comedy">Komedija</option>
                <option value="drama">Drama</option>
                <option value="horror">Horor</option>
                <option value="sci-fi">Naučna Fantastika</option>
                <option value="thriller">Triler</option>
            </select>
            <select name="source_type" id="source_type" required>
                <option value="">Izaberi tip izvora</option>
                <option value="magnet">Magnet Link</option>
                <option value="direct">Direktan Video URL</option>
                <option value="embed">Embed kod (YouTube/Vimeo)</option>
            </select>
            <input type="text" name="video_source" placeholder="Video izvor (magnet link/URL/embed kod)" required>
            <input type="file" name="poster" accept="image/*" required>
            <textarea name="description" placeholder="Opis filma" required></textarea>
            <button type="submit">Dodaj Film</button>
        </form>
    </div>
</body>
</html>
