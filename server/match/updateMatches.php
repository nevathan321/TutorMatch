<?php
/**
 * File: updateMatches.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 *
 * Description:
 * This file updates the list of tutors that a tutee has chosen to match with.
 * When a tutee accepts a tutor, the tutor's ID is added to the `matched_tutors` field 
 * in the Users table. This field is stored as a JSON array.
 * 
 * The script accepts `tuteeID` and `tutorID` as GET parameters and updates the corresponding record.
 * The updated matched tutors array is returned as a JSON-encoded response.
 * 
 * Includes headers to support CORS for cross-origin requests.
 */
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
