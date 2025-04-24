<?php
/**
 * File: getMatches.php
 * Team: WebFusion
 * Description: Safely retrieves matched tutors for a given tutee ID
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tuteeID = filter_input(INPUT_GET, 'tuteeID', FILTER_VALIDATE_INT);

    try {
        $stmt = $dbh->prepare("SELECT matched_tutors FROM Users WHERE id = :tuteeID");
        $stmt->execute([':tuteeID' => $tuteeID]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $tutorIDs = json_decode($row['matched_tutors'] ?? '[]', true);

        if (!is_array($tutorIDs) || empty($tutorIDs)) {
            echo json_encode([]);
            exit;
        }

        $placeholders = implode(',', array_fill(0, count($tutorIDs), '?'));
        $stmt = $dbh->prepare("SELECT * FROM Users WHERE id IN ($placeholders)");
        $stmt->execute($tutorIDs);
        $tutors = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($tutors);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "error" => "Server error while fetching matches",
            "details" => $e->getMessage()
        ]);
    }
}
