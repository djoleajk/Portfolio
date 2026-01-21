<?php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'simple_cms');

try {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($db->connect_error) {
        throw new Exception("Connection failed: " . $db->connect_error);
    }

if (!$db->set_charset("utf8mb4")) {
        throw new Exception("Error setting charset utf8mb4: " . $db->error);
    }

$db->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
    $db->set_charset("utf8mb4");

$db->query("SET SESSION sql_mode = ''");

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}

function escape($string) {
    global $db;
    return $db->real_escape_string($string);
}

function lastInsertId() {
    global $db;
    return $db->insert_id;
}

function affectedRows() {
    global $db;
    return $db->affected_rows;
}

function closeConnection() {
    global $db;
    $db->close();
}

function prepareAndExecute($sql, $types, $params) {
    global $db;
    $stmt = $db->prepare($sql);
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $db->error);
    }
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    return $stmt;
}

register_shutdown_function('closeConnection');
?>