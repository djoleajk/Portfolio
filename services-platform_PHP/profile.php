<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $query = "UPDATE users
              SET full_name = :full_name, email = :email
              WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->execute([
        ':full_name' => $_POST['full_name'],
        ':email' => $_POST['email'],
        ':user_id' => $_SESSION['user_id']
    ]);

    $success = "Profil je uspešno ažuriran";
}

$query = "SELECT * FROM users WHERE id = :user_id";
$stmt = $db->prepare($query);
$stmt->execute([':user_id' => $_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$page_title = 'Moj Profil';
include 'includes/header.php';
?>

<main class="container">
    <div class="profile-container">
        <div class="profile-card">
            <div class="profile-header">
                <h2>Informacije o Profilu</h2>
            </div>
            <div class="profile-details">
                <div class="info-group">
                    <span class="info-label">Korisničko ime</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['username']); ?></span>
                </div>
                <div class="info-group">
                    <span class="info-label">Ime i prezime</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['full_name']); ?></span>
                </div>
                <div class="info-group">
                    <span class="info-label">Email adresa</span>
                    <span class="info-value"><?php echo htmlspecialchars($user['email']); ?></span>
                </div>
                <div class="info-group">
                    <span class="info-label">Tip naloga</span>
                    <span class="info-value"><?php echo $user['user_type'] === 'provider' ? 'Pružalac usluga' : 'Klijent'; ?></span>
                </div>
                <div class="info-group">
                    <span class="info-label">Član od</span>
                    <span class="info-value"><?php echo date('d.m.Y.', strtotime($user['created_at'])); ?></span>
                </div>
            </div>
        </div>

        <div class="profile-card">
            <div class="profile-header">
                <h2>Izmena Profila</h2>
            </div>
            <?php if (isset($success)): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            <form method="POST" class="profile-form">
                <div class="form-group">
                    <label class="info-label">Ime i prezime</label>
                    <input type="text" name="full_name" class="form-control"
                           value="<?php echo htmlspecialchars($user['full_name']); ?>" required>
                </div>
                <div class="form-group">
                    <label class="info-label">Email adresa</label>
                    <input type="email" name="email" class="form-control"
                           value="<?php echo htmlspecialchars($user['email']); ?>" required>
                </div>
                <button type="submit" class="btn btn-primary">Ažuriraj profil</button>
            </form>
        </div>
    </div>
</main>
</body>
</html>
