<?php
require_once 'config/database.php';
require_once 'includes/header.php';

$db = new Database();
$conn = $db->connect();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $api_key = md5(uniqid(rand(), true));
    $conn->query("INSERT INTO clients (name, email, api_key) VALUES ('$name', '$email', '$api_key')");
}

$clients = $conn->query("SELECT * FROM clients");
?>

<div class="content">
    <h1>Clients</h1>

    
    <div class="form-container" id="addClientForm" style="display: none;">
        <h3>Add New Client</h3>
        <form id="clientForm">
            <div class="form-group">
                <label>Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <button type="submit" class="btn">Add Client</button>
        </form>
    </div>

    <div class="action-bar">
        <button onclick="toggleClientForm()" class="btn">Add Client</button>
    </div>

    <table class="data-table">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>API Key</th>
            <th>Actions</th>
        </tr>
        <?php while($client = $clients->fetch_assoc()): ?>
        <tr>
            <td><?php echo $client['client_id']; ?></td>
            <td><?php echo $client['name']; ?></td>
            <td><?php echo $client['email']; ?></td>
            <td><?php echo $client['api_key']; ?></td>
            <td>
                <a href="edit_client.php?id=<?php echo $client['client_id']; ?>">Edit</a>
            </td>
        </tr>
        <?php endwhile; ?>
    </table>
</div>

<script>
function toggleClientForm() {
    const form = document.getElementById('addClientForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('clientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('api/add_client.php', {
        method: 'POST',
        body: new URLSearchParams(formData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert('Client added successfully!');
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    });
});
</script>

<?php require_once 'includes/footer.php'; ?>
