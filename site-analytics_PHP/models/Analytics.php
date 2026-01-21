<?php
require_once '../config/database.php';

class Analytics {
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->db->connect();
    }

    public function recordPageView($websiteId, $url, $referrer, $userAgent, $ipAddress) {
        $sql = "INSERT INTO page_views (website_id, url, referrer, user_agent, ip_address)
                VALUES (
                    '" . $this->db->escape($websiteId) . "',
                    '" . $this->db->escape($url) . "',
                    '" . $this->db->escape($referrer) . "',
                    '" . $this->db->escape($userAgent) . "',
                    '" . $this->db->escape($ipAddress) . "'
                )";
        return $this->db->query($sql);
    }

    public function getDailyStats($websiteId, $date) {
        $sql = "SELECT COUNT(*) as total_views,
                COUNT(DISTINCT ip_address) as unique_visitors
                FROM page_views
                WHERE website_id = '" . $this->db->escape($websiteId) . "'
                AND DATE(visit_time) = '" . $this->db->escape($date) . "'";
        return $this->db->query($sql);
    }

    public function getTopPages($websiteId, $limit = 10) {
        $sql = "SELECT url, COUNT(*) as views
                FROM page_views
                WHERE website_id = '" . $this->db->escape($websiteId) . "'
                GROUP BY url
                ORDER BY views DESC
                LIMIT " . (int)$limit;
        return $this->db->query($sql);
    }

    public function getTopReferrers($websiteId, $limit = 10) {
        $sql = "SELECT referrer, COUNT(*) as count
                FROM page_views
                WHERE website_id = '" . $this->db->escape($websiteId) . "'
                AND referrer != ''
                GROUP BY referrer
                ORDER BY count DESC
                LIMIT " . (int)$limit;
        return $this->db->query($sql);
    }
}
?>
