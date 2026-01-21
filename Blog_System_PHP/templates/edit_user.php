<?php include 'templates/header.php'; ?>

<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title mb-0"><?php echo isset($user) ? 'Edit User' : 'New User'; ?></h4>
            </div>
            <div class="card-body">
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger">
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <form method="post" action="index.php">
                    <input type="hidden" name="user_action" value="<?php echo isset($user) ? 'update' : 'create'; ?>">
                    <?php if (isset($user)): ?>
                        <input type="hidden" name="id" value="<?php echo $user['id']; ?>">
                    <?php endif; ?>

                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" name="username"
                               value="<?php echo isset($user) ? htmlspecialchars($user['username']) : ''; ?>" required>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email"
                               value="<?php echo isset($user) ? htmlspecialchars($user['email']) : ''; ?>" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">
                            <?php echo isset($user) ? 'New Password (leave blank to keep current)' : 'Password'; ?>
                        </label>
                        <input type="password" class="form-control" id="password" name="password"
                               <?php echo isset($user) ? '' : 'required'; ?>>
                    </div>

                    <?php if (isset($user)): ?>
                        <div class="mb-3">
                            <label for="confirm_password" class="form-label">Confirm New Password</label>
                            <input type="password" class="form-control" id="confirm_password" name="confirm_password">
                        </div>
                    <?php endif; ?>

                    <div class="mb-3">
                        <label for="role" class="form-label">Role</label>
                        <select class="form-control" id="role" name="role">
                            <option value="user" <?php echo isset($user) && $user['role'] == 'user' ? 'selected' : ''; ?>>
                                User
                            </option>
                            <option value="admin" <?php echo isset($user) && $user['role'] == 'admin' ? 'selected' : ''; ?>>
                                Admin
                            </option>
                        </select>
                    </div>

                    <div class="d-flex justify-content-between">
                        <a href="index.php?page=admin" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary">
                            <?php echo isset($user) ? 'Update User' : 'Create User'; ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'templates/footer.php'; ?>