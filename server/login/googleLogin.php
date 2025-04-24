<?php
/**
 * File: googleLogin.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 * 
 * Description:
 * This endpoint handles Google OAuth login for TutorMatch.
 * It checks if a user with the provided Google email exists in the database.
 * If found, the full user profile is returned in JSON format.
 * Tutor-specific fields like preferred_days and subject_expertise are decoded if present.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];

    $sql = "SELECT * FROM Users WHERE email = :email";
    $stmt = $dbh->prepare($sql);
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Parse tutor-specific data if exists
        $preferredDays = [];
        $subjectExpertise = [];
        
        if ($user['user_type'] === 'tutor') {
            // Assuming these are stored as JSON strings in the database
            $preferredDays = json_decode($user['preferred_days'] ?? '[]', true);
            $subjectExpertise = json_decode($user['subject_expertise'] ?? '[]', true);
        }

        echo json_encode([
            "success" => true,
            "user_profile" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "User not found",
            "user_profile" => null
        ]);
    }
}
?>