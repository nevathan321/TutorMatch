<?php
//update rejected tutors when tutee doesnt want to match with them
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $tuteeID = filter_input(INPUT_GET, 'tuteeID', FILTER_VALIDATE_INT);
  $tutorID = filter_input(INPUT_GET, 'tutorID', FILTER_VALIDATE_INT);

  //get current rejected tutors
  $sql = "SELECT rejected_tutors FROM Users WHERE id = :id";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':id' => $tuteeID]);
  $currentRejectedTutors = $stmt->fetch(PDO::FETCH_ASSOC);

  $decoded = json_decode($currentRejectedTutors['rejected_tutors'], true);
  if (!is_array($decoded)) {//if null set to empty

    $rejectedTutors = [];
  } else {
    $rejectedTutors = $decoded;
  }
  //add tutor
  $rejectedTutors[] = $tutorID;
  $updatedRejecetedTutors = json_encode($rejectedTutors);

  //update database
  $updateSql = "UPDATE Users SET rejected_tutors = :rejectedTutor WHERE id = :id";
  $updateStmt = $dbh->prepare($updateSql);
  $updateStmt->execute([
    ':rejectedTutor' => $updatedRejecetedTutors,
    ':id' => $tuteeID
  ]);

  echo $updatedRejecetedTutors;
}
