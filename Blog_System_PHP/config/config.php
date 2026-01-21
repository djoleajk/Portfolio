<?php
define('SITE_NAME', 'Simple CMS');
define('SITE_URL', 'http://localhost/A_Sertifikat');
define('UPLOAD_DIR', 'uploads/');
define('SESSION_TIMEOUT', 1800);
define('MAX_LOGIN_ATTEMPTS', 3);
define('LOCKOUT_TIME', 900);

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
