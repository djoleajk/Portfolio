<?php include 'templates/header.php'; ?>

<div class="container mt-5">
    <h2 class="text-center text-primary mb-4">Administracija Rezervacija</h2>
    <p class="text-center text-secondary">Pregled i upravljanje svim rezervacijama.</p>
    <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
            <thead class="table-primary">
                <tr>
                    <th>
                    <th>Ime i Prezime</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Datum</th>
                    <th>Vreme</th>
                    <th>Status</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                <?php

                $stmt = $db->prepare("SELECT id, name, email, phone, date, time, status FROM reservations");
                if (!$stmt) {
                    die("Greška u pripremi upita: " . $db->error);
                }

                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {

                        $statusLabel = $row['status'] === 'potvrđeno' ? '<span class="badge bg-success">Prihvaćen</span>' : ($row['status'] === 'otkazano' ? '<span class="badge bg-danger">Otkazan</span>' : '<span class="badge bg-warning text-dark">Na čekanju</span>');
                        echo "<tr>
                            <td>{$row['id']}</td>
                            <td>{$row['name']}</td>
                            <td>{$row['email']}</td>
                            <td>{$row['phone']}</td>
                            <td>{$row['date']}</td>
                            <td>{$row['time']}</td>
                            <td>{$statusLabel}</td>
                            <td>
                                <a href='index.php?page=admin&action=confirm&id={$row['id']}' class='btn btn-success btn-sm me-2'>Potvrdi</a>
                                <a href='index.php?page=admin&action=cancel&id={$row['id']}' class='btn btn-danger btn-sm'>Otkaži</a>
                            </td>
                        </tr>";
                    }
                } else {
                    echo "<tr><td colspan='8' class='text-center text-muted'>Nema rezervacija.</td></tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</div>

<?php include 'templates/footer.php'; ?>
