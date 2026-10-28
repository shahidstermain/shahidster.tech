<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Admin Key validation
$admin_key = getenv('ADMIN_API_KEY') ?: 'Sh@hid_AdminKey_2026_Secure';
$auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
$bearer_token = trim(preg_replace('/^Bearer\s+/i', '', $auth_header));
$is_admin = (!empty($bearer_token) && hash_equals($admin_key, $bearer_token));

if ($method === 'GET') {
    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;

    if ($slug) {
        $stmt = $pdo->prepare("SELECT slug, title, category, is_premium, published, excerpt, full_content, updated_at FROM articles WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();

        if ($row) {
            $is_premium = (bool)$row['is_premium'];
            $is_published = (bool)$row['published'];

            // Gate content if article is premium and request lacks authorized session
            $gated = ($is_premium && !$is_admin);
            $content = $gated ? '' : ($row['full_content'] ?? '');

            echo json_encode([
                'success' => true,
                'slug' => $row['slug'],
                'is_premium' => $is_premium,
                'published' => $is_published,
                'gated' => $gated,
                'excerpt' => $row['excerpt'] ?? '',
                'content' => $content,
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
    // Enforce Admin Authentication
    if (!$is_admin) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized: valid admin authorization required']);
        exit;
    }

    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (!$data || empty($data['slug'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'slug is required']);
        exit;
    }

    $slug = preg_replace('/[^a-zA-Z0-9_-]/', '', trim($data['slug']));
    if (empty($slug)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid slug format']);
        exit;
    }

    $title = htmlspecialchars(trim($data['title'] ?? $slug), ENT_QUOTES, 'UTF-8');
    $category = htmlspecialchars(trim($data['category'] ?? 'Systems Engineering'), ENT_QUOTES, 'UTF-8');
    $is_premium = !empty($data['is_premium']) ? 1 : 0;
    $published = isset($data['published']) ? (!empty($data['published']) ? 1 : 0) : 1;
    $excerpt = trim($data['excerpt'] ?? '');
    $full_content = trim($data['full_content'] ?? '');

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

if ($method === 'DELETE') {
    // Enforce Admin Authentication for deleting overrides
    if (!$is_admin) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthorized: valid admin authorization required']);
        exit;
    }

    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;
    if (!$slug) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'slug is required']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM articles WHERE slug = ?");
    $stmt->execute([$slug]);

    echo json_encode(['success' => true, 'deleted' => $slug]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
