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

// 1. Honeypot check (reject automated spam bots silently or with error)
if (!empty($data['website']) || !empty($data['hp_confirm'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid submission']);
    exit;
}

$email = isset($data['email']) ? trim($data['email']) : '';
$tag = isset($data['tag']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', trim($data['tag'])) : 'database-201';

// 2. Strict validation (RFC compliant, length bounded, no newlines)
if (empty($email) || strlen($email) > 254 || preg_match("/[\r\n]/", $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Valid email address is required']);
    exit;
}

// 3. Length bound on tag
if (strlen($tag) > 50) {
    $tag = substr($tag, 0, 50);
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
        'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8')
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Could not save subscription'
    ]);
}
