<?php
// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/calendar_errors.log');

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Start session first
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once '../vendor/autoload.php';
use Google\Client;
use Google\Service\Calendar;

try {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // Check if it's a POST request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST method is allowed');
    }

    // Get and validate input
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('No input data received');
    }

    // Validate required fields
    if (!isset($input['tutorEmail'], $input['startTime'], $input['endTime'], $input['summary'])) {
        throw new Exception('Missing required fields');
    }

    // Check authentication
    if (!isset($_SESSION['access_token'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated',
            'redirect' => 'http://localhost/TutorMatch/server/authenticate.php'
        ]);
        exit;
    }

    $client = new Google_Client();
    $client->setAuthConfig('../credentials.json');
    $client->addScope(Calendar::CALENDAR_EVENTS);
    $client->setAccessToken($_SESSION['access_token']);

    // Refresh token if expired
    if ($client->isAccessTokenExpired()) {
        if (isset($_SESSION['refresh_token'])) {
            $client->fetchAccessTokenWithRefreshToken($_SESSION['refresh_token']);
            $newAccessToken = $client->getAccessToken();
            $_SESSION['access_token'] = $newAccessToken['access_token'];
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Session expired',
                'redirect' => 'http://localhost/TutorMatch/server/authenticate.php'
            ]);
            exit;
        }
    }

    // Create Calendar service
    $service = new Calendar($client);

    
    $event = new Google\Service\Calendar\Event([
        'summary' => $input['summary'],
        'description' => $input['description'] ?? 'Tutoring session',
        'start' => [
            'dateTime' => $input['startTime'],
            'timeZone' => 'America/Toronto' // You can change this based on your region
        ],
        'end' => [
            'dateTime' => $input['endTime'],
            'timeZone' => 'America/Toronto'
        ],
        'attendees' => [
            [
                'email' => $input['tutorEmail'],
                'useDefault' => false,
                'responseStatus' => 'needsAction'
            ],
            [
                'email' => 'liyuxiao2@gmail.com',
                'useDefault' => false,
                'responseStatus' => 'needsAction'
            ]
        ]
    ]);
    

    $calendarId = 'primary';
    $event = $service->events->insert($calendarId, $event, ['sendUpdates' => 'all']);

    echo json_encode([
        'success' => true,
        'eventId' => $event->getId(),
        'eventLink' => $event->getHtmlLink()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}