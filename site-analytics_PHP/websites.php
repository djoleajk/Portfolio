<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

$clients = $conn->query("SELECT * FROM clients");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $client_id = $conn->real_escape_string($_POST['client_id']);
    $domain = $conn->real_escape_string($_POST['domain']);
    $conn->query("INSERT INTO websites (client_id, domain) VALUES ('$client_id', '$domain')");
}

$websites = $conn->query("
    SELECT w.*, c.name as client_name
    FROM websites w
    JOIN clients c ON w.client_id = c.client_id
");
?>

<div class="content">
    <h1>Websites</h1>

    
    <div class="form-container" id="addWebsiteForm" style="display: none;">
        <h3>Add New Website</h3>
        <form id="websiteForm">
            <div class="form-group">
                <label>Client</label>
                <select name="client_id" required>
                    <?php while($client = $clients->fetch_assoc()): ?>
                        <option value="<?php echo $client['client_id']; ?>"><?php echo $client['name']; ?></option>
                    <?php endwhile; ?>
                </select>
            </div>
            <div class="form-group">
                <label>Domain</label>
                <input type="text" name="domain" required placeholder="example.com">
            </div>
            <button type="submit" class="btn">Add Website</button>
        </form>
    </div>

    <div class="action-bar">
        <button onclick="toggleWebsiteForm()" class="btn">Add Website</button>
    </div>

    <table class="data-table">
        <tr>
            <th>ID</th>
            <th>Domain</th>
            <th>Client</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
        <?php while($site = $websites->fetch_assoc()):
            $api_key = $conn->query("SELECT api_key FROM clients WHERE client_id = {$site['client_id']}")->fetch_assoc()['api_key'];
        ?>
        <tr>
            <td><?php echo $site['website_id']; ?></td>
            <td><a href="http://<?php echo $site['domain']; ?>" target="_blank"><?php echo $site['domain']; ?></a></td>
            <td><?php echo $site['client_name']; ?></td>
            <td><?php echo $site['active'] ? 'Active' : 'Inactive'; ?></td>
            <td>
                <a href="view_stats.php?id=<?php echo $site['website_id']; ?>">View Stats</a>
                <button onclick="showTrackingCode('<?php echo $site['website_id']; ?>', '<?php echo $api_key; ?>', '<?php echo $site['domain']; ?>')" class="btn-secondary">Show Code</button>
                <button onclick="deleteWebsite('<?php echo $site['website_id']; ?>', '<?php echo $api_key; ?>', '<?php echo $site['domain']; ?>')" class="btn-danger">Delete</button>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
</div>


<div id="trackingCodeModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Tracking Code for <span id="domainName"></span></h3>
        <p>Add this code to your website's &lt;head&gt; section:</p>
        <pre id="trackingCodeDisplay"></pre>
        <button onclick="copyTrackingCode()" class="btn">Copy Code</button>
    </div>
</div>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
}
.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 500px;
}
.close {
    float: right;
    cursor: pointer;
    font-size: 24px;
}
pre {
    background:
    padding: 15px;
    border-radius: 4px;
    margin: 10px 0;
    white-space: pre-wrap;
}
.btn-secondary {
    padding: 5px 10px;
    margin-left: 10px;
    background:
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.btn-danger {
    background-color:
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 5px;
}

.btn-danger:hover {
    background-color:
}
</style>

<script>
function toggleWebsiteForm() {
    const form = document.getElementById('addWebsiteForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('websiteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

const domain = formData.get('domain');
    if (!domain.match(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/)) {
        alert('Please enter a valid domain name');
        return;
    }

    fetch('api/add_website.php', {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            const codeDisplay = document.createElement('div');
            const domain = formData.get('domain');
            codeDisplay.innerHTML = `
                <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h4>Website Added Successfully</h4>
                    <p>Preview your website: <a href="http://${domain}" target="_blank">${domain}</a></p>
                    <pre>${data.tracking_code}</pre>
                    <button onclick="copyTrackingCode(this)" class="btn">Copy Code</button>
                </div>
            `;
            document.body.appendChild(codeDisplay);
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    });
});

function copyTrackingCode(button) {
    const code = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(code);
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy Code', 2000);
}

function showTrackingCode(websiteId, apiKey, domain) {
    const trackingCode = generateTrackingCode(websiteId, apiKey);
    document.getElementById('domainName').textContent = domain;
    document.getElementById('trackingCodeDisplay').textContent = trackingCode;
    document.getElementById('trackingCodeModal').style.display = 'block';
}

function generateTrackingCode(websiteId, apiKey) {
    return `
<script>
window.analyticsConfig = {
    websiteId: '${websiteId}',
    apiKey: '${apiKey}'
};
<\/script>
<script src="http://localhost/PORTFOLIO/site-analytics/tracker.js"><\/script>`;
}

function copyTrackingCode() {
    const code = document.getElementById('trackingCodeDisplay').textContent;
    navigator.clipboard.writeText(code);
    const btn = event.target;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy Code', 2000);
}

function deleteWebsite(websiteId, apiKey, domain) {
    if (confirm(`Are you sure you want to delete website: ${domain}?`)) {
        fetch('api/delete_website.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `website_id=${websiteId}&api_key=${apiKey}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Website deleted successfully');
                location.reload();
            } else {
                alert('Error deleting website: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting website');
        });
    }
}

document.querySelector('.close').onclick = function() {
    document.getElementById('trackingCodeModal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('trackingCodeModal')) {
        document.getElementById('trackingCodeModal').style.display = 'none';
    }
}
</script>

<?php require_once 'includes/footer.php'; ?>
