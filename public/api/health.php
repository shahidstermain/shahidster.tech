<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT VERSION() as version");
    $row = $stmt->fetch();

    $countStmt = $pdo->query("SELECT COUNT(*) as subscriber_count FROM subscribers");
    $subscribers = $countStmt->fetch()['subscriber_count'];

    echo json_encode([
        'status' => 'healthy',
        'database' => 'connected',
        'engine' => 'Hostinger MariaDB',
        'version' => $row['version'] ?? 'unknown',
        'database_name' => 'u873719529_shahidster_db',
        'subscribers_count' => (int)$subscribers,
        'timestamp' => date('c')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'database' => 'disconnected',
        'message' => $e->getMessage()
    ]);
}
