<?php
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
            "user_profile" => [
                "email" => $user['email'],
                "firstName" => $user['first_name'],
                "lastName" => $user['last_name'],
                "fullName" => $user['full_name'],
                "macId" => $user['macid'],
                "studentNumber" => $user['student_number'],
                "role" => ucfirst($user['user_type']), // 'tutor' -> 'Tutor'
                "hourlyRate" => $user['wage'],
                "preferredDays" => $preferredDays,
                "subjectExpertise" => $subjectExpertise,
                "profilePhoto" => $user['profile_image'],
                // Add other fields as needed
            ]
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