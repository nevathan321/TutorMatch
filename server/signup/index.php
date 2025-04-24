<?php
/**
 * File: signup.php
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * This endpoint handles user registration for the TutorMatch application.
 * It supports both tutor and tutee registrations by parsing incoming JSON data
 * and inserting user records into the database. It first checks if a user with
 * the given email already exists to prevent duplicates.
 * User data is stored securely, including password hashing.
 * Accepts HTTP POST requests with JSON payload and returns JSON responses.
 */

header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies
require_once '../connect.php';

/**
 * Checks whether a user with the given email already exists in the database.
 *
 * @param PDO $dbh - Database connection object
 * @param string $email - Email address to search for
 * @return bool - True if user exists, false otherwise
 */
function doesUserExist($dbh, $email)
{
  try {
    $checkSQL = "SELECT * FROM Users WHERE email = :email";

    $stmt = $dbh->prepare($checkSQL);
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

/**
 * Inserts a new user into the Users table in the database.
 *
 * @param PDO $dbh - Database connection object
 * @param array $userData - Associative array of user attributes
 * @param string $user_type - The type of user ('tutee' or 'tutor')
 * @return void - Outputs JSON response with success or error message
 */

function addUserToDatabase($dbh, $userData, $user_type)
{
  $full_name = $userData['name'];
  $first_name = $userData['first_name'];
  $last_name = $userData['last_name'];
  $email = $userData['email'];
  $account_password = $userData['account_password'] ?? NULL;
  $macid = $userData['macid'] ?? NULL;
  $student_number = $userData['student_number'] ?? NULL;
  $major = $userData['major'] ?? NULL;
  $year_of_study = $userData['year_of_study'] ?? NULL;
  $dob = $userData['dob'] ?? NULL;
  $main_subject = $userData['main_subject'] ?? NULL;
  $wage = $userData['wage'] ?? NULL;
  try {
    $insertUserQuery = "INSERT INTO Users (
        first_name, last_name, full_name, email, account_password,
        macid, student_number, major, main_subjects, wage,
        year_of_study, dob, user_type
    ) VALUES (
        :first_name, :last_name, :full_name, :email, :account_password,
        :macid, :student_number, :major, :main_subjects, :wage,
        :year_of_study, :dob, :user_type
    )";


    $stmt = $dbh->prepare($insertUserQuery);

    $data = [
      'first_name' => $first_name,
      'last_name' => $last_name,
      'full_name' => $full_name,
      'email' => $email,
      'account_password' => password_hash($account_password, PASSWORD_DEFAULT),
      'macid' => $macid,
      'student_number' => $student_number,
      'major' => $major,
      'main_subjects' => $main_subject,
      'wage' => $wage, // or NULL if tutee
      'year_of_study' => $year_of_study,
      'dob' => $dob,
      'user_type' => $user_type // or 'tutee'
    ];
    $stmt->execute($data);
    $lastInsertId = $dbh->lastInsertId();
    $stmt = $dbh->prepare("SELECT * FROM Users WHERE id = :id");
    $stmt->execute([':id' => $lastInsertId]);
    $newUser = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["user_exists" => false, "status" => "success", "user" => $newUser]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      "status" => "error",
      "message" => "Error inserting into the database: " . $e->getMessage()
    ]);
    exit;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json_data = file_get_contents('php://input');
  $userData = json_decode($json_data, true);
  $user_type = filter_input(INPUT_GET, "type", FILTER_SANITIZE_SPECIAL_CHARS);

  $email = $userData['email'];
  if (doesUserExist($dbh, $email, $user_type)) {
    echo json_encode(["user_exists" => true, "message" => "User already exists", "type" => $user_type]);
    exit;
  }


  addUserToDatabase($dbh, $userData, $user_type);
} else {
  echo "WORKING";
}
