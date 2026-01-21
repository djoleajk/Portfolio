<?php
require_once 'config/database.php';

function getTasks($conn) {
    $sql = "SELECT * FROM todo_items ORDER BY created_at DESC";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add']) && !empty($_POST['task'])) {
        $task = $conn->real_escape_string($_POST['task']);
        $sql = "INSERT INTO todo_items (task) VALUES ('$task')";
        $conn->query($sql);
    }

    if (isset($_POST['toggle']) && isset($_POST['id'])) {
        $id = (int)$_POST['id'];
        $sql = "UPDATE todo_items SET completed = NOT completed WHERE id = $id";
        $conn->query($sql);
    }

    if (isset($_POST['delete']) && isset($_POST['id'])) {
        $id = (int)$_POST['id'];
        $sql = "DELETE FROM todo_items WHERE id = $id";
        $conn->query($sql);
    }

    header('Location: index.php');
    exit();
}
