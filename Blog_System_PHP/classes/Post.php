<?php
class Post {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getAllPosts($page = 1, $per_page = 10) {
        $offset = ($page - 1) * $per_page;

        $query = "SELECT p.*, u.username, c.name as category
                 FROM posts p
                 LEFT JOIN users u ON p.user_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 ORDER BY p.created_at DESC
                 LIMIT ? OFFSET ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ii', $per_page, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($post = $result->fetch_assoc()) {
            $post['tags'] = $this->getPostTags($post['id']);
            $posts[] = $post;
        }

        return $posts;
    }

    public function getTotalPosts() {
        $query = "SELECT COUNT(*) as total FROM posts";
        $result = $this->db->query($query);
        $row = $result->fetch_assoc();
        return $row['total'];
    }

    public function getPostById($id) {
        $query = "SELECT p.*, u.username as author, c.name as category, c.id as category_id
                 FROM posts p
                 LEFT JOIN users u ON p.user_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($post = $result->fetch_assoc()) {
            $post['tags'] = $this->getPostTags($post['id']);
            return $post;
        }

        return null;
    }

    public function getPostsByCategory($category_id, $page = 1, $per_page = 10) {
        $offset = ($page - 1) * $per_page;

        $query = "SELECT p.*, u.username as author, c.name as category, c.id as category_id
                 FROM posts p
                 LEFT JOIN users u ON p.user_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.category_id = ?
                 ORDER BY p.created_at DESC
                 LIMIT ? OFFSET ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('iii', $category_id, $per_page, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($post = $result->fetch_assoc()) {
            $post['tags'] = $this->getPostTags($post['id']);
            $posts[] = $post;
        }

        return $posts;
    }

    public function getPostsByTag($tag_id, $page = 1, $per_page = 10) {
        $offset = ($page - 1) * $per_page;

        $query = "SELECT p.*, u.username as author, c.name as category, c.id as category_id
                 FROM posts p
                 LEFT JOIN users u ON p.user_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 LEFT JOIN post_tags pt ON p.id = pt.post_id
                 WHERE pt.tag_id = ?
                 ORDER BY p.created_at DESC
                 LIMIT ? OFFSET ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('iii', $tag_id, $per_page, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($post = $result->fetch_assoc()) {
            $post['tags'] = $this->getPostTags($post['id']);
            $posts[] = $post;
        }

        return $posts;
    }

    public function createPost($title, $content, $user_id, $category_id, $tags = []) {

        $content = $this->sanitizeContent($content);

        $query = "INSERT INTO posts (title, content, user_id, category_id, created_at)
                 VALUES (?, ?, ?, ?, NOW())";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ssii', $title, $content, $user_id, $category_id);

        if ($stmt->execute()) {
            $post_id = $this->db->insert_id;

            if (!empty($tags)) {
                $this->updatePostTags($post_id, $tags);
            }

            return $post_id;
        }

        return false;
    }

    public function updatePost($id, $title, $content, $category_id, $tags = []) {

        $content = $this->sanitizeContent($content);

        $query = "UPDATE posts
                 SET title = ?, content = ?, category_id = ?, updated_at = NOW()
                 WHERE id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ssii', $title, $content, $category_id, $id);

        if ($stmt->execute()) {
            if (!empty($tags)) {
                $this->updatePostTags($id, $tags);
            }

            return true;
        }

        return false;
    }

    public function deletePost($id) {

        $query = "DELETE FROM post_tags WHERE post_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();

$query = "DELETE FROM comments WHERE post_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();

$query = "DELETE FROM posts WHERE id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);

        return $stmt->execute();
    }

    private function getPostTags($post_id) {
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

    private function updatePostTags($post_id, $tag_ids) {

        $query = "DELETE FROM post_tags WHERE post_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $post_id);
        $stmt->execute();

if (!empty($tag_ids)) {
            $query = "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)";
            $stmt = $this->db->prepare($query);

            foreach ($tag_ids as $tag_id) {
                $stmt->bind_param('ii', $post_id, $tag_id);
                $stmt->execute();
            }
        }
    }

    public function searchPosts($search_term, $page = 1, $per_page = 10) {
        $offset = ($page - 1) * $per_page;
        $search_term = "%{$search_term}%";

        $query = "SELECT p.*, u.username as author, c.name as category, c.id as category_id
                 FROM posts p
                 LEFT JOIN users u ON p.user_id = u.id
                 LEFT JOIN categories c ON p.category_id = c.id
                 WHERE p.title LIKE ? OR p.content LIKE ?
                 ORDER BY p.created_at DESC
                 LIMIT ? OFFSET ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ssii', $search_term, $search_term, $per_page, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($post = $result->fetch_assoc()) {
            $post['tags'] = $this->getPostTags($post['id']);
            $posts[] = $post;
        }

        return $posts;
    }

    public function getTotalSearchResults($search_term) {
        $search_term = "%{$search_term}%";

        $query = "SELECT COUNT(*) as total
                 FROM posts
                 WHERE title LIKE ? OR content LIKE ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('ss', $search_term, $search_term);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        return $row['total'];
    }

    private function sanitizeContent($content) {

        $allowed_tags = '<p><br><strong><em><u><h1><h2><h3><h4><h5><h6><ul><ol><li><blockquote><img><a><table><tr><td><th><thead><tbody><figure><figcaption>';
        $allowed_attributes = [
            'img' => ['src', 'alt', 'title', 'width', 'height', 'class', 'style'],
            'a' => ['href', 'title', 'target', 'class', 'rel'],
            'table' => ['class', 'style'],
            'td' => ['class', 'style', 'colspan', 'rowspan'],
            'th' => ['class', 'style', 'colspan', 'rowspan'],
            'figure' => ['class', 'style'],
            'figcaption' => ['class', 'style']
        ];

$content = strip_tags($content, $allowed_tags);

$dom = new DOMDocument();
        $dom->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        foreach ($dom->getElementsByTagName('*') as $element) {
            $tag_name = $element->tagName;
            if (isset($allowed_attributes[$tag_name])) {
                $attributes = $element->attributes;
                for ($i = $attributes->length - 1; $i >= 0; $i--) {
                    $attr = $attributes->item($i);
                    if (!in_array($attr->name, $allowed_attributes[$tag_name])) {
                        $element->removeAttribute($attr->name);
                    }
                }
            }
        }

        return $dom->saveHTML();
    }
}
?>