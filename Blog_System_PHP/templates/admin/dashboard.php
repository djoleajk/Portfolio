<?php include '../templates/header.php'; ?>


<div class="row mb-4">
    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total Posts</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">
                            <?php echo count($posts); ?>
                        </div>
                    </div>
                    <div class="col-auto">
                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Categories</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">
                            <?php echo count($categories); ?>
                        </div>
                    </div>
                    <div class="col-auto">
                        <i class="fas fa-folder fa-2x text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Tags</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">
                            <?php echo count($tags); ?>
                        </div>
                    </div>
                    <div class="col-auto">
                        <i class="fas fa-tags fa-2x text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
                <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Recent Posts</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">
                            <?php
                            $recent_posts = array_filter($posts, function($post) {
                                return strtotime($post['created_at']) > strtotime('-7 days');
                            });
                            echo count($recent_posts);
                            ?>
                        </div>
                    </div>
                    <div class="col-auto">
                        <i class="fas fa-clock fa-2x text-gray-300"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-3">
        <div class="list-group">
            <a href="#posts" class="list-group-item list-group-item-action active" data-bs-toggle="list">Posts</a>
            <a href="#categories" class="list-group-item list-group-item-action" data-bs-toggle="list">Categories</a>
            <a href="#tags" class="list-group-item list-group-item-action" data-bs-toggle="list">Tags</a>
        </div>
    </div>

    <div class="col-md-9">
        <div class="tab-content">
            
            <div class="tab-pane fade show active" id="posts">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Manage Posts</h2>
                    <a href="index.php?page=edit_post" class="btn btn-primary">
                        <i class="fas fa-plus"></i> New Post
                    </a>
                </div>

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($posts)): ?>
                                <?php foreach ($posts as $p): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($p['title']); ?></td>
                                    <td><?php echo htmlspecialchars($p['category_name'] ?? 'Uncategorized'); ?></td>
                                    <td>
                                        <span class="badge bg-<?php echo $p['status'] === 'published' ? 'success' : 'warning'; ?>">
                                            <?php echo ucfirst($p['status']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('M j, Y', strtotime($p['created_at'])); ?></td>
                                    <td>
                                        <a href="index.php?page=edit_post&id=<?php echo $p['id']; ?>" class="btn btn-sm btn-primary">
                                            <i class="fas fa-edit"></i> Edit
                                        </a>
                                        <form method="post" action="index.php" class="d-inline">
                                            <input type="hidden" name="post_action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $p['id']; ?>">
                                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">
                                                <i class="fas fa-trash"></i> Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="5" class="text-center">No posts found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            
            <div class="tab-pane fade" id="categories">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Manage Categories</h2>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newCategoryModal">
                        <i class="fas fa-plus"></i> New Category
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($categories)): ?>
                                <?php foreach ($categories as $cat): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($cat['name']); ?></td>
                                    <td><?php echo htmlspecialchars($cat['description']); ?></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary edit-category" data-id="<?php echo $cat['id']; ?>">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <form method="post" action="index.php" class="d-inline">
                                            <input type="hidden" name="category_action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $cat['id']; ?>">
                                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">
                                                <i class="fas fa-trash"></i> Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="3" class="text-center">No categories found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            
            <div class="tab-pane fade" id="tags">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Manage Tags</h2>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newTagModal">
                        <i class="fas fa-plus"></i> New Tag
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($tags)): ?>
                                <?php foreach ($tags as $t): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($t['name']); ?></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary edit-tag" data-id="<?php echo $t['id']; ?>">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <form method="post" action="index.php" class="d-inline">
                                            <input type="hidden" name="tag_action" value="delete">
                                            <input type="hidden" name="id" value="<?php echo $t['id']; ?>">
                                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">
                                                <i class="fas fa-trash"></i> Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="2" class="text-center">No tags found.</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="newCategoryModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">New Category</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form method="post" action="index.php">
                    <input type="hidden" name="category_action" value="create">

                    <div class="mb-3">
                        <label for="category_name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="category_name" name="name" required>
                    </div>

                    <div class="mb-3">
                        <label for="category_description" class="form-label">Description</label>
                        <textarea class="form-control" id="category_description" name="description" rows="3"></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary">Create Category</button>
                </form>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="newTagModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">New Tag</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form method="post" action="index.php">
                    <input type="hidden" name="tag_action" value="create">

                    <div class="mb-3">
                        <label for="tag_name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="tag_name" name="name" required>
                    </div>

                    <button type="submit" class="btn btn-primary">Create Tag</button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include '../templates/footer.php'; ?>