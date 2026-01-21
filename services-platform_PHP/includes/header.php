<!DOCTYPE html>
<html>
<head>
    <title><?php echo isset($page_title) ? $page_title : 'Lokalne Usluge'; ?></title>
    <link rel="stylesheet" href="/Portfolio/services-platform/css/bootstrap-custom.css">
    <link rel="stylesheet" href="/Portfolio/services-platform/css/style.css">
</head>
<body>
    <header class="navbar">
        <nav class="container navbar-nav">
            <a class="nav-link" href="/Portfolio/services-platform/index.php">Početna</a>
            <?php if(isset($_SESSION['user_id'])): ?>
                <a class="nav-link" href="/Portfolio/services-platform/add_service.php">Dodaj Uslugu</a>
                <a class="nav-link" href="/Portfolio/services-platform/my_services.php">Moje Usluge</a>
                <a class="nav-link" href="/Portfolio/services-platform/profile.php">Profil</a>
                <a class="nav-link" href="/Portfolio/services-platform/logout.php">Odjava</a>
            <?php else: ?>
                <a class="nav-link" href="/Portfolio/services-platform/login.php">Prijava</a>
                <a class="nav-link" href="/Portfolio/services-platform/register.php">Registracija</a>
            <?php endif; ?>
        </nav>
    </header>
