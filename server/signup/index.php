<?php
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies
require_once '../connect.php';

function doesUserExist($dbh, $email, $user_type)
{
  try {
    $checkSQL = NULL;
    if ($user_type == "tutee") {
      $checkSQL = "SELECT * FROM Tutees WHERE email = :email";
    } else if ($user_type == "tutor") {
      $checkSQL = "SELECT * FROM Tutors WHERE email = :email";
    }

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

function addTuteeToDatabase($dbh, $userData)
{
  $full_name = $userData['name'];
  $first_name = $userData['given_name'];
  $last_name = $userData['family_name'];
  $email = $userData['email'];

  $macid = $userData['macid'] ?? NULL;
  $major = $userData['major'] ?? NULL;
  $year_of_study = $userData['year_of_study'] ?? NULL;
  $dob = $userData['dob'] ?? NULL;
  $account_password = NULL;

  try {
    $insertUserQuery = "INSERT INTO Tutees 
        (first_name, last_name, full_name, account_password, email, macid, major, year_of_study, dob) 
        VALUES (:first_name, :last_name, :full_name, :account_password, :email, :macid, :major, :year_of_study, :dob)";

    $stmt = $dbh->prepare($insertUserQuery);
    $stmt->execute([
      ":first_name" => $first_name,
      ":last_name" => $last_name,
      ":full_name" => $full_name,
      ":account_password" => $account_password,
      ":email" => $email,
      ":macid" => $macid,
      ":major" => $major,
      ":year_of_study" => $year_of_study,
      ":dob" => $dob
    ]);

    echo json_encode(["user_exists" => false,"status" => "success", "message" => "Tutee added successfully"]);
  } catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Error inserting to the database: " . $e->getMessage()]));
  }
}

function addTutorToDatabase($dbh, $userData)
{
  $full_name = $userData['name'];
  $first_name = $userData['given_name'];
  $last_name = $userData['family_name'];
  $email = $userData['email'];

  $macid = $userData['macid'] ?? NULL;
  $student_number = $userData['student_number'] ?? NULL;
  $major = $userData['major'] ?? NULL;
  $year_of_study = $userData['year_of_study'] ?? NULL;
  $dob = $userData['dob'] ?? NULL;
  $main_subject = $userData['main_subject'] ?? NULL;
  $wage = $userData['wage'] ?? NULL;

  try {
    $insertUserQuery = "INSERT INTO Tutors (first_name, last_name, full_name, account_password, email, macid, student_number, major, year_of_study, dob, main_subject, wage) 
                          VALUES (:first_name, :last_name, :full_name, NULL, :email, :macid, :student_number, :major, :year_of_study, :dob, :main_subject, :wage)";

    $stmt = $dbh->prepare($insertUserQuery);
    $stmt->execute([
      ":first_name" => $first_name,
      ":last_name" => $last_name,
      ":full_name" => $full_name,
      ":email" => $email,
      ":macid" => $macid,
      ":student_number" => $student_number,
      ":major" => $major,
      ":year_of_study" => $year_of_study,
      ":dob" => $dob,
      ":main_subject" => $main_subject,
      ":wage" => $wage
    ]);

    echo json_encode(["user_exists" => false, "status" => "success", "message" => "Tutor added successfully"]);
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

  if ($user_type == "tutee") {
    addTuteeToDatabase($dbh, $userData);
  } else if ($user_type == "tutor") {
    addTutorToDatabase($dbh, $userData);
  }
} else {
  echo "WORKING";
}
