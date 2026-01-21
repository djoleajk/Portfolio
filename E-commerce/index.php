<?php
session_start();
require_once 'config/database.php';

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'add':
            $product_id = $_GET['id'];
            $_SESSION['cart'][$product_id] = ($_SESSION['cart'][$product_id] ?? 0) + 1;
            header('Location: index.php?route=cart');
            exit;
        case 'remove':
            if (isset($_POST['product_id'])) {
                unset($_SESSION['cart'][$_POST['product_id']]);
            }
            header('Location: index.php?route=cart');
            exit;
        case 'cancel':
            unset($_SESSION['cart']);
            header('Location: index.php?route=home');
            exit;
    }
}

$route = $_GET['route'] ?? 'home';
require_once 'templates/header.php';

switch ($route) {
    case 'products':
        include 'views/products.php';
        break;
    case 'cart':
        include 'views/cart.php';
        break;
    case 'categories':
        include 'views/categories.php';
        break;
    case 'checkout':
        include 'views/checkout.php';
        break;
    case 'admin':
        if (isset($_SESSION['admin'])) {
            include 'admin/index.php';
        } else {
            header('Location: admin/login.php');
        }
        break;
    default:
        include 'views/home.php';
}

require_once 'templates/footer.php';
?>
