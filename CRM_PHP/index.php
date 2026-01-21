<?php
session_start();
require_once 'config/database.php';

$module = $_GET['module'] ?? 'clients';
$action = $_GET['action'] ?? 'list';
?>

<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM Sistem</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="index.php">CRM Sistem</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="?module=clients">Klijenti</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="?module=contacts">Kontakti</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="?module=meetings">Sastanci</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="?module=sales">Prodaja</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <?php include "modules/$module/index.php"; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
