<?php
session_start();
include_once 'config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $database = new Database();
    $db = $database->getConnection();

    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = $_POST['email'];
    $full_name = $_POST['full_name'];
    $user_type = $_POST['user_type'];

    try {
        $query = "INSERT INTO users (username, password, email, full_name, user_type)
                  VALUES (?, ?, ?, ?, ?)";
        $stmt = $db->prepare($query);
        $stmt->execute([$username, $password, $email, $full_name, $user_type]);

        $_SESSION['user_id'] = $db->lastInsertId();
        header("Location: index.php");
        exit();
    } catch (PDOException $e) {
        $error = "Greška pri registraciji. Korisničko ime ili email već postoji.";
    }
}

$page_title = 'Registracija';
include 'includes/header.php';
?>

<main>
    <div class="form-container">
        <h2>Registracija</h2>
        <?php if (isset($error)) echo "<p class='error'>$error</p>"; ?>
        <form method="POST">
            <input type="text" name="username" placeholder="Korisničko ime" required>
            <input type="password" name="password" placeholder="Lozinka" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="full_name" placeholder="Puno ime" required>
            <select name="user_type" required>
                <option value="client">Klijent</option>
                <option value="provider">Pružalac usluga</option>
            </select>
            <button type="submit">Registruj se</button>
        </form>
        <p>Već imate nalog? <a href="login.php">Prijavite se</a></p>
    </div>
</main>
</body>
</html>
