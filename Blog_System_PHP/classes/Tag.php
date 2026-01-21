<?php
class Tag {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllTags() {
        $query = "SELECT t.*, COUNT(pt.post_id) as post_count
                 FROM tags t
                 LEFT JOIN post_tags pt ON t.id = pt.tag_id
                 GROUP BY t.id
                 ORDER BY t.name ASC";

        $result = $this->db->query($query);

        $tags = [];
        while ($tag = $result->fetch_assoc()) {
            $tags[] = $tag;
        }

        return $tags;
    }

    public function getTagById($id) {
        $query = "SELECT t.*, COUNT(pt.post_id) as post_count
                 FROM tags t
                 LEFT JOIN post_tags pt ON t.id = pt.tag_id
                 WHERE t.id = ?
                 GROUP BY t.id";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    public function createTag($name) {
        $query = "INSERT INTO tags (name) VALUES (?)";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $name);

        if ($stmt->execute()) {
            return $this->db->insert_id;
        }

        return false;
    }

    public function updateTag($id, $name) {
        $query = "UPDATE tags SET name = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('si', $name, $id);

        return $stmt->execute();
    }

    public function deleteTag($id) {

        $query = "DELETE FROM post_tags WHERE tag_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();

$query = "DELETE FROM tags WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);

        return $stmt->execute();
    }

    public function getTagByName($name) {
        $query = "SELECT * FROM tags WHERE name = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $name);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc();
    }

    public function searchTags($search_term) {
        $search_term = "%{$search_term}%";

        $query = "SELECT t.*, COUNT(pt.post_id) as post_count
                 FROM tags t
                 LEFT JOIN post_tags pt ON t.id = pt.tag_id
                 WHERE t.name LIKE ?
                 GROUP BY t.id
                 ORDER BY t.name ASC";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $search_term);
        $stmt->execute();
        $result = $stmt->get_result();

        $tags = [];
        while ($tag = $result->fetch_assoc()) {
            $tags[] = $tag;
        }

        return $tags;
    }

    public function getPostTags($post_id) {
        $query = "SELECT t.*
                 FROM tags t
                 JOIN post_tags pt ON t.id = pt.tag_id
                 WHERE pt.post_id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $post_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $tags = [];
        while ($tag = $result->fetch_assoc()) {
            $tags[] = $tag;
        }

        return $tags;
    }

    public function addPostTag($post_id, $tag_id) {
        $query = "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ii', $post_id, $tag_id);

        return $stmt->execute();
    }

    public function removePostTag($post_id, $tag_id) {
        $query = "DELETE FROM post_tags WHERE post_id = ? AND tag_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ii', $post_id, $tag_id);

        return $stmt->execute();
    }
}
?>