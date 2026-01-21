<?php
require_once 'config/database.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'create':

        $clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $client_id = $_POST['client_id'] ?? '';
            $amount = $_POST['amount'] ?? '';
            $sale_date = $_POST['sale_date'] ?? '';
            $description = $_POST['description'] ?? '';

            if (!empty($client_id) && !empty($amount) && !empty($sale_date)) {
                $stmt = $pdo->prepare("INSERT INTO sales (client_id, amount, sale_date, description) VALUES (?, ?, ?, ?)");
                $stmt->execute([$client_id, $amount, $sale_date, $description]);
                header('Location: ?module=sales');
                exit;
            }
        }
        ?>
        <h2>Nova Prodaja</h2>
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
                <label for="amount" class="form-label">Iznos</label>
                <input type="number" step="0.01" class="form-control" id="amount" name="amount" required>
            </div>
            <div class="mb-3">
                <label for="sale_date" class="form-label">Datum Prodaje</label>
                <input type="datetime-local" class="form-control" id="sale_date" name="sale_date" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Opis</label>
                <textarea class="form-control" id="description" name="description"></textarea>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Sačuvaj</button>
                <a href="?module=sales" class="btn btn-secondary">Otkaži</a>
            </div>
        </form>
        <?php
        return;

    case 'edit':
        $id = $_GET['id'] ?? 0;
        $clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $client_id = $_POST['client_id'] ?? '';
            $amount = $_POST['amount'] ?? '';
            $sale_date = $_POST['sale_date'] ?? '';
            $description = $_POST['description'] ?? '';

            if (!empty($client_id) && !empty($amount) && !empty($sale_date)) {
                $stmt = $pdo->prepare("UPDATE sales SET client_id = ?, amount = ?, sale_date = ?, description = ? WHERE id = ?");
                $stmt->execute([$client_id, $amount, $sale_date, $description, $id]);
                header('Location: ?module=sales');
                exit;
            }
        }

        $stmt = $pdo->prepare("SELECT * FROM sales WHERE id = ?");
        $stmt->execute([$id]);
        $sale = $stmt->fetch();

        if (!$sale) {
            header('Location: ?module=sales');
            exit;
        }
        ?>
        <h2>Edit Sale</h2>
        <form method="POST" class="card p-3">
            <div class="mb-3">
                <label for="client_id" class="form-label">Client</label>
                <select class="form-control" id="client_id" name="client_id" required>
                    <option value="">Select Client</option>
                    <?php foreach ($clients as $client): ?>
                        <option value="<?= $client['id'] ?>" <?= $sale['client_id'] == $client['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($client['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="mb-3">
                <label for="amount" class="form-label">Amount</label>
                <input type="number" step="0.01" class="form-control" id="amount" name="amount" value="<?= htmlspecialchars($sale['amount']) ?>" required>
            </div>
            <div class="mb-3">
                <label for="sale_date" class="form-label">Sale Date</label>
                <input type="datetime-local" class="form-control" id="sale_date" name="sale_date" value="<?= date('Y-m-d\TH:i', strtotime($sale['sale_date'])) ?>" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description"><?= htmlspecialchars($sale['description'] ?? '') ?></textarea>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="?module=sales" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
        <?php
        return;

    case 'delete':
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("DELETE FROM sales WHERE id = ?");
        $stmt->execute([$id]);
        header('Location: ?module=sales');
        exit;

    case 'list':
    default:
        $stmt = $pdo->query("SELECT s.*, c.name as client_name
                             FROM sales s
                             LEFT JOIN clients c ON s.client_id = c.id
                             ORDER BY s.sale_date DESC");
        $sales = $stmt->fetchAll();
        ?>
        <h2>Prodaja</h2>
        <a href="?module=sales&action=create" class="btn btn-primary mb-3">Nova Prodaja</a>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Klijent</th>
                    <th>Iznos</th>
                    <th>Datum</th>
                    <th>Opis</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($sales as $sale): ?>
                <tr>
                    <td><?= htmlspecialchars($sale['id']) ?></td>
                    <td><?= htmlspecialchars($sale['client_name']) ?></td>
                    <td><?= htmlspecialchars($sale['amount']) ?></td>
                    <td><?= htmlspecialchars($sale['sale_date']) ?></td>
                    <td><?= htmlspecialchars($sale['description'] ?? '') ?></td>
                    <td>
                        <a href="?module=sales&action=edit&id=<?= $sale['id'] ?>" class="btn btn-sm btn-primary">Izmeni</a>
                        <a href="?module=sales&action=delete&id=<?= $sale['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Da li ste sigurni?')">Obriši</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
        break;
}
?>
