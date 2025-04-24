<?php
/**
 * File: calendar.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 *
 * Description:
 * This endpoint allows authenticated users to schedule Google Calendar events (e.g. tutoring sessions).
 * It accepts tutor and sender email addresses, event start and end times, and event details.
 * The script uses OAuth tokens to authenticate with the Google Calendar API and send event invites to both parties.
 * Access tokens are refreshed if expired, and updated in the database accordingly.
 */

ob_start();

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/calendar_errors.log');

require_once '../vendor/autoload.php';
require_once '../connect.php'; 

use Google\Client;
use Google\Service\Calendar;

// CORS Headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method is allowed');
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['tutorEmail'], $input['startTime'], $input['endTime'], $input['summary'])) {
        throw new Exception('Missing required fields');
    }

    // Pull token from DB using tutorEmail
    $tutorEmail = filter_var($input['tutorEmail'], FILTER_SANITIZE_EMAIL);
    $senderEmail = filter_var($input['senderEmail'], FILTER_SANITIZE_EMAIL);

    $stmt = $dbh->prepare("SELECT gauth_access_token, gauth_refresh_token, gauth_token_type, gauth_scope, gauth_expiry FROM Users WHERE email = ?");
    $stmt->execute([$senderEmail]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['gauth_access_token'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Sender is not authenticated with Google'
        ]);
        exit;
    }

    // Setup Google Client
    $client = new Google_Client();
    $client->setAuthConfig('../credentials.json');
    $client->addScope(Google\Service\Calendar::CALENDAR_EVENTS);
    $client->setAccessType('offline');
    $client->setAccessToken([
        'access_token' => $user['gauth_access_token'],
        'refresh_token' => $user['gauth_refresh_token'],
        'expires_in' => strtotime($user['gauth_expiry']) - time(),
        'scope' => $user['gauth_scope'],
        'token_type' => $user['gauth_token_type'],
        'created' => time() - 60
    ]);

    // Refresh if expired
    if ($client->isAccessTokenExpired()) {
        $newToken = $client->fetchAccessTokenWithRefreshToken($user['gauth_refresh_token']);
        if (isset($newToken['error'])) {
            throw new Exception('Token refresh failed: ' . $newToken['error']);
        }

        // Update token in DB
        $update = $pdo->prepare("UPDATE Users SET gauth_access_token = ?, gauth_expiry = ? WHERE email = ?");
        $update->execute([
            $newToken['access_token'],
            date('Y-m-d H:i:s', time() + $newToken['expires_in']),
            $tutorEmail
        ]);
    }

    // Prepare Calendar Event
    $service = new Calendar($client);

    $event = new Google\Service\Calendar\Event([
        'summary' => $input['summary'],
        'description' => $input['description'] ?? 'Tutoring session',
        'start' => [
            'dateTime' => $input['startTime'],
            'timeZone' => 'America/Toronto'
        ],
        'end' => [
            'dateTime' => $input['endTime'],
            'timeZone' => 'America/Toronto'
        ],
        'attendees' => [
            [
                'email' => $tutorEmail,
                'useDefault' => false,
                'responseStatus' => 'needsAction'
            ],
            [
                'email' => $senderEmail,
                'useDefault' => false,
                'responseStatus' => 'needsAction'
            ]
        ]
    ]);

    $calendarId = 'primary';
    $event = $service->events->insert($calendarId, $event, ['sendUpdates' => 'all']);

    ob_end_clean();
    echo json_encode([
        'success' => true,
        'eventId' => $event->getId(),
        'eventLink' => $event->getHtmlLink()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    ob_end_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
