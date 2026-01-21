<?php include 'templates/header.php'; ?>

<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title mb-0"><?php echo isset($category) ? 'Edit Category' : 'New Category'; ?></h4>
            </div>
            <div class="card-body">
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form method="post" action="index.php">
                    <input type="hidden" name="category_action" value="<?php echo isset($category) ? 'update' : 'create'; ?>">
                    <?php if (isset($category)): ?>
                        <input type="hidden" name="id" value="<?php echo $category['id']; ?>">
                    <?php endif; ?>

                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" name="name"
                               value="<?php echo isset($category) ? htmlspecialchars($category['name']) : ''; ?>" required>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea class="form-control" id="description" name="description" rows="3"><?php
                            echo isset($category) ? htmlspecialchars($category['description']) : '';
                        ?></textarea>
                    </div>

                    <div class="d-flex justify-content-between">
                        <a href="index.php?page=admin" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary">
                            <?php echo isset($category) ? 'Update Category' : 'Create Category'; ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>