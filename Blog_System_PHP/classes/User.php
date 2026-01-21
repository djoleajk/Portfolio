<?php
class User {
    private $db;
    const SESSION_TIMEOUT = 1800;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllUsers() {
        $query = "SELECT * FROM users ORDER BY username ASC";
        $result = $this->db->query($query);

        $users = [];
        while ($user = $result->fetch_assoc()) {
            $users[] = $user;
        }

        return $users;
    }

    public function getUserById($id) {
        $query = "SELECT * FROM users WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    public function getUserByEmail($email) {
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    public function createUser($username, $email, $password, $role = 'user') {
        if ($this->getUserByEmail($email)) {
            return false;
        }

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            return false;
        }

        $stmt->bind_param('ssss', $username, $email, $hashed_password, $role);

        if ($stmt->execute()) {
            return $this->db->insert_id;
        }

        return false;
    }

    public function updateUser($id, $username, $email, $role = null, $password = null) {
        $existing_user = $this->getUserByEmail($email);
        if ($existing_user && $existing_user['id'] != $id) {
            return false;
        }

        if ($password) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $query = "UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('ssssi', $username, $email, $hashed_password, $role, $id);
        } else {
            $query = "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('sssi', $username, $email, $role, $id);
        }

        return $stmt->execute();
    }

    public function deleteUser($id) {
        $query = "UPDATE posts SET user_id = NULL WHERE user_id = ?";
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            return false;
        }

        $query = "DELETE FROM comments WHERE user_id = ?";
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            return false;
        }

        $query = "DELETE FROM users WHERE id = ?";
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) {
            return false;
        }

        return true;
    }

    public function login($email, $password) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $user = $this->getUserByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            return false;
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['last_activity'] = time();

        return true;
    }

    public function checkSession() {
        if (isset($_SESSION['last_activity']) &&
            (time() - $_SESSION['last_activity'] > self::SESSION_TIMEOUT)) {
            $this->logout();
            return false;
        }
        $_SESSION['last_activity'] = time();
        return true;
    }

    public function logout() {
        $_SESSION = array();
        session_destroy();
        return true;
    }

    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }

    public function isAdmin() {
        return isset($_SESSION['role']) && $_SESSION['role'] == 'admin';
    }

    public function getCurrentUser() {
        if ($this->isLoggedIn()) {
            return $this->getUserById($_SESSION['user_id']);
        }
        return null;
    }

    public function updatePassword($id, $current_password, $new_password) {
        $user = $this->getUserById($id);

        if ($user && password_verify($current_password, $user['password'])) {
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            $query = "UPDATE users SET password = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            if (!$stmt) {
                return false;
            }
            $stmt->bind_param('si', $hashed_password, $id);
            if (!$stmt->execute()) {
                return false;
            }

            return true;
        }

        return false;
    }

    public function searchUsers($search_term) {
        $search_term = "%{$search_term}%";

        $query = "SELECT * FROM users
                 WHERE username LIKE ? OR email LIKE ?
                 ORDER BY username ASC";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ss', $search_term, $search_term);
        $stmt->execute();
        $result = $stmt->get_result();

        $users = [];
        while ($user = $result->fetch_assoc()) {
            $users[] = $user;
        }

        return $users;
    }
}
?>