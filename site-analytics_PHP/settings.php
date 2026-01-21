<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

}
?>

<div class="content">
    <h1>Settings</h1>

    <div class="settings-grid">
        <div class="settings-card">
            <h3>System Settings</h3>
            <form method="post">
                <div class="form-group">
                    <label>Data Retention (days)</label>
                    <input type="number" name="retention_days" value="30">
                </div>
                <div class="form-group">
                    <label>Enable IP Logging</label>
                    <input type="checkbox" name="ip_logging" checked>
                </div>
                <button type="submit" class="btn">Save Settings</button>
            </form>
        </div>

        <div class="settings-card">
            <h3>API Settings</h3>
            <form method="post">
                <div class="form-group">
                    <label>API Rate Limit (requests/minute)</label>
                    <input type="number" name="rate_limit" value="60">
                </div>
                <button type="submit" class="btn">Update API Settings</button>
            </form>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
