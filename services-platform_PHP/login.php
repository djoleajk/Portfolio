<?php
session_start();
include_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $database = new Database();
    $db = $database->getConnection();

    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = "SELECT id, password FROM users WHERE username = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$username]);

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            header("Location: index.php");
            exit();
        }
    }
    $error = "Pogrešno korisničko ime ili lozinka";
}

$page_title = 'Prijava';
include 'includes/header.php';
?>

<main>
    <div class="form-container">
        <h2>Prijava</h2>
        <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="Korisničko ime" required>
            <input type="password" name="password" placeholder="Lozinka" required>
            <button type="submit">Prijavi se</button>
        </form>
        <p>Nemate nalog? <a href="register.php">Registrujte se</a></p>
    </div>
</main>
</body>
</html>
