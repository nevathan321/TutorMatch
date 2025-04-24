<?php
/**
 * File: updateProfile.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 *
 * Description:
 * This file handles the updating of user profiles for the TutorMatch platform.
 * It accepts a JSON payload with fields such as name, McMaster ID, student number,
 * role (tutee or tutor), password, and optional fields like profile image, hourly rate,
 * and main subjects. It updates the corresponding database record in the Users table.
 * 
 * On success, it returns the updated user profile in JSON format.
 * Supports preflight CORS requests.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

// Handle preflight request
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
$hourlyRate = $data['hourlyRate'] ?? null;
$profilePhoto = $data['profilePhoto'] ?? null;
$mainSubjects = $data['main_subjects'] ?? null; // Add this line

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

// Add optional fields
if ($profilePhoto) {
    $sql .= ", profile_image = ?";
    $params[] = $profilePhoto;
}

if ($mainSubjects) {
    $sql .= ", main_subjects = ?";
    $params[] = json_encode($mainSubjects); // Encode as JSON for database storage
}

$sql .= " WHERE email = ?";
$params[] = $email;

// Prepare and execute
$stmt = $dbh->prepare($sql);
if (!$stmt->execute($params)) {
    echo json_encode(["error" => "Failed to update profile: " . implode(" ", $stmt->errorInfo())]);
    exit;
}

// Fetch updated user
$query = "SELECT first_name, last_name, macid, student_number, user_type, wage, profile_image, 
          main_subjects, email, major 
          FROM Users WHERE email = ?";
$stmt = $dbh->prepare($query);
$stmt->execute([$email]);
$updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$updatedUser) {
    echo json_encode(["error" => "User not found after update."]);
    exit;
}

// Decode JSON fields
$updatedUser['main_subjects'] = json_decode($updatedUser['main_subjects'] ?? '[]', true);

// Return updated profile
echo json_encode([
    "success" => true,
    "user_profile" => $updatedUser
]);