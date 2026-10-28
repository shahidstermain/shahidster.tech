<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;

    if ($slug) {
        $stmt = $pdo->prepare("SELECT slug, title, category, is_premium, published, excerpt, full_content, updated_at FROM articles WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();

        if ($row) {
            echo json_encode([
                'success' => true,
                'slug' => $row['slug'],
                'is_premium' => (bool)$row['is_premium'],
                'published' => (bool)$row['published'],
                'excerpt' => $row['excerpt'] ?? '',
                'content' => $row['full_content'] ?? '',
                'updated_at' => $row['updated_at']
            ]);
        } else {
            // Not in DB override table -> standard free published article
            echo json_encode([
                'success' => true,
                'slug' => $slug,
                'is_premium' => false,
                'published' => true,
                'gated' => false
            ]);
        }
        exit;
    }

    // List all article overrides/metadata
    $stmt = $pdo->query("SELECT slug, is_premium, published FROM articles");
    $articles = $stmt->fetchAll();

    $formatted = array_map(function($a) {
        return [
            'slug' => $a['slug'],
            'is_premium' => (bool)$a['is_premium'],
            'published' => (bool)$a['published']
        ];
    }, $articles);

    echo json_encode([
        'success' => true,
        'articles' => $formatted
    ]);
    exit;
}

if ($method === 'POST') {
    // Admin update for article published / premium status
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!$data || empty($data['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'slug is required']);
        exit;
    }

    $slug = trim($data['slug']);
    $title = $data['title'] ?? $slug;
    $category = $data['category'] ?? 'Systems Engineering';
    $is_premium = !empty($data['is_premium']) ? 1 : 0;
    $published = isset($data['published']) ? (!empty($data['published']) ? 1 : 0) : 1;
    $excerpt = $data['excerpt'] ?? '';
    $full_content = $data['full_content'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO articles (slug, title, category, is_premium, published, excerpt, full_content) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            category = VALUES(category),
            is_premium = VALUES(is_premium),
            published = VALUES(published),
            excerpt = VALUES(excerpt),
            full_content = VALUES(full_content),
            updated_at = CURRENT_TIMESTAMP");
    
    $stmt->execute([$slug, $title, $category, $is_premium, $published, $excerpt, $full_content]);

    echo json_encode(['success' => true, 'slug' => $slug]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
