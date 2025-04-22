<?php
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies

require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $tutorID = filter_input(INPUT_GET, 'tutorID', FILTER_VALIDATE_INT);

  $sql = "SELECT 
                id,
                authorID as tuteeID,
                rating,
                title,
                body as review_text,
                authorName as reviewer_name,
                datePosted as created_at,
                tutorID,
                tutorName
            FROM Reviews 
            WHERE tutorID = :tutorID 
            ORDER BY datePosted DESC";

          
  $stmt = $dbh->prepare($sql);
  $stmt->execute([':tutorID' => $tutorID]);
  $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($reviews);
}