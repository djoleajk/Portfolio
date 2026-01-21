<?php
session_start();
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit();
}

$viewer_ip = $_SERVER['REMOTE_ADDR'];
$check_view = "SELECT id FROM views
               WHERE service_id = :service_id
               AND viewer_ip = :viewer_ip
               AND viewed_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)";
$stmt = $db->prepare($check_view);
$stmt->execute([
    ':service_id' => $_GET['id'],
    ':viewer_ip' => $viewer_ip
]);

if (!$stmt->fetch()) {
    $add_view = "INSERT INTO views (service_id, viewer_ip) VALUES (:service_id, :viewer_ip)";
    $stmt = $db->prepare($add_view);
    $stmt->execute([
        ':service_id' => $_GET['id'],
        ':viewer_ip' => $viewer_ip
    ]);
}

$query = "SELECT s.*, u.full_name, u.email, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
          FROM services s
          LEFT JOIN users u ON s.user_id = u.id
          LEFT JOIN reviews r ON s.id = r.service_id
          WHERE s.id = :id
          GROUP BY s.id";
$stmt = $db->prepare($query);
$stmt->execute([':id' => $_GET['id']]);
$service = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$service) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id'])) {
    $query = "INSERT INTO reviews (service_id, user_id, rating, comment)
              VALUES (:service_id, :user_id, :rating, :comment)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        ':service_id' => $_GET['id'],
        ':user_id' => $_SESSION['user_id'],
        ':rating' => $_POST['rating'],
        ':comment' => $_POST['comment']
    ]);
    header("Location: service_details.php?id=" . $_GET['id']);
    exit();
}

$query = "SELECT r.*, u.full_name
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.service_id = :id
          ORDER BY r.created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute([':id' => $_GET['id']]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

$page_title = $service['title'] . ' - Detalji';
include 'includes/header.php';
?>

<main class="container">
    <div class="service-details">
        <div class="service-card detail-card">
            <h1><?php echo htmlspecialchars($service['title']); ?></h1>
            <div class="service-info">
                <div class="info-item">
                    <span class="info-label">Kategorija:</span>
                    <span class="info-value"><?php echo htmlspecialchars($service['category']); ?></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Pružalac usluge:</span>
                    <span class="info-value"><?php echo htmlspecialchars($service['full_name']); ?></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Lokacija:</span>
                    <span class="info-value"><?php echo htmlspecialchars($service['location']); ?></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Cena:</span>
                    <span class="info-value"><?php echo htmlspecialchars($service['price']); ?> RSD</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Prosečna ocena:</span>
                    <span class="info-value"><?php echo number_format($service['avg_rating'], 1); ?>/5
                        (<?php echo $service['review_count']; ?> ocena)</span>
                </div>
            </div>
            <div class="service-description">
                <h3>Opis usluge</h3>
                <p><?php echo nl2br(htmlspecialchars($service['description'])); ?></p>
            </div>
            <div class="contact-info">
                <h3>Kontakt informacije</h3>
                <p><?php echo htmlspecialchars($service['contact_info']); ?></p>
            </div>
            <div class="service-actions">
                <?php if (isset($_SESSION['user_id']) && $service['user_id'] != $_SESSION['user_id']): ?>
                    <button onclick="openMessageForm(<?php echo $service['user_id']; ?>)" class="btn-message">Pošalji poruku</button>
                    <button onclick="reportService(<?php echo $_GET['id']; ?>)" class="btn-report">Prijavi oglas</button>
                <?php endif; ?>
            </div>
        </div>

        <div class="reviews-section">
            <h2>Recenzije i ocene</h2>
            <?php if (isset($_SESSION['user_id'])): ?>
                <form method="POST" class="review-form">
                    <select name="rating" class="form-control" required>
                        <option value="">Izaberite ocenu</option>
                        <option value="5">5 - Odlično</option>
                        <option value="4">4 - Vrlo dobro</option>
                        <option value="3">3 - Dobro</option>
                        <option value="2">2 - Loše</option>
                        <option value="1">1 - Vrlo loše</option>
                    </select>
                    <textarea name="comment" class="form-control"
                              placeholder="Vaš komentar..." required></textarea>
                    <button type="submit" class="btn btn-primary">Pošalji recenziju</button>
                </form>
            <?php endif; ?>

            <div class="reviews-list">
                <?php foreach($reviews as $review): ?>
                    <div class="review-card">
                        <div class="review-header">
                            <span class="reviewer-name"><?php echo htmlspecialchars($review['full_name']); ?></span>
                            <span class="review-rating">Ocena: <?php echo $review['rating']; ?>/5</span>
                        </div>
                        <p class="review-comment"><?php echo nl2br(htmlspecialchars($review['comment'])); ?></p>
                        <span class="review-date">
                            <?php echo date('d.m.Y.', strtotime($review['created_at'])); ?>
                        </span>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</main>
</body>
</html>
