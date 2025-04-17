<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/calendar_errors.log');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

require_once '../vendor/autoload.php';
use Google\Client;
use Google\Service\Calendar;

try {
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
    $client->addScope(Calendar::CALENDAR_READONLY);
    $client->setAccessToken($_SESSION['access_token']);

    if ($client->isAccessTokenExpired()) {
        if (isset($_SESSION['refresh_token'])) {
            $client->fetchAccessTokenWithRefreshToken($_SESSION['refresh_token']);
            $_SESSION['access_token'] = $client->getAccessToken()['access_token'];
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Session expired',
                'redirect' => 'http://localhost/TutorMatch/server/authenticate.php'
            ]);
            exit;
        }
    }

    $service = new Calendar($client);

    $calendarId = 'primary';
    $now = date('c'); // ISO-8601 timestamp
    $events = $service->events->listEvents($calendarId, [
        'timeMin' => $now,
        'maxResults' => 100,
        'singleEvents' => true,
        'orderBy' => 'startTime',
    ]);

    $output = [];

    foreach ($events->getItems() as $event) {
        $output[] = [
            'id' => $event->getId(),
            'summary' => $event->getSummary(),
            'description' => $event->getDescription(),
            'start' => $event->getStart()->getDateTime() ?: $event->getStart()->getDate(),
            'end' => $event->getEnd()->getDateTime() ?: $event->getEnd()->getDate(),
            'location' => $event->getLocation(),
            'attendees' => $event->getAttendees(),
            'htmlLink' => $event->getHtmlLink()
        ];
    }

    echo json_encode([
        'success' => true,
        'events' => $output
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}