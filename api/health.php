<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SELECT 1");
    $stmt->fetch();

    echo json_encode([
        'status' => 'healthy',
        'database' => 'connected',
        'timestamp' => date('c')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'database' => 'disconnected'
    ]);
}
