<?php
require_once 'config/database.php';

$db = new Database();
$conn = $db->connect();

$sql = file_get_contents('sql/setup.sql');

if ($conn->multi_query($sql)) {
    do {

        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());

    echo "Baza podataka je uspešno kreirana!<br>";
    echo "Test nalog:<br>";
    echo "API ključ: test123api<br>";
    echo "Website ID: 1<br>";
} else {
    echo "Greška pri kreiranju baze: " . $conn->error;
}

$db->close();
?>
