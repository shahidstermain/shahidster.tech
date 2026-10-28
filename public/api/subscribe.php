<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Support both JSON body and form-urlencoded
if (!$data) {
    $data = $_POST;
}

$email = isset($data['email']) ? trim($data['email']) : '';
$tag = isset($data['tag']) ? trim($data['tag']) : 'database-201';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid email address is required']);
    exit;
}

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("INSERT INTO subscribers (email, tag, subscribed) 
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE 
            subscribed = 1,
            tag = VALUES(tag),
            updated_at = CURRENT_TIMESTAMP");
    
    $stmt->execute([$email, $tag]);

    echo json_encode([
        'success' => true,
        'message' => "You're in! Check your inbox for confirmation.",
        'email' => $email
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not save subscription',
        'message' => $e->getMessage()
    ]);
}
