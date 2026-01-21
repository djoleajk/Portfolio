<?php
$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'new':

        $clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $position = $_POST['position'] ?? '';
            $client_id = $_POST['client_id'] ?? '';

            if (!empty($name) && !empty($client_id)) {
                $stmt = $pdo->prepare("INSERT INTO contacts (name, email, phone, position, client_id) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$name, $email, $phone, $position, $client_id]);
                header('Location: ?module=contacts');
                exit;
            }
        }
        ?>
        <h2>Novi Kontakt</h2>
        <form method="POST" class="card p-3">
            <div class="mb-3">
                <label for="client_id" class="form-label">Klijent</label>
                <select class="form-control" id="client_id" name="client_id" required>
                    <option value="">Izaberi Klijenta</option>
                    <?php foreach ($clients as $client): ?>
                        <option value="<?= $client['id'] ?>"><?= htmlspecialchars($client['name']) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="mb-3">
                <label for="name" class="form-label">Ime</label>
                <input type="text" class="form-control" id="name" name="name" required>
            </div>
            <div class="mb-3">
                <label for="position" class="form-label">Pozicija</label>
                <input type="text" class="form-control" id="position" name="position">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email">
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Telefon</label>
                <input type="tel" class="form-control" id="phone" name="phone">
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Sačuvaj</button>
                <a href="?module=contacts" class="btn btn-secondary">Otkaži</a>
            </div>
        </form>
        <?php
        return;

    case 'edit':
        $id = $_GET['id'] ?? 0;
        $clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $position = $_POST['position'] ?? '';
            $client_id = $_POST['client_id'] ?? '';

            if (!empty($name) && !empty($client_id)) {
                $stmt = $pdo->prepare("UPDATE contacts SET name = ?, email = ?, phone = ?, position = ?, client_id = ? WHERE id = ?");
                $stmt->execute([$name, $email, $phone, $position, $client_id, $id]);
                header('Location: ?module=contacts');
                exit;
            }
        }

        $stmt = $pdo->prepare("SELECT * FROM contacts WHERE id = ?");
        $stmt->execute([$id]);
        $contact = $stmt->fetch();

        if (!$contact) {
            header('Location: ?module=contacts');
            exit;
        }
        ?>
        <h2>Edit Contact</h2>
        <form method="POST" class="card p-3">
            <div class="mb-3">
                <label for="client_id" class="form-label">Client</label>
                <select class="form-control" id="client_id" name="client_id" required>
                    <option value="">Select Client</option>
                    <?php foreach ($clients as $client): ?>
                        <option value="<?= $client['id'] ?>" <?= $contact['client_id'] == $client['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($client['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($contact['name']) ?>" required>
            </div>
            <div class="mb-3">
                <label for="position" class="form-label">Position</label>
                <input type="text" class="form-control" id="position" name="position" value="<?= htmlspecialchars($contact['position']) ?>">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($contact['email']) ?>">
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($contact['phone']) ?>">
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="?module=contacts" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
        <?php
        return;

    case 'delete':
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->execute([$id]);
        header('Location: ?module=contacts');
        exit;

    case 'list':
    default:
        $search = $_GET['search'] ?? '';
        $client_id = $_GET['client_id'] ?? '';

        $query = "SELECT c.*, cl.name as client_name
                  FROM contacts c
                  LEFT JOIN clients cl ON c.client_id = cl.id
                  WHERE 1=1";

        if ($search) {
            $query .= " AND (c.name LIKE :search OR c.email LIKE :search)";
        }
        if ($client_id) {
            $query .= " AND c.client_id = :client_id";
        }

        $stmt = $pdo->prepare($query);
        if ($search) {
            $stmt->bindValue(':search', "%$search%");
        }
        if ($client_id) {
            $stmt->bindValue(':client_id', $client_id);
        }
        $stmt->execute();
        $contacts = $stmt->fetchAll();

$clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();
        ?>

        <div class="row mb-4">
            <div class="col">
                <h2>Kontakti</h2>
            </div>
            <div class="col-auto">
                <a href="?module=contacts&action=new" class="btn btn-primary">Novi Kontakt</a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" class="row g-3">
                    <input type="hidden" name="module" value="contacts">
                    <div class="col-md-4">
                        <input type="text" name="search" class="form-control" placeholder="Pretraga..." value="<?= htmlspecialchars($search) ?>">
                    </div>
                    <div class="col-md-3">
                        <select name="client_id" class="form-control">
                            <option value="">Svi Klijenti</option>
                            <?php foreach ($clients as $client): ?>
                                <option value="<?= $client['id'] ?>" <?= $client_id == $client['id'] ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($client['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-auto">
                        <button type="submit" class="btn btn-primary">Filter</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Klijent</th>
                        <th>Pozicija</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($contacts as $contact): ?>
                    <tr>
                        <td><?= htmlspecialchars($contact['name']) ?></td>
                        <td><?= htmlspecialchars($contact['client_name']) ?></td>
                        <td><?= htmlspecialchars($contact['position']) ?></td>
                        <td><?= htmlspecialchars($contact['email']) ?></td>
                        <td><?= htmlspecialchars($contact['phone']) ?></td>
                        <td>
                            <a href="?module=contacts&action=edit&id=<?= $contact['id'] ?>" class="btn btn-sm btn-primary">Izmeni</a>
                            <a href="?module=contacts&action=delete&id=<?= $contact['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Da li ste sigurni?')">Obriši</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
}
?>
