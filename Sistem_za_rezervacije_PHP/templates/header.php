<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem za Rezervacije</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color:
            font-family: 'Arial', sans-serif;
        }
        .navbar {
            background: linear-gradient(90deg,
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .navbar-brand {
            font-weight: bold;
            font-size: 1.5rem;
            color:
        }
        .nav-link {
            color:
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .nav-link:hover {
            color:
        }
        .navbar-toggler {
            border-color: rgba(255, 255, 255, 0.5);
        }
        .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
        }
        footer {
            background-color:
            color:
            padding: 1rem 0;
            text-align: center;
            font-size: 0.9rem;
        }
        footer a {
            color:
            text-decoration: none;
        }
        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<nav class="navbar navbar-expand-lg">
    <div class="container">
        <a class="navbar-brand" href="index.php">Sistem za Rezervacije</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="index.php?page=home">Početna</a></li>
                <li class="nav-item"><a class="nav-link" href="index.php?page=reservations">Rezervacije</a></li>
                <li class="nav-item"><a class="nav-link" href="index.php?page=admin">Administracija</a></li>
            </ul>
        </div>
    </div>
</nav>
<div class="container mt-4">
