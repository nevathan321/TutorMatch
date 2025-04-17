<?php
require_once __DIR__ . '/vendor/autoload.php';
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Google\Service\Calendar\EventAttendee;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Always return JSON
header("Content-Type: application/json");

// Handle CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(204);
    exit(0);
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {

    // Validate method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Only POST requests are allowed"]);
        exit;
    }

    // Validate input
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['tutorEmail'], $data['startTime'], $data['endTime'], $data['summary'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    // Ensure session tokens are present
    if (!isset($_SESSION['access_token']) || !isset($_SESSION['refresh_token'])) {
        echo json_encode([
            "success" => false,
            "error" => "Not authenticated. Please authenticate first.",
            "redirect" => "http://localhost/TutorMatch/server/authenticate.php"
        ]);
        exit;
    }

    // Use session tokens
    $accessToken = $_SESSION['access_token'];
    $refreshToken = $_SESSION['refresh_token'];

    $client = new Google_Client();
    $client->setAuthConfig('/Applications/XAMPP/xamppfiles/htdocs/TutorMatch/server/credentials.json');
    
    // Make sure to add the Calendar scope
    $client->addScope(Google\Service\Gmail::GMAIL_SEND);
    $client->addScope(Google\Service\Calendar::CALENDAR_EVENTS);
    
    $client->setAccessToken(['access_token' => $accessToken]);

    // Refresh token if expired
    if ($client->isAccessTokenExpired()) {
        $client->fetchAccessTokenWithRefreshToken($refreshToken);
        $newAccessToken = $client->getAccessToken();

        if (isset($newAccessToken['error'])) {
            echo json_encode([
                "success" => false,
                "error" => "Token refresh failed: " . $newAccessToken['error'],
                "redirect" => "http://localhost/TutorMatch/server/authenticate.php"
            ]);
            exit;
        }

        $_SESSION['access_token'] = $newAccessToken['access_token'];
        if (isset($newAccessToken['refresh_token'])) {
            $_SESSION['refresh_token'] = $newAccessToken['refresh_token'];
        }
        $accessToken = $newAccessToken['access_token'];
    }

    $calendarService = new Calendar($client);
    
    // Create calendar event
    $event = new Google\Service\Calendar\Event([
        'summary' => $data['summary'],
        'description' => $data['description'] ?? 'Tutoring session with ' . $data['tutorName'],
        'start' => [
            'dateTime' => $data['startTime'],
            'timeZone' => $data['timeZone'] ?? 'America/New_York',
        ],
        'end' => [
            'dateTime' => $data['endTime'],
            'timeZone' => $data['timeZone'] ?? 'America/New_York',
        ],
        'attendees' => [
            ['email' => $data['tutorEmail']],
        ],
        'reminders' => [
            'useDefault' => false,
            'overrides' => [
                ['method' => 'email', 'minutes' => 24 * 60],
                ['method' => 'popup', 'minutes' => 30],
            ],
        ],
    ]);

    // Insert the event
    $calendarId = 'primary'; // use primary calendar
    $event = $calendarService->events->insert($calendarId, $event, ['sendUpdates' => 'all']);

    echo json_encode([
        "success" => true, 
        "message" => "Calendar invite sent successfully",
        "eventId" => $event->getId(),
        "eventLink" => $event->getHtmlLink()
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server Error",
        "message" => $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}