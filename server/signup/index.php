<?php
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies
require_once '../connect.php';

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
    $insertUserQuery = "INSERT INTO users (
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
    die("Error inserting into the database: " . $e->getMessage());
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
