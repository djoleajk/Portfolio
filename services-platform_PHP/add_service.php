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
    $query = "INSERT INTO services (user_id, category, title, description, price, location, contact_info)
              VALUES (:user_id, :category, :title, :description, :price, :location, :contact_info)";

    $stmt = $db->prepare($query);
    $stmt->execute([
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

$page_title = 'Dodaj Uslugu';
include 'includes/header.php';
?>

<main>
    <div class="form-container">
        <h2>Dodaj Novu Uslugu</h2>
        <form method="POST">
            <input type="text" name="title" placeholder="Naziv usluge" required>
            <select name="category" required>
                <option value="">Izaberi kategoriju</option>
                <option value="Frizer">Frizer</option>
                <option value="Majstor">Majstor</option>
                <option value="Fitnes">Fitnes trener</option>
                <option value="Čišćenje">Čišćenje</option>
            </select>
            <textarea name="description" placeholder="Opis usluge" required></textarea>
            <input type="number" name="price" placeholder="Cena" required>
            <input type="text" name="location" placeholder="Lokacija" required>
            <input type="text" name="contact_info" placeholder="Kontakt informacije" required>
            <button type="submit">Dodaj uslugu</button>
        </form>
    </div>
</main>
</body>
</html>
