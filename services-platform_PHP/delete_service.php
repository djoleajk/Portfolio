<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

if (!isset($_GET['id'])) {
    header("Location: my_services.php");
    exit();
}

include_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();

try {

    $db->beginTransaction();

$query = "DELETE FROM reviews WHERE service_id = :service_id";
    $stmt = $db->prepare($query);
    $stmt->execute([':service_id' => $_GET['id']]);

$query = "DELETE FROM services WHERE id = :id AND user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->execute([
        ':id' => $_GET['id'],
        ':user_id' => $_SESSION['user_id']
    ]);

$db->commit();

    header("Location: my_services.php");
    exit();
} catch (Exception $e) {

    $db->rollBack();
    die("Greška pri brisanju usluge: " . $e->getMessage());
}
