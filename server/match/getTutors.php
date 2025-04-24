<?php
/**
 * File: getTutors.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 *
 * Description:
 * This file retrieves all tutor profiles from the database that a given tutee has not yet
 * accepted (matched) or rejected. It filters out any tutor IDs that already exist in the
 * tutee's `matched_tutors` or `rejected_tutors` fields (both stored as JSON arrays).
 * 
 * Accepts:
 * - GET parameter `tuteeID`: the ID of the current tutee
 *
 * Returns:
 * - A JSON-encoded array of eligible tutor profiles
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $tuteeID = filter_input(INPUT_GET, 'tuteeID', FILTER_VALIDATE_INT);

  // Get all tutors
  $sql = "SELECT * FROM Users WHERE user_type = :user_type";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':user_type' => "tutor"]);
  $tutors = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // get current matched tutors
  $sql = "SELECT matched_tutors FROM Users WHERE id = :id";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':id' => $tuteeID]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $currentMatchedTutors = json_decode($row['matched_tutors'] ?? '[]', true);

  // get current rejected tutors
  $sql = "SELECT rejected_tutors FROM Users WHERE id = :id";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':id' => $tuteeID]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $currentRejectedTutors = json_decode($row['rejected_tutors'] ?? '[]', true);
  
  // dont return tutors user has rejected or accepted
  $filteredTutors = [];
  foreach ($tutors as $tutor) {
    if (in_array($tutor["id"], $currentMatchedTutors)) {
      continue;
    }
    if (in_array($tutor["id"], $currentRejectedTutors)) {
      continue;
    }
    $filteredTutors[] = $tutor;
  }

  // Return result
  echo json_encode($filteredTutors);
}
