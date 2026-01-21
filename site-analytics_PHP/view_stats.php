<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

$website_id = (int)$_GET['id'];

$website = $conn->query("
    SELECT w.*, c.name as client_name
    FROM websites w
    JOIN clients c ON w.client_id = c.client_id
    WHERE w.website_id = $website_id
")->fetch_assoc();

if (!$website) {
    die("Website not found");
}
?>

<div class="content">
    <h1>Statistics for <?php echo htmlspecialchars($website['domain']); ?></h1>
    <p>Client: <?php echo htmlspecialchars($website['client_name']); ?></p>

    <div class="stats-grid">
        
        <div class="stat-card">
            <?php
            $today = $conn->query("
                SELECT COUNT(*) as views,
                       COUNT(DISTINCT ip_address) as unique_visitors
                FROM page_views
                WHERE website_id = $website_id
                AND DATE(visit_time) = CURDATE()
            ")->fetch_assoc();
            ?>
            <h3>Today's Stats</h3>
            <p>Page Views: <?php echo $today['views']; ?></p>
            <p>Unique Visitors: <?php echo $today['unique_visitors']; ?></p>
        </div>

        
        <div class="stat-card">
            <h3>Most Visited Pages</h3>
            <table class="mini-table">
                <tr>
                    <th>URL</th>
                    <th>Views</th>
                </tr>
                <?php
                $top_pages = $conn->query("
                    SELECT url, COUNT(*) as count
                    FROM page_views
                    WHERE website_id = $website_id
                    GROUP BY url
                    ORDER BY count DESC
                    LIMIT 5
                ");
                while($page = $top_pages->fetch_assoc()): ?>
                <tr>
                    <td><?php echo htmlspecialchars($page['url']); ?></td>
                    <td><?php echo $page['count']; ?></td>
                </tr>
                <?php endwhile; ?>
            </table>
        </div>

        
        <div class="stat-card">
            <h3>Top Referrers</h3>
            <table class="mini-table">
                <tr>
                    <th>Source</th>
                    <th>Visits</th>
                </tr>
                <?php
                $referrers = $conn->query("
                    SELECT referrer, COUNT(*) as count
                    FROM page_views
                    WHERE website_id = $website_id
                    AND referrer != ''
                    GROUP BY referrer
                    ORDER BY count DESC
                    LIMIT 5
                ");
                while($ref = $referrers->fetch_assoc()): ?>
                <tr>
                    <td><?php echo htmlspecialchars($ref['referrer']); ?></td>
                    <td><?php echo $ref['count']; ?></td>
                </tr>
                <?php endwhile; ?>
            </table>
        </div>

        
        <div class="stat-card">
            <h3>Top Referring Domains</h3>
            <table class="mini-table">
                <tr>
                    <th>Domain</th>
                    <th>Visits</th>
                    <th>Last Visit</th>
                </tr>
                <?php
                $domains = $conn->query("
                    SELECT domain, visit_count, last_visit
                    FROM referrer_domains
                    WHERE website_id = $website_id
                    ORDER BY visit_count DESC
                    LIMIT 10
                ");

                while($domain = $domains->fetch_assoc()): ?>
                <tr>
                    <td><?php echo htmlspecialchars($domain['domain']); ?></td>
                    <td><?php echo $domain['visit_count']; ?></td>
                    <td><?php echo date('d.m.Y H:i', strtotime($domain['last_visit'])); ?></td>
                </tr>
                <?php endwhile; ?>
            </table>
        </div>
    </div>

    
    <div class="stat-card">
        <h3>Visit History (Last 7 Days)</h3>
        <canvas id="visitsChart"></canvas>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
<?php
$daily_stats = $conn->query("
    SELECT DATE(visit_time) as date,
           COUNT(*) as views,
           COUNT(DISTINCT ip_address) as unique_visitors
    FROM page_views
    WHERE website_id = $website_id
    AND visit_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(visit_time)
    ORDER BY date ASC
");

$dates = [];
$views = [];
$visitors = [];

while($row = $daily_stats->fetch_assoc()) {
    $dates[] = $row['date'];
    $views[] = $row['views'];
    $visitors[] = $row['unique_visitors'];
}
?>

new Chart(document.getElementById('visitsChart'), {
    type: 'line',
    data: {
        labels: <?php echo json_encode($dates); ?>,
        datasets: [{
            label: 'Page Views',
            data: <?php echo json_encode($views); ?>,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }, {
            label: 'Unique Visitors',
            data: <?php echo json_encode($visitors); ?>,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    }
});
</script>

<?php
$conn->close();
require_once 'includes/footer.php';
?>
