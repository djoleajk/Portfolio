<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

$query = "SELECT s.*, AVG(r.rating) as avg_rating
          FROM services s
          LEFT JOIN reviews r ON s.id = r.service_id
          WHERE s.user_id = :user_id
          GROUP BY s.id";

$stmt = $db->prepare($query);
$stmt->execute([':user_id' => $_SESSION['user_id']]);

$page_title = 'Moje Usluge';
include 'includes/header.php';
?>

<main>
    <div class="my-services">
        <h2>Moje Usluge</h2>
        <a href="add_service.php" class="add-button">Dodaj Novu Uslugu</a>

        <div class="services-grid">
            <?php while($row = $stmt->fetch(PDO::FETCH_ASSOC)): ?>
                <div class="service-card">
                    <h3><?php echo htmlspecialchars($row['title']); ?></h3>
                    <p><?php echo htmlspecialchars($row['description']); ?></p>
                    <p>Cena: <?php echo htmlspecialchars($row['price']); ?> RSD</p>
                    <p>Prosečna ocena: <?php echo number_format($row['avg_rating'] ?? 0, 1); ?>/5</p>
                    <div class="card-actions">
                        <a href="edit_service.php?id=<?php echo $row['id']; ?>">Izmeni</a>
                        <a href="delete_service.php?id=<?php echo $row['id']; ?>"
                           onclick="return confirm('Da li ste sigurni?')">Obriši</a>
                    </div>
                </div>
            <?php endwhile; ?>
        </div>
    </div>
</main>
</body>
</html>
