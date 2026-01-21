<?php include 'templates/header.php'; ?>

<div class="row">
    <div class="col-md-8">
        <?php if ($tag): ?>
            <h1 class="mb-4">Posts tagged with "<?php echo htmlspecialchars($tag['name']); ?>"</h1>

            <?php if (!empty($posts)): ?>
                <?php foreach ($posts as $post): ?>
                    <article class="card mb-4">
                        <div class="card-body">
                            <h2 class="card-title">
                                <a href="index.php?page=post&id=<?php echo $post['id']; ?>" class="text-dark text-decoration-none">
                                    <?php echo htmlspecialchars($post['title']); ?>
                                </a>
                            </h2>
                            <p class="card-text text-muted">
                                Posted by <?php echo htmlspecialchars($post['author_name']); ?>
                                in <?php echo htmlspecialchars($post['category_name'] ?? 'Uncategorized'); ?>
                                on <?php echo date('F j, Y', strtotime($post['created_at'])); ?>
                            </p>
                            <div class="card-text">
                                <?php
                                $content = strip_tags($post['content']);
                                echo strlen($content) > 300 ? substr($content, 0, 300) . '...' : $content;
                                ?>
                            </div>
                            <a href="index.php?page=post&id=<?php echo $post['id']; ?>" class="btn btn-primary mt-3">
                                Read More
                            </a>
                        </div>
                    </article>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="alert alert-info">
                    No posts found with this tag.
                </div>
            <?php endif; ?>
        <?php else: ?>
            <div class="alert alert-danger">
                Tag not found.
            </div>
        <?php endif; ?>
    </div>

    <div class="col-md-4">
        
        <div class="card mb-4">
            <div class="card-header">
                <h5 class="card-title mb-0">Categories</h5>
            </div>
            <div class="card-body">
                <?php if (!empty($categories)): ?>
                    <ul class="list-unstyled mb-0">
                        <?php foreach ($categories as $category): ?>
                            <li class="mb-2">
                                <a href="index.php?page=category&id=<?php echo $category['id']; ?>" class="text-decoration-none">
                                    <?php echo htmlspecialchars($category['name']); ?>
                                    <span class="badge bg-secondary float-end"><?php echo $category['post_count']; ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <p class="text-muted mb-0">No categories found.</p>
                <?php endif; ?>
            </div>
        </div>

        
        <div class="card">
            <div class="card-header">
                <h5 class="card-title mb-0">Tags</h5>
            </div>
            <div class="card-body">
                <?php if (!empty($tags)): ?>
                    <div class="d-flex flex-wrap gap-2">
                        <?php foreach ($tags as $t): ?>
                            <a href="index.php?page=tag&id=<?php echo $t['id']; ?>"
                               class="badge bg-secondary text-decoration-none <?php echo $t['id'] == $tag['id'] ? 'bg-primary' : ''; ?>">
                                <?php echo htmlspecialchars($t['name']); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p class="text-muted mb-0">No tags found.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>