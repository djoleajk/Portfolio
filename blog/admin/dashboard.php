<?php
session_start();
require_once('../config/database.php');

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

$stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
$posts = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
</head>
<body>
    <h1>Blog Posts</h1>
    <a href="new_post.php">Add New Post</a>

    <div class="posts">
        <?php foreach ($posts as $post): ?>
            <div class="post">
                <h2><?php echo htmlspecialchars($post['title']); ?></h2>
                <p><?php echo substr(htmlspecialchars($post['content']), 0, 100); ?>...</p>
                <a href="edit_post.php?id=<?php echo $post['id']; ?>">Edit</a>
                <a href="delete_post.php?id=<?php echo $post['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
