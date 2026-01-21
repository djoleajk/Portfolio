<?php
class Database {
    private $host = "localhost";
    private $db_name = "local_services";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {

            $this->conn = new PDO("mysql:host=" . $this->host, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '" . $this->db_name . "'";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            if ($stmt->rowCount() == 0) {

                $sql = file_get_contents(__DIR__ . '/../database/services.sql');
                $this->conn->exec($sql);
            }

$this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");

        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
            return null;
        }
        return $this->conn;
    }
}
?>
