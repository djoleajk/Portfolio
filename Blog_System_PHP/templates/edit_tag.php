<?php
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
if (!isset($_SESSION['user'])) {
    header('Location: index.php?page=login');
    exit;
}
include 'templates/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title mb-0"><?php echo isset($tag) ? 'Edit Tag' : 'New Tag'; ?></h4>
            </div>
            <div class="card-body">
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form method="post" action="index.php?page=edit_tag">
                    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                    <input type="hidden" name="tag_action" value="<?php echo isset($tag) ? 'update' : 'create'; ?>">
                    <?php if (isset($tag)): ?>
                        <input type="hidden" name="id" value="<?php echo $tag['id']; ?>">
                    <?php endif; ?>

                    <div class="mb-3">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" class="form-control" id="name" name="name"
                               value="<?php echo isset($tag) ? htmlspecialchars($tag['name']) : ''; ?>" required>
                    </div>

                    <div class="d-flex justify-content-between">
                        <a href="index.php?page=admin" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary">
                            <?php echo isset($tag) ? 'Update Tag' : 'Create Tag'; ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>