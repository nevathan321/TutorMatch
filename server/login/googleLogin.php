<?php
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies
//header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = $_POST['email'];

  $sql = "SELECT * FROM Users WHERE email = :email";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':email' => $email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($stmt) {
    echo json_encode(["success" => true, "user_profile" => $user, "email" => $email]);
    // Redirect to dashboard or wherever
  } else {
    // Invalid email or password
    echo json_encode(["success" => false, "user_profile" => null]);
  }
}
