<?php
/**
 * File: createReview.php
 * Group: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: April 24, 2025
 *
 * Description:
 * This file receives POST requests to upload new tutor reviews.
 * It parses the JSON request body containing review details and
 * inserts the review into the `Reviews` table in the database.
 * Returns a confirmation message upon success.
 */

 
header("Access-Control-Allow-Origin: *");  // Replace '*' with the specific domain for better security
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Cross-Origin-Opener-Policy: same-origin");  // Add this to allow same-origin communication
header("Cross-Origin-Embedder-Policy: require-corp");  // Add this for stricter policies
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $json_data = file_get_contents('php://input');
  $reviewData = json_decode($json_data, true);
  $stmt = $dbh->prepare("INSERT INTO Reviews (authorID, rating, title, body, authorName, datePosted, tutorID, tutorName) VALUES (:authorID, :rating, :title, :body, :authorName, :datePosted, :tutorID, :tutorName)");
  $stmt->execute([
    ':authorID' => $reviewData["authorID"],
    ':rating' => $reviewData["rating"],
    ':title' => $reviewData["title"],
    ':body' => $reviewData["body"],
    ':authorName' => $reviewData["authorName"],
    ':datePosted' => $reviewData["datePosted"],
    ':tutorID' => $reviewData["tutorID"],
    ':tutorName' => $reviewData["tutorName"]
  ]);

  echo "Review Uploaded";
}
