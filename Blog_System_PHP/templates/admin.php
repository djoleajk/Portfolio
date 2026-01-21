<?php include 'templates/header.php'; ?>

<div class="container-fluid">
    <div class="row">
        <nav class="col-md-2 d-none d-md-block bg-light sidebar">
            <div class="position-sticky pt-3">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#posts">
                            <i class="bi bi-file-text"></i> Posts
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#categories">
                            <i class="bi bi-folder"></i> Categories
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#tags">
                            <i class="bi bi-tags"></i> Tags
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#users">
                            <i class="bi bi-people"></i> Users
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Dashboard</h1>
            </div>

            
            <section id="posts" class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Posts</h2>
                    <a href="index.php?page=edit_post" class="btn btn-primary">
                        <i class="bi bi-plus-lg"></i> New Post
                    </a>
                </div>

                <?php if (!empty($posts)): ?>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($posts as $post): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($post['title']); ?></td>
                                        <td><?php echo htmlspecialchars($post['username'] ?? 'Anonymous'); ?></td>
                                        <td><?php echo htmlspecialchars($post['category'] ?? 'Uncategorized'); ?></td>
                                        <td><?php echo date('Y-m-d', strtotime($post['created_at'])); ?></td>
                                        <td>
                                            <a href="index.php?page=edit_post&id=<?php echo $post['id']; ?>" class="btn btn-sm btn-primary">
                                                <i class="bi bi-pencil"></i>
                                            </a>
                                            <form method="post" action="index.php" class="d-inline">
                                                <input type="hidden" name="post_action" value="delete">
                                                <input type="hidden" name="id" value="<?php echo $post['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-danger"
                                                        onclick="return confirm('Are you sure you want to delete this post?');">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <p>No posts found.</p>
                <?php endif; ?>
            </section>

            
            <section id="categories" class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Categories</h2>
                    <a href="index.php?page=edit_category" class="btn btn-primary">
                        <i class="bi bi-plus-lg"></i> New Category
                    </a>
                </div>

                <?php if (!empty($categories)): ?>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Posts</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($categories as $category): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($category['name']); ?></td>
                                        <td><?php echo $category['post_count']; ?></td>
                                        <td>
                                            <a href="index.php?page=edit_category&id=<?php echo $category['id']; ?>" class="btn btn-sm btn-primary">
                                                <i class="bi bi-pencil"></i>
                                            </a>
                                            <form method="post" action="index.php" class="d-inline">
                                                <input type="hidden" name="category_action" value="delete">
                                                <input type="hidden" name="id" value="<?php echo $category['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-danger"
                                                        onclick="return confirm('Are you sure you want to delete this category?');">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <p>No categories found.</p>
                <?php endif; ?>
            </section>

            
            <section id="tags" class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Tags</h2>
                    <a href="index.php?page=edit_tag" class="btn btn-primary">
                        <i class="bi bi-plus-lg"></i> New Tag
                    </a>
                </div>

                <?php if (!empty($tags)): ?>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Posts</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($tags as $tag): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($tag['name']); ?></td>
                                        <td><?php echo $tag['post_count']; ?></td>
                                        <td>
                                            <a href="index.php?page=edit_tag&id=<?php echo $tag['id']; ?>" class="btn btn-sm btn-primary">
                                                <i class="bi bi-pencil"></i>
                                            </a>
                                            <form method="post" action="index.php" class="d-inline">
                                                <input type="hidden" name="tag_action" value="delete">
                                                <input type="hidden" name="id" value="<?php echo $tag['id']; ?>">
                                                <button type="submit" class="btn btn-sm btn-danger"
                                                        onclick="return confirm('Are you sure you want to delete this tag?');">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <p>No tags found.</p>
                <?php endif; ?>
            </section>

            
            <section id="users" class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h2>Users</h2>
                    <a href="index.php?page=edit_user" class="btn btn-primary">
                        <i class="bi bi-plus-lg"></i> New User
                    </a>
                </div>

                <?php if (!empty($users)): ?>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($user['username']); ?></td>
                                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                                        <td><?php echo htmlspecialchars($user['role']); ?></td>
                                        <td>
                                            <a href="index.php?page=edit_user&id=<?php echo $user['id']; ?>" class="btn btn-sm btn-primary">
                                                <i class="bi bi-pencil"></i>
                                            </a>
                                            <?php if ($user['id'] != $_SESSION['user_id']): ?>
                                                <a href="index.php?user_action=delete&id=<?php echo $user['id']; ?>"
                                                   class="btn btn-sm btn-danger"
                                                   onclick="return confirm('Are you sure you want to delete this user?');">
                                                    <i class="bi bi-trash"></i>
                                                </a>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <p>No users found.</p>
                <?php endif; ?>
            </section>
        </main>
    </div>
</div>
