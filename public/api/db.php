<?php
/**
 * Hostinger MariaDB Database Connector
 * Connects to the local MariaDB instance at 127.0.0.1:3306
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = '127.0.0.1';
$db_port = 3306;
$db_name = 'u873719529_shahidster_db';
$db_user = 'u873719529_shahid_dbuser';
$db_pass = 'Sh@hidster_Db2026!xM';

function getDbConnection() {
    global $db_host, $db_port, $db_name, $db_user, $db_pass;
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ];
        try {
            $pdo = new PDO($dsn, $db_user, $db_pass, $options);
            initializeTables($pdo);
        } catch (PDOException $e) {
            // Fallback to localhost socket if 127.0.0.1 fails
            try {
                $dsn_fallback = "mysql:host=localhost;dbname={$db_name};charset=utf8mb4";
                $pdo = new PDO($dsn_fallback, $db_user, $db_pass, $options);
                initializeTables($pdo);
            } catch (PDOException $e2) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Database connection failed',
                    'message' => $e2->getMessage()
                ]);
                exit;
            }
        }
    }
    return $pdo;
}

function initializeTables($pdo) {
    // 1. Subscribers table (Newsletter & course signups)
    $pdo->exec("CREATE TABLE IF NOT EXISTS subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        tag VARCHAR(100) DEFAULT 'database-201',
        subscribed TINYINT(1) DEFAULT 1,
        subscription_tier VARCHAR(50) DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. Premium articles / publication control table
    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(191) NOT NULL UNIQUE,
        title VARCHAR(500) NOT NULL,
        category VARCHAR(100) DEFAULT 'Systems Engineering',
        is_premium TINYINT(1) DEFAULT 0,
        published TINYINT(1) DEFAULT 1,
        excerpt TEXT,
        full_content LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_published (published)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3. Inquiries table (Contact messages)
    $pdo->exec("CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
}
