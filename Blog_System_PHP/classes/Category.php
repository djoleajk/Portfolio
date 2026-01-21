<?php
class Category {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllCategories() {
        $query = "SELECT c.*, COUNT(p.id) as post_count
                 FROM categories c
                 LEFT JOIN posts p ON c.id = p.category_id
                 GROUP BY c.id
                 ORDER BY c.name ASC";

        $result = $this->db->query($query);

        $categories = [];
        while ($category = $result->fetch_assoc()) {
            $categories[] = $category;
        }

        return $categories;
    }

    public function getCategoryById($id) {
        $query = "SELECT c.*, COUNT(p.id) as post_count,
                        p.title as post_title, p.created_at as post_date,
                        u.username as post_creator
                 FROM categories c
                 LEFT JOIN posts p ON c.id = p.category_id
                 LEFT JOIN users u ON p.user_id = u.id
                 WHERE c.id = ?
                 GROUP BY c.id, p.id, u.id";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $category = null;
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            if (!$category) {
                $category = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'post_count' => $row['post_count'],
                    'posts' => []
                ];
            }
            if ($row['post_title']) {
                $category['posts'][] = [
                    'title' => $row['post_title'],
                    'created_at' => $row['post_date'],
                    'creator' => $row['post_creator']
                ];
            }
        }

        return $category;
    }

    public function createCategory($name, $description = '') {
        $query = "INSERT INTO categories (name, description) VALUES (?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ss', $name, $description);

        if ($stmt->execute()) {
            return $this->db->insert_id;
        }

        return false;
    }

    public function updateCategory($id, $name, $description = '') {
        $query = "UPDATE categories SET name = ?, description = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ssi', $name, $description, $id);

        return $stmt->execute();
    }

    public function deleteCategory($id) {

        $query = "UPDATE posts SET category_id = NULL WHERE category_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();

$query = "DELETE FROM categories WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);

        return $stmt->execute();
    }

    public function getCategoryByName($name) {
        $query = "SELECT * FROM categories WHERE name = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $name);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    public function searchCategories($search_term) {
        $search_term = "%{$search_term}%";

        $query = "SELECT c.*, COUNT(p.id) as post_count
                 FROM categories c
                 LEFT JOIN posts p ON c.id = p.category_id
                 WHERE c.name LIKE ? OR c.description LIKE ?
                 GROUP BY c.id
                 ORDER BY c.name ASC";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ss', $search_term, $search_term);
        $stmt->execute();
        $result = $stmt->get_result();

        $categories = [];
        while ($category = $result->fetch_assoc()) {
            $categories[] = $category;
        }

        return $categories;
    }
}
?>