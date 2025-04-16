<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}
header("Content-Type: application/json");
require_once '../connect.php';

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON data'
    ]);
    exit;
}

$email = $data['email'] ?? null;
$profilePhoto = $data['profilePhoto'] ?? null;

if (!$email) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email is required'
    ]);
    exit;
}

try {
    // Prepare the SQL query
    $sql = "UPDATE Users SET 
            first_name = ?,
            last_name = ?,
            full_name = CONCAT(?, ' ', ?), 
            macid = ?,
            student_number = ?,
            user_type = ?,
            account_password = ?";
    
    // Add profile image if provided
    if ($profilePhoto) {
        $sql .= ", profile_image = ?";
    }
    
    $sql .= " WHERE email = ?";
    
    // Prepare the statement
    $stmt = $dbh->prepare($sql);
    
    // Create parameters array
    $params = [
        $data['firstName'],
        $data['lastName'],
        $data['firstName'],
        $data['lastName'],
        $data['macId'],
        $data['studentNumber'],
        strtolower($data['role']),
        password_hash($data['password'], PASSWORD_DEFAULT)
    ];
    
    // Add profile photo if exists
    if ($profilePhoto) {
        $params[] = $profilePhoto;
    }
    
    $params[] = $email;
    $success = $stmt->execute($params);
    
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update profile'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}