<?php
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies

$username = "root";
$password = "";
$host = "localhost:3306";

function doesUserExist($dbh, $email){
  try {
    $checkSql = "SELECT * FROM users WHERE email = :email";
    $stmt = $dbh->prepare($checkSql);
    $stmt->execute([":email" => $email]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
      return true;
    }
    return false;
  } catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Error checking user existence: " . $e->getMessage()]));
  }
}

function addUserToDatabase($dbh, $userData){
  $full_name = $userData['name'];
  $first_name = $userData['given_name'];
  $last_name = $userData['family_name'];
  $email = $userData['email'];
  try {
    $insertUserQuery = "INSERT INTO users (first_name, last_name, full_name, account_password, email, macid, major, year_of_study, dob) VALUES (:first_name, :last_name, :full_name, NULL, :email, NULL, NULL, NULL, NULL)";
    $stmt = $dbh->prepare($insertUserQuery);
    $stmt->execute([":first_name" => $first_name, ":last_name" => $last_name, ":full_name" => $full_name, ":email" => $email]);
    echo json_encode(["status" => "success", "message" => "User added successfully"]);
  } catch (PDOException $e) {
    die("Error inserting to the database: " . $e->getMessage());
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json_data = file_get_contents('php://input');
  $userData = json_decode($json_data, true);

  $full_name = $userData['name'];
  $first_name = $userData['given_name'];
  $last_name = $userData['family_name'];
  $email = $userData['email'];
  try {
    $dbh = new PDO(
      "mysql:host=$host;dbname=TutorMatch",
      $username,
      $password
    );

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch (Exception $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
  }

  if (doesUserExist($dbh, $email)) {
    echo json_encode(["status" => "exists", "message" => "User already exists"]);
    exit;
  }

  addUserToDatabase($dbh, $userData);
} else {
  echo "WORKING";
}
