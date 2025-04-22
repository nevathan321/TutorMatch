<?php
//return all tutors that tutee has matched with
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';


//get array of all tutors that user has matched with
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $tuteeID = filter_input(INPUT_GET, 'tuteeID', FILTER_VALIDATE_INT);

  //get ids of mathced tutors
  $sql = "SELECT matched_tutors FROM Users WHERE id = :tuteeID";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':tuteeID' => $tuteeID]);
  $mathcedTutors = $stmt->fetch(PDO::FETCH_ASSOC);

  $tutorIDS = json_decode($mathcedTutors['matched_tutors'], true);
  if (is_null($tutorIDS)) {//if there are no matched tutors yet and field is NULL
    echo json_encode([]); // return an empty PHP array as JSON 
    return;
  }

  //format ids in sql
  $placeholders = implode(',', array_fill(0, count($tutorIDS), '?'));
  //get all tutors matching the ids
  $stmt1 = $dbh->prepare("SELECT * FROM users WHERE id IN ($placeholders)");
  $stmt1->execute($tutorIDS);
  $tutorsArr = $stmt1->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($tutorsArr);
}