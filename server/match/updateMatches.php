<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $tuteeID = filter_input(INPUT_GET, 'tuteeID', FILTER_VALIDATE_INT);
  $tutorID = filter_input(INPUT_GET, 'tutorID', FILTER_VALIDATE_INT);

  //get current mathced tutors
  $sql = "SELECT matched_tutors FROM Users WHERE id = :id";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':id' => $tuteeID]);
  $currentMatchedTutors = $stmt->fetch(PDO::FETCH_ASSOC);

  $decoded = json_decode($currentMatchedTutors['matched_tutors'], true);
  if (!is_array($decoded)) {//iff null set to empty

    $matchedTutors = [];
  } else {
    $matchedTutors = $decoded;
  }
  //add new matched tutor
  $matchedTutors[] = $tutorID;
  $updatedMatchedTutors = json_encode($matchedTutors);

  //update database
  $updateSql = "UPDATE Users SET matched_tutors = :matched WHERE id = :id";
  $updateStmt = $dbh->prepare($updateSql);
  $updateStmt->execute([
    ':matched' => $updatedMatchedTutors,
    ':id' => $tuteeID
  ]);

  echo $updatedMatchedTutors;
}
