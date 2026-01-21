<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

$website_id = isset($_GET['website_id']) ? (int)$_GET['website_id'] : 0;
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-d', strtotime('-7 days'));
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d');

$websites = $conn->query("SELECT * FROM websites");

if ($website_id) {
    $stats = $conn->query("
        SELECT DATE(visit_time) as date,
               COUNT(*) as views,
               COUNT(DISTINCT ip_address) as unique_visitors
        FROM page_views
        WHERE website_id = $website_id
        AND DATE(visit_time) BETWEEN '$start_date' AND '$end_date'
        GROUP BY DATE(visit_time)
        ORDER BY date
    ");
}
?>

<div class="content">
    <h1>Reports</h1>

    <form class="report-filter">
        <select name="website_id">
            <option value="">Select Website</option>
            <?php while($site = $websites->fetch_assoc()): ?>
                <option value="<?php echo $site['website_id']; ?>"><?php echo $site['domain']; ?></option>
            <?php endwhile; ?>
        </select>
        <input type="date" name="start_date" value="<?php echo $start_date; ?>">
        <input type="date" name="end_date" value="<?php echo $end_date; ?>">
        <button type="submit" class="btn">Generate Report</button>
    </form>

    <?php if ($website_id && $stats): ?>
        <div class="report-data">
            <table class="data-table">
                <tr>
                    <th>Date</th>
                    <th>Page Views</th>
                    <th>Unique Visitors</th>
                </tr>
                <?php while($row = $stats->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo $row['date']; ?></td>
                        <td><?php echo $row['views']; ?></td>
                        <td><?php echo $row['unique_visitors']; ?></td>
                    </tr>
                <?php endwhile; ?>
            </table>
        </div>
    <?php endif; ?>
</div>

<?php require_once 'includes/footer.php'; ?>
