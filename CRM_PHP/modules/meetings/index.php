<?php
require_once 'config/database.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'create':

        $clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $client_id = $_POST['client_id'] ?? '';
            $title = $_POST['title'] ?? '';
            $meeting_date = $_POST['meeting_date'] ?? '';
            $description = $_POST['description'] ?? '';
            $status = $_POST['status'] ?? 'scheduled';

            if (!empty($client_id) && !empty($title) && !empty($meeting_date)) {
                $stmt = $pdo->prepare("INSERT INTO meetings (client_id, title, meeting_date, description, status) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$client_id, $title, $meeting_date, $description, $status]);
                header('Location: ?module=meetings');
                exit;
            }
        }
        ?>
        <h2>Novi Sastanak</h2>
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
                <label for="title" class="form-label">Naslov</label>
                <input type="text" class="form-control" id="title" name="title" required>
            </div>
            <div class="mb-3">
                <label for="meeting_date" class="form-label">Datum Sastanka</label>
                <input type="datetime-local" class="form-control" id="meeting_date" name="meeting_date" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Opis</label>
                <textarea class="form-control" id="description" name="description" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-control" id="status" name="status">
                    <option value="scheduled">Zakazan</option>
                    <option value="completed">Završen</option>
                    <option value="cancelled">Otkazan</option>
                </select>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Sačuvaj</button>
                <a href="?module=meetings" class="btn btn-secondary">Otkaži</a>
            </div>
        </form>
        <?php
        return;

    case 'list':
    default:
        try {
            $stmt = $pdo->query("SELECT m.*, c.name as client_name
                                FROM meetings m
                                LEFT JOIN clients c ON m.client_id = c.id
                                ORDER BY m.meeting_date DESC");
            $meetings = $stmt->fetchAll();
        } catch (PDOException $e) {
            die("Database error: " . $e->getMessage());
        }
        ?>
        <h2>Sastanci</h2>
        <a href="?module=meetings&action=create" class="btn btn-primary mb-3">Novi Sastanak</a>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Naslov</th>
                    <th>Datum</th>
                    <th>Klijent</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($meetings as $meeting): ?>
                <tr>
                    <td><?= htmlspecialchars($meeting['id']) ?></td>
                    <td><?= htmlspecialchars($meeting['title']) ?></td>
                    <td><?= htmlspecialchars($meeting['meeting_date']) ?></td>
                    <td><?= htmlspecialchars($meeting['client_name']) ?></td>
                    <td>
                        <a href="?module=meetings&action=edit&id=<?= $meeting['id'] ?>" class="btn btn-sm btn-primary">Izmeni</a>
                        <a href="?module=meetings&action=delete&id=<?= $meeting['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Da li ste sigurni?')">Obriši</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
        break;

    case 'edit':
        $id = $_GET['id'] ?? 0;
        $clientsStmt = $pdo->query("SELECT id, name FROM clients ORDER BY name");
        $clients = $clientsStmt->fetchAll();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $client_id = $_POST['client_id'] ?? '';
            $title = $_POST['title'] ?? '';
            $meeting_date = $_POST['meeting_date'] ?? '';
            $description = $_POST['description'] ?? '';
            $status = $_POST['status'] ?? 'scheduled';

            if (!empty($client_id) && !empty($title) && !empty($meeting_date)) {
                $stmt = $pdo->prepare("UPDATE meetings SET client_id = ?, title = ?, meeting_date = ?, description = ?, status = ? WHERE id = ?");
                $stmt->execute([$client_id, $title, $meeting_date, $description, $status, $id]);
                header('Location: ?module=meetings');
                exit;
            }
        }

        $stmt = $pdo->prepare("SELECT * FROM meetings WHERE id = ?");
        $stmt->execute([$id]);
        $meeting = $stmt->fetch();

        if (!$meeting) {
            header('Location: ?module=meetings');
            exit;
        }
        ?>
        <h2>Izmeni Sastanak</h2>
        <form method="POST" class="card p-3">
            <div class="mb-3">
                <label for="client_id" class="form-label">Klijent</label>
                <select class="form-control" id="client_id" name="client_id" required>
                    <option value="">Izaberi Klijenta</option>
                    <?php foreach ($clients as $client): ?>
                        <option value="<?= $client['id'] ?>" <?= $meeting['client_id'] == $client['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($client['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="mb-3">
                <label for="title" class="form-label">Naslov</label>
                <input type="text" class="form-control" id="title" name="title" value="<?= htmlspecialchars($meeting['title']) ?>" required>
            </div>
            <div class="mb-3">
                <label for="meeting_date" class="form-label">Datum Sastanka</label>
                <input type="datetime-local" class="form-control" id="meeting_date" name="meeting_date" value="<?= date('Y-m-d\TH:i', strtotime($meeting['meeting_date'])) ?>" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Opis</label>
                <textarea class="form-control" id="description" name="description" rows="3"><?= htmlspecialchars($meeting['description']) ?></textarea>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status</label>
                <select class="form-control" id="status" name="status">
                    <option value="scheduled" <?= $meeting['status'] === 'scheduled' ? 'selected' : '' ?>>Zakazan</option>
                    <option value="completed" <?= $meeting['status'] === 'completed' ? 'selected' : '' ?>>Završen</option>
                    <option value="cancelled" <?= $meeting['status'] === 'cancelled' ? 'selected' : '' ?>>Otkazan</option>
                </select>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Ažuriraj</button>
                <a href="?module=meetings" class="btn btn-secondary">Otkaži</a>
            </div>
        </form>
        <?php
        return;

    case 'delete':
        $id = $_GET['id'] ?? 0;
        $stmt = $pdo->prepare("DELETE FROM meetings WHERE id = ?");
        $stmt->execute([$id]);
        header('Location: ?module=meetings');
        exit;
}
?>
