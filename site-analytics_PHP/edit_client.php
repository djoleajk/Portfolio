<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

$client_id = (int)$_GET['id'];
$client = $conn->query("SELECT * FROM clients WHERE client_id = $client_id")->fetch_assoc();

if (!$client) {
    die("Client not found");
}
?>

<div class="content">
    <h1>Edit Client</h1>

    <div class="form-container">
        <form id="editClientForm">
            <input type="hidden" name="client_id" value="<?php echo $client['client_id']; ?>">

            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" value="<?php echo htmlspecialchars($client['name']); ?>" required>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" value="<?php echo htmlspecialchars($client['email']); ?>" required>
            </div>

            <div class="form-group">
                <label>API Key</label>
                <input type="text" value="<?php echo $client['api_key']; ?>" readonly>
                <button type="button" onclick="regenerateApiKey()" class="btn-secondary">Regenerate API Key</button>
            </div>

            <button type="submit" class="btn">Save Changes</button>
        </form>
    </div>
</div>

<script>
document.getElementById('editClientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('api/update_client.php', {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert('Client updated successfully!');
            window.location.href = 'clients.php';
        } else {
            alert('Error: ' + data.message);
        }
    });
});

function regenerateApiKey() {
    if (!confirm('Are you sure? This will invalidate the existing API key.')) return;

    fetch('api/regenerate_api_key.php', {
        method: 'POST',
        body: JSON.stringify({
            client_id: <?php echo $client_id; ?>
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    });
}
</script>

<?php require_once 'includes/footer.php'; ?>
