<?php include 'templates/header.php'; ?>

<div class="container-fluid">
    <div class="row">
        
        <main class="col-md-9 ms-sm-auto col-lg-9 px-md-4">
            <?php if (isset($post)): ?>
                <article class="blog-post mt-4">
                    <h1 class="blog-post-title mb-3">
                        <?php echo htmlspecialchars($post['title']); ?>
                    </h1>
                    <p class="blog-post-meta text-muted">
                        <?php echo date('F j, Y', strtotime($post['created_at'])); ?> by
                        <a href="#" class="text-decoration-none">
                            <?php echo htmlspecialchars($post['author']); ?>
                        </a>
                        in
                        <a href="index.php?page=category&id=<?php echo $post['category_id']; ?>" class="text-decoration-none">
                            <?php echo htmlspecialchars($post['category']); ?>
                        </a>
                    </p>

                    <div class="blog-post-content">
                        <?php echo $post['content']; ?>
                    </div>

                    <?php if (!empty($post['tags'])): ?>
                        <div class="blog-post-tags mt-4">
                            <i class="bi bi-tags"></i>
                            <?php foreach ($post['tags'] as $tag): ?>
                                <a href="index.php?page=tag&id=<?php echo $tag['id']; ?>" class="badge bg-secondary text-decoration-none">
                                    <?php echo htmlspecialchars($tag['name']); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <?php if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $post['user_id']): ?>
                        <div class="blog-post-actions mt-4">
                            <a href="index.php?page=edit_post&id=<?php echo $post['id']; ?>" class="btn btn-primary">
                                <i class="bi bi-pencil"></i> Edit Post
                            </a>
                            <form method="post" action="index.php" class="d-inline">
                                <input type="hidden" name="post_action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $post['id']; ?>">
                                <button type="submit" class="btn btn-danger"
                                        onclick="return confirm('Are you sure you want to delete this post?');">
                                    <i class="bi bi-trash"></i> Delete Post
                                </button>
                            </form>
                        </div>
                    <?php endif; ?>
                </article>

                
                <section class="comments mt-5">
                    <h3>Comments</h3>

                    <?php if (isset($_SESSION['user_id'])): ?>
                        <form method="post" action="index.php" class="mb-4">
                            <input type="hidden" name="comment_action" value="create">
                            <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">

                            <div class="mb-3">
                                <label for="comment" class="form-label">Leave a Comment</label>
                                <textarea class="form-control" id="comment" name="content" rows="3" required></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary">Submit Comment</button>
                        </form>
                    <?php else: ?>
                        <p>
                            Please <a href="index.php?page=login">login</a> to leave a comment.
                        </p>
                    <?php endif; ?>

                    <?php if (!empty($comments)): ?>
                        <?php foreach ($comments as $comment): ?>
                            <div class="comment mb-4">
                                <div class="flex-grow-1">
                                    <div class="comment-meta">
                                        <h5 class="mb-1"><?php echo htmlspecialchars($comment['username']); ?></h5>
                                        <p class="text-muted small">
                                            <?php echo date('F j, Y g:i a', strtotime($comment['created_at'])); ?>
                                        </p>
                                    </div>
                                    <div class="comment-content">
                                        <?php echo nl2br(htmlspecialchars($comment['content'])); ?>
                                    </div>
                                    <?php if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $comment['user_id']): ?>
                                        <div class="comment-actions mt-2">
                                            <a href="index.php?comment_action=delete&id=<?php echo $comment['id']; ?>&post_id=<?php echo $post['id']; ?>"
                                               class="btn btn-danger btn-sm"
                                               onclick="return confirm('Are you sure you want to delete this comment?');">
                                                <i class="bi bi-trash"></i> Delete
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p>No comments yet.</p>
                    <?php endif; ?>
                </section>
            <?php else: ?>
                <div class="alert alert-danger">
                    Post not found.
                </div>
            <?php endif; ?>
        </main>

        
        <div class="col-md-3 col-lg-3 d-none d-md-block">
            <div class="position-sticky" style="top: 5rem;">
                
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
                                            <span class="badge bg-secondary float-end">
                                                <?php echo $category['post_count']; ?>
                                            </span>
                                        </a>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php else: ?>
                            <p class="mb-0">No categories found.</p>
                        <?php endif; ?>
                    </div>
                </div>

                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Tags</h5>
                    </div>
                    <div class="card-body">
                        <?php if (!empty($tags)): ?>
                            <div class="tags">
                                <?php foreach ($tags as $tag): ?>
                                    <a href="index.php?page=tag&id=<?php echo $tag['id']; ?>" class="badge bg-secondary text-decoration-none me-1 mb-1">
                                        <?php echo htmlspecialchars($tag['name']); ?>
                                        <span class="badge bg-light text-dark">
                                            <?php echo $tag['post_count']; ?>
                                        </span>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        <?php else: ?>
                            <p class="mb-0">No tags found.</p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>