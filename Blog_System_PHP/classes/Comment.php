<?php

class Comment {

    private $db;

const MAX_COMMENT_LENGTH = 1000;

const STATUSES = ['pending', 'approved', 'spam'];

public function __construct($db) {
        $this->db = $db;
    }

public function getAllComments($post_id) {
        $query = "SELECT c.*, u.username, u.email,
                        DATE_FORMAT(c.created_at, '%d %b %Y %H:%i') as formatted_date
                 FROM comments c
                 LEFT JOIN users u ON c.user_id = u.id
                 WHERE c.post_id = ?
                 ORDER BY c.created_at DESC";

        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing getAllComments query");
            return [];
        }

        $stmt->bind_param('i', $post_id);

        if (!$stmt->execute()) {
            $this->logError("Error executing getAllComments query");
            return [];
        }

        $result = $stmt->get_result();
        $comments = [];

        while ($comment = $result->fetch_assoc()) {
            $comment['is_edited'] = ($comment['updated_at'] != $comment['created_at']);
            $comments[] = $comment;
        }

        return $comments;
    }

public function getCommentById($id) {
        $query = "SELECT c.*, u.username, u.email,
                        DATE_FORMAT(c.created_at, '%d %b %Y %H:%i') as formatted_date
                 FROM comments c
                 LEFT JOIN users u ON c.user_id = u.id
                 WHERE c.id = ?";

        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing getCommentById query");
            return null;
        }

        $stmt->bind_param('i', $id);

        if (!$stmt->execute()) {
            $this->logError("Error executing getCommentById query");
            return null;
        }

        $result = $stmt->get_result();
        $comment = $result->fetch_assoc();

        if ($comment) {
            $comment['is_edited'] = ($comment['updated_at'] != $comment['created_at']);
        }

        return $comment;
    }

public function createComment($post_id, $user_id, $content) {

        if (empty($content) || strlen($content) > self::MAX_COMMENT_LENGTH) {
            $this->logError("Invalid comment length");
            return false;
        }

        $query = "INSERT INTO comments (post_id, user_id, content, created_at)
                 VALUES (?, ?, ?, NOW())";

        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing createComment query");
            return false;
        }

        $stmt->bind_param('iis', $post_id, $user_id, $content);

        if ($stmt->execute()) {
            return $this->db->insert_id;
        }

        $this->logError("Error executing createComment query");
        return false;
    }

public function updateComment($id, $content) {

        if (empty($content) || strlen($content) > self::MAX_COMMENT_LENGTH) {
            $this->logError("Invalid comment length");
            return false;
        }

        $query = "UPDATE comments
                 SET content = ?, updated_at = NOW()
                 WHERE id = ?";

        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing updateComment query");
            return false;
        }

        $stmt->bind_param('si', $content, $id);

        if (!$stmt->execute()) {
            $this->logError("Error executing updateComment query");
            return false;
        }

        return $stmt->affected_rows > 0;
    }

public function deleteComment($id) {
        $query = "DELETE FROM comments WHERE id = ?";
        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing deleteComment query");
            return false;
        }

        $stmt->bind_param('i', $id);

        if (!$stmt->execute()) {
            $this->logError("Error executing deleteComment query");
            return false;
        }

        return $stmt->affected_rows > 0;
    }

public function getCommentsByUser($user_id, $status = 'approved') {
        $query = "SELECT c.*, u.username, u.email, p.title as post_title,
                        DATE_FORMAT(c.created_at, '%d %b %Y %H:%i') as formatted_date
                 FROM comments c
                 LEFT JOIN users u ON c.user_id = u.id
                 LEFT JOIN posts p ON c.post_id = p.id
                 WHERE c.user_id = ? AND c.status = ?
                 ORDER BY c.created_at DESC";

        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing getCommentsByUser query");
            return [];
        }

        $stmt->bind_param('is', $user_id, $status);

        if (!$stmt->execute()) {
            $this->logError("Error executing getCommentsByUser query");
            return [];
        }

        $result = $stmt->get_result();
        $comments = [];

        while ($comment = $result->fetch_assoc()) {
            $comment['is_edited'] = ($comment['updated_at'] != $comment['created_at']);
            $comments[] = $comment;
        }

        return $comments;
    }

public function getRecentComments($limit = 5, $status = 'approved') {
        $query = "SELECT c.*, u.username, u.email, p.title as post_title,
                        DATE_FORMAT(c.created_at, '%d %b %Y %H:%i') as formatted_date
                 FROM comments c
                 LEFT JOIN users u ON c.user_id = u.id
                 LEFT JOIN posts p ON c.post_id = p.id
                 WHERE c.status = ?
                 ORDER BY c.created_at DESC
                 LIMIT ?";

        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing getRecentComments query");
            return [];
        }

        $stmt->bind_param('si', $status, $limit);

        if (!$stmt->execute()) {
            $this->logError("Error executing getRecentComments query");
            return [];
        }

        $result = $stmt->get_result();
        $comments = [];

        while ($comment = $result->fetch_assoc()) {
            $comment['is_edited'] = ($comment['updated_at'] != $comment['created_at']);
            $comments[] = $comment;
        }

        return $comments;
    }

public function countComments($post_id, $status = 'approved') {
        $query = "SELECT COUNT(*) as count FROM comments WHERE post_id = ? AND status = ?";
        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing countComments query");
            return 0;
        }

        $stmt->bind_param('is', $post_id, $status);

        if (!$stmt->execute()) {
            $this->logError("Error executing countComments query");
            return 0;
        }

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        return (int)$row['count'];
    }

public function updateStatus($id, $status) {
        if (!in_array($status, self::STATUSES)) {
            $this->logError("Invalid comment status: $status");
            return false;
        }

        $query = "UPDATE comments SET status = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);

        if ($stmt === false) {
            $this->logError("Error preparing updateStatus query");
            return false;
        }

        $stmt->bind_param('si', $status, $id);

        if (!$stmt->execute()) {
            $this->logError("Error executing updateStatus query");
            return false;
        }

        return $stmt->affected_rows > 0;
    }

private function logError($message) {
        error_log("[Comment Class Error] " . $message . ": " . $this->db->error);
    }
}