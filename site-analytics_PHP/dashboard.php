<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

$required_tables = ['page_views', 'websites', 'clients', 'daily_stats'];
$tables_exist = true;

foreach ($required_tables as $table) {
    if ($conn->query("SHOW TABLES LIKE '$table'")->num_rows == 0) {
        $tables_exist = false;
        break;
    }
}

if (!$tables_exist) {
    die("Database tables are not set up. Please run setup.php first.");
}

$stats = $conn->query("
    SELECT DATE(visit_time) as date,
           COUNT(*) as views,
           COUNT(DISTINCT ip_address) as unique_visitors
    FROM page_views
    WHERE visit_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(visit_time)
    ORDER BY date DESC
");
?>

<div class="dashboard">
    <h1>Analytics Dashboard</h1>

    <div class="stats-grid">
        
        <div class="stat-card">
            <?php
            $today = $conn->query("SELECT COUNT(*) as count FROM page_views WHERE DATE(visit_time) = CURDATE()")->fetch_assoc();
            ?>
            <h3>Today's Visits</h3>
            <div class="stat-number"><?php echo $today['count']; ?></div>
        </div>

        
        <div class="stat-card">
            <h3>Top Pages</h3>
            <ul>
            <?php
            $top_pages = $conn->query("
                SELECT url, COUNT(*) as count
                FROM page_views
                GROUP BY url
                ORDER BY count DESC
                LIMIT 5
            ");
            while($page = $top_pages->fetch_assoc()) {
                echo "<li>{$page['url']} ({$page['count']})</li>";
            }
            ?>
            </ul>
        </div>

        
        <div class="stat-card">
            <h3>Top Referrers</h3>
            <ul>
            <?php
            $referrers = $conn->query("
                SELECT referrer, COUNT(*) as count
                FROM page_views
                WHERE referrer != ''
                GROUP BY referrer
                ORDER BY count DESC
                LIMIT 5
            ");
            while($ref = $referrers->fetch_assoc()) {
                echo "<li>{$ref['referrer']} ({$ref['count']})</li>";
            }
            ?>
            </ul>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
<?php $conn->close(); ?>
