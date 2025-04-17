<?php
header("Access-Control-Allow-Origin: *"); // or specify your frontend origin: 'http://localhost:3000'
header("Access-Control-Allow-Methods: POST, OPTIONS"); // allow POST and OPTIONS
header("Access-Control-Allow-Headers: Content-Type"); // allow Content-Type header for POST


header("Content-Type: application/json");
require_once '../connect.php';

// If this is a preflight request, respond with a 200 OK
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input."]);
    exit;
}

// Extract data
$email = $data['email'];
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$macId = $data['macId'];
$studentNumber = $data['studentNumber'];
$role = strtolower($data['role']);
$password = $data['password'];
$hourlyRate = $data['hourlyRate'] ?? null;  // Used instead of wage
$profilePhoto = $data['profilePhoto'] ?? null;

// Build dynamic SQL
$sql = "UPDATE Users SET 
    first_name = ?, 
    last_name = ?, 
    full_name = CONCAT(?, ' ', ?), 
    macid = ?, 
    student_number = ?, 
    user_type = ?, 
    account_password = ?, 
    wage = ?";

$params = [
    $firstName,
    $lastName,
    $firstName,
    $lastName,
    $macId,
    $studentNumber,
    $role,
    password_hash($password, PASSWORD_DEFAULT),
    $hourlyRate
];

// Add profile image if provided
if ($profilePhoto) {
    $sql .= ", profile_image = ?";
    $params[] = $profilePhoto;
}

$sql .= " WHERE email = ?";
$params[] = $email;

// Prepare and execute
$stmt = $dbh->prepare($sql);
$stmt->execute($params);

// Fetch updated user
$query = "SELECT first_name, last_name, macid, student_number, user_type, wage, profile_image FROM Users WHERE email = ?";
$stmt = $dbh->prepare($query);
$stmt->execute([$email]);
$updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$updatedUser) {
    echo json_encode(["error" => "User not found after update."]);
    exit;
}

// Return updated profile
echo json_encode([
    "success" => true,
    "user_profile" => $updatedUser
]);
