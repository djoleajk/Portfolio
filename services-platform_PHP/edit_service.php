<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

if (!isset($_GET['id'])) {
    header("Location: my_services.php");
    exit();
}

$query = "SELECT * FROM services WHERE id = :id AND user_id = :user_id";
$stmt = $db->prepare($query);
$stmt->execute([
    ':id' => $_GET['id'],
    ':user_id' => $_SESSION['user_id']
]);
$service = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$service) {
    header("Location: my_services.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $query = "UPDATE services
              SET category = :category, title = :title, description = :description,
                  price = :price, location = :location, contact_info = :contact_info
              WHERE id = :id AND user_id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->execute([
        ':id' => $_GET['id'],
        ':user_id' => $_SESSION['user_id'],
        ':category' => $_POST['category'],
        ':title' => $_POST['title'],
        ':description' => $_POST['description'],
        ':price' => $_POST['price'],
        ':location' => $_POST['location'],
        ':contact_info' => $_POST['contact_info']
    ]);

    header("Location: my_services.php");
    exit();
}

$page_title = 'Izmena Usluge';
include 'includes/header.php';
?>

<main>
    <div class="form-container">
        <h2>Izmena Usluge</h2>
        <form method="POST">
            <input type="text" name="title" placeholder="Naziv usluge"
                   value="<?php echo htmlspecialchars($service['title']); ?>" required>
            <select name="category" required>
                <option value="">Izaberi kategoriju</option>
                <option value="Frizer" <?php echo $service['category'] == 'Frizer' ? 'selected' : ''; ?>>Frizer</option>
                <option value="Majstor" <?php echo $service['category'] == 'Majstor' ? 'selected' : ''; ?>>Majstor</option>
                <option value="Fitnes" <?php echo $service['category'] == 'Fitnes' ? 'selected' : ''; ?>>Fitnes trener</option>
                <option value="Čišćenje" <?php echo $service['category'] == 'Čišćenje' ? 'selected' : ''; ?>>Čišćenje</option>
            </select>
            <textarea name="description" placeholder="Opis usluge" required><?php echo htmlspecialchars($service['description']); ?></textarea>
            <input type="number" name="price" placeholder="Cena"
                   value="<?php echo htmlspecialchars($service['price']); ?>" required>
            <input type="text" name="location" placeholder="Lokacija"
                   value="<?php echo htmlspecialchars($service['location']); ?>" required>
            <input type="text" name="contact_info" placeholder="Kontakt informacije"
                   value="<?php echo htmlspecialchars($service['contact_info']); ?>" required>
            <button type="submit">Sačuvaj izmene</button>
        </form>
    </div>
</main>
</body>
</html>
