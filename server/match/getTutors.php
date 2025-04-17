<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $sql = "SELECT * FROM Users WHERE user_type = :user_type";
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':user_type' => "tutor"]);
  $tutors = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($tutors);
}