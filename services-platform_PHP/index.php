<?php
session_start();
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Greška pri povezivanju sa bazom podataka.");
}

$categories_query = "SELECT DISTINCT category FROM services";
$categories_stmt = $db->prepare($categories_query);
$categories_stmt->execute();
$categories = $categories_stmt->fetchAll(PDO::FETCH_COLUMN);

$search = isset($_GET['search']) ? $_GET['search'] : '';
$category = isset($_GET['category']) ? $_GET['category'] : '';
$location = isset($_GET['location']) ? $_GET['location'] : '';
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';

$query = "SELECT s.*, u.full_name, AVG(r.rating) as avg_rating,
          COUNT(DISTINCT v.id) as view_count,
          s.created_at as posted_date, s.updated_at as last_updated
          FROM services s
          LEFT JOIN users u ON s.user_id = u.id
          LEFT JOIN reviews r ON s.id = r.service_id
          LEFT JOIN views v ON s.id = v.service_id
          WHERE 1=1";

if ($search) {
    $query .= " AND (s.title LIKE :search OR s.description LIKE :search)";
}
if ($category) {
    $query .= " AND s.category = :category";
}
if ($location) {
    $query .= " AND s.location LIKE :location";
}

$query .= " GROUP BY s.id";

switch($sort) {
    case 'price_asc':
        $query .= " ORDER BY s.price ASC";
        break;
    case 'price_desc':
        $query .= " ORDER BY s.price DESC";
        break;
    case 'rating':
        $query .= " ORDER BY avg_rating DESC";
        break;
    case 'views':
        $query .= " ORDER BY view_count DESC";
        break;
    default:
        $query .= " ORDER BY s.created_at DESC";
}

$stmt = $db->prepare($query);

if ($search) {
    $search_param = "%$search%";
    $stmt->bindParam(':search', $search_param);
}
if ($category) {
    $stmt->bindParam(':category', $category);
}
if ($location) {
    $location_param = "%$location%";
    $stmt->bindParam(':location', $location_param);
}

$stmt->execute();

$page_title = 'Početna - Lokalne Usluge';
include 'includes/header.php';
?>

<main>
    <h1>Dostupne Usluge</h1>
    <div class="search-filters">
        <form method="GET" class="filter-form">
            <input type="text" name="search" placeholder="Pretraži usluge..." value="<?php echo htmlspecialchars($search); ?>">
            <select name="category">
                <option value="">Sve kategorije</option>
                <?php foreach($categories as $cat): ?>
                    <option value="<?php echo htmlspecialchars($cat); ?>"
                            <?php echo $category === $cat ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($cat); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <input type="text" name="location" placeholder="Lokacija" value="<?php echo htmlspecialchars($location); ?>">
            <div class="advanced-filters">
                <select name="sort">
                    <option value="newest" <?php echo $sort == 'newest' ? 'selected' : ''; ?>>Najnovije</option>
                    <option value="price_asc" <?php echo $sort == 'price_asc' ? 'selected' : ''; ?>>Cena rastuće</option>
                    <option value="price_desc" <?php echo $sort == 'price_desc' ? 'selected' : ''; ?>>Cena opadajuće</option>
                    <option value="rating" <?php echo $sort == 'rating' ? 'selected' : ''; ?>>Najbolje ocenjeno</option>
                    <option value="views" <?php echo $sort == 'views' ? 'selected' : ''; ?>>Najpregledanije</option>
                </select>
            </div>
            <button type="submit">Filtriraj</button>
        </form>
    </div>
    <div class="services-grid">
        <?php while($row = $stmt->fetch(PDO::FETCH_ASSOC)): ?>
            <div class="service-card">
                <div class="service-stats">
                    <span class="views"><?php echo $row['view_count'] ?? 0; ?> pregleda</span>
                    <span class="date">
                        <?php
                        $date = $row['last_updated'] ?? $row['posted_date'];
                        echo "Ažurirano: " . date('d.m.Y', strtotime($date));
                        ?>
                    </span>
                </div>
                <h2><?php echo htmlspecialchars($row['title']); ?></h2>
                <p><?php echo htmlspecialchars($row['description']); ?></p>
                <p>Kategorija: <?php echo htmlspecialchars($row['category']); ?></p>
                <p>Lokacija: <?php echo htmlspecialchars($row['location']); ?></p>
                <p>Cena: <?php echo htmlspecialchars($row['price']); ?> RSD</p>
                <p>Prosečna ocena: <?php echo number_format($row['avg_rating'], 1); ?>/5</p>
                <a href="service_details.php?id=<?php echo $row['id']; ?>">Detaljnije</a>
            </div>
        <?php endwhile; ?>
    </div>
</main>
</body>
</html>
