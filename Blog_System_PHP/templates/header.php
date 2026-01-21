<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple CMS</title>

    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" rel="stylesheet">

    
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">

    
    <script src="https://cdn.ckeditor.com/ckeditor5/36.0.1/classic/ckeditor.js"></script>

    <style>
        .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 100;
            padding: 48px 0 0;
            box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
        }

        .sidebar-sticky {
            position: relative;
            top: 0;
            height: calc(100vh - 48px);
            padding-top: .5rem;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .navbar-brand {
            padding-top: .75rem;
            padding-bottom: .75rem;
        }

        .navbar .navbar-toggler {
            top: .25rem;
            right: 1rem;
        }
        .content {
            margin-top: 2rem;
        }
        .footer {
            margin-top: 3rem;
            padding: 1rem 0;
            background-color:
        }
        .ck-editor__editable {
            min-height: 400px;
        }

        @media (max-width: 767.98px) {
            .navbar-collapse {
                background-color:
                padding: 1rem;
            }
            .navbar-nav .nav-link {
                padding: 0.5rem 1rem;
            }
        }
    </style>
</head>
<body>
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="index.php">Simple CMS</a>
        <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav me-auto">
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php">Home</a>
                </div>
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=posts">Posts</a>
                </div>
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=categories">Categories</a>
                </div>
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=tags">Tags</a>
                </div>
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=about">About</a>
                </div>
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=contact">Contact</a>
                </div>
            </div>
        </div>

        <?php if (isset($_SESSION['user_id'])): ?>
            <div class="navbar-nav ms-auto">
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=admin">Dashboard</a>
                </div>
            </div>
            <div class="navbar-nav">
                <div class="nav-item text-nowrap">
                    <span class="nav-link px-3 text-light">
                        <i class="bi bi-person-circle"></i> <?php echo htmlspecialchars($_SESSION['username']); ?> -
                        <a class="text-light" href="index.php?action=logout">Sign out</a>
                    </span>
                </div>
            </div>
        <?php else: ?>
            <div class="navbar-nav ms-auto">
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=login">Login</a>
                </div>
            </div>
            <div class="navbar-nav">
                <div class="nav-item text-nowrap">
                    <a class="nav-link px-3" href="index.php?page=register">Register</a>
                </div>
            </div>
        <?php endif; ?>
    </header>

    <?php if (isset($_SESSION['message'])): ?>
        <div class="alert alert-<?php echo $_SESSION['message_type']; ?> alert-dismissible fade show" role="alert">
            <?php
                echo $_SESSION['message'];
                unset($_SESSION['message']);
                unset($_SESSION['message_type']);
            ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    <?php endif; ?>

    <div class="container content">
        <?php if (isset($error)): ?>
            <div class="alert alert-danger">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>