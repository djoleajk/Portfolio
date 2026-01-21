<?php
$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'new':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $status = $_POST['status'] ?? 'lead';

            if (!empty($name)) {
                $stmt = $pdo->prepare("INSERT INTO clients (name, email, phone, status) VALUES (?, ?, ?, ?)");
                $stmt->execute([$name, $email, $phone, $status]);
                header('Location: ?module=clients');
                exit;
            }
        }
        ?>
        <h2>Novi Klijent</h2>
        <form method="POST" class="card p-3">
            <div class="mb-3">
                <label for="name" class="form-label">Ime</label>
                <input type="text" class="form-control" id="name" name="name" required>
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
                <label for="status" class="form-label">Status</label>
                <select class="form-control" id="status" name="status">
                    <option value="lead">Potencijalni</option>
                    <option value="contacted">Kontaktiran</option>
                    <option value="customer">Kupac</option>
                </select>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Sačuvaj</button>
                <a href="?module=clients" class="btn btn-secondary">Otkaži</a>
            </div>
        </form>
        <?php
        return;

    case 'edit':
        $id = $_GET['id'] ?? 0;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            $phone = $_POST['phone'] ?? '';
            $status = $_POST['status'] ?? 'lead';

            if (!empty($name)) {
                $stmt = $pdo->prepare("UPDATE clients SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?");
                $stmt->execute([$name, $email, $phone, $status, $id]);
                header('Location: ?module=clients');
                exit;
            }
        }

        $stmt = $pdo->prepare("SELECT * FROM clients WHERE id = ?");
        $stmt->execute([$id]);
        $client = $stmt->fetch();

        if (!$client) {
            header('Location: ?module=clients');
            exit;
        }
        ?>
        <h2>Edit Client</h2>
        <form method="POST" class="card p-3">
            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($client['name']) ?>" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($client['email']) ?>">
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($client['phone']) ?>">
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-control" id="status" name="status">
                    <option value="lead" <?= $client['status'] === 'lead' ? 'selected' : '' ?>>Lead</option>
                    <option value="contacted" <?= $client['status'] === 'contacted' ? 'selected' : '' ?>>Contacted</option>
                    <option value="customer" <?= $client['status'] === 'customer' ? 'selected' : '' ?>>Customer</option>
                </select>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="?module=clients" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
        <?php
        return;

    case 'delete':
        $id = $_GET['id'] ?? 0;
        try {
            $pdo->beginTransaction();

$pdo->prepare("DELETE FROM meetings WHERE client_id = ?")->execute([$id]);
            $pdo->prepare("DELETE FROM sales WHERE client_id = ?")->execute([$id]);
            $pdo->prepare("DELETE FROM contacts WHERE client_id = ?")->execute([$id]);

$pdo->prepare("DELETE FROM clients WHERE id = ?")->execute([$id]);

            $pdo->commit();
        } catch (PDOException $e) {
            $pdo->rollBack();
            die("Error deleting client: " . $e->getMessage());
        }
        header('Location: ?module=clients');
        exit;

    case 'list':
    default:
        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? '';

        $query = "SELECT * FROM clients WHERE 1=1";
        if ($search) {
            $query .= " AND (name LIKE :search OR email LIKE :search)";
        }
        if ($status) {
            $query .= " AND status = :status";
        }

        $stmt = $pdo->prepare($query);
        if ($search) {
            $stmt->bindValue(':search', "%$search%");
        }
        if ($status) {
            $stmt->bindValue(':status', $status);
        }
        $stmt->execute();
        $clients = $stmt->fetchAll();
        ?>
        <div class="row mb-4">
            <div class="col">
                <h2>Klijenti</h2>
            </div>
            <div class="col-auto">
                <a href="?module=clients&action=new" class="btn btn-primary">Novi Klijent</a>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" class="row g-3">
                    <input type="hidden" name="module" value="clients">
                    <div class="col-md-4">
                        <input type="text" name="search" class="form-control" placeholder="Pretraga..." value="<?= htmlspecialchars($search) ?>">
                    </div>
                    <div class="col-md-3">
                        <select name="status" class="form-control">
                            <option value="">Svi Statusi</option>
                            <option value="lead" <?= $status === 'lead' ? 'selected' : '' ?>>Potencijalni</option>
                            <option value="contacted" <?= $status === 'contacted' ? 'selected' : '' ?>>Kontaktirani</option>
                            <option value="customer" <?= $status === 'customer' ? 'selected' : '' ?>>Kupci</option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <button type="submit" class="btn btn-primary">Filtriraj</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Kreiran</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($clients as $client): ?>
                    <tr>
                        <td><?= htmlspecialchars($client['name']) ?></td>
                        <td><span class="badge bg-<?= $client['status'] === 'customer' ? 'success' : ($client['status'] === 'contacted' ? 'warning' : 'secondary') ?>"><?= htmlspecialchars($client['status']) ?></span></td>
                        <td><?= htmlspecialchars($client['email']) ?></td>
                        <td><?= htmlspecialchars($client['phone']) ?></td>
                        <td><?= htmlspecialchars($client['created_at']) ?></td>
                        <td>
                            <a href="?module=clients&action=edit&id=<?= $client['id'] ?>" class="btn btn-sm btn-primary">Izmeni</a>
                            <a href="?module=clients&action=delete&id=<?= $client['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Da li ste sigurni?')">Obriši</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
}
?>
