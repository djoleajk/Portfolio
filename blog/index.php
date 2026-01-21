<?php
require_once('config/database.php');

$stmt = $pdo->query("SELECT posts.*, users.username
                     FROM posts
                     JOIN users ON posts.user_id = users.id
                     WHERE posts.status = 'published'
                     ORDER BY created_at DESC");
$posts = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Blog System</title>
</head>
<body>
    <h1>Blog Posts</h1>
    <?php foreach ($posts as $post): ?>
        <article>
            <h2><?php echo htmlspecialchars($post['title']); ?></h2>
            <p>By <?php echo htmlspecialchars($post['username']); ?>
               on <?php echo date('F j, Y', strtotime($post['created_at'])); ?></p>
            <div class="content">
                <?php echo htmlspecialchars($post['content']); ?>
            </div>
        </article>
    <?php endforeach; ?>
</body>
</html>
