<?php
/**
 * File: fetchEvents.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 *
 * Description:
 * This endpoint retrieves upcoming Google Calendar events for a given user.
 * It authenticates using OAuth tokens stored in the database, refreshes tokens if expired,
 * and fetches the next 100 upcoming events using the Google Calendar API.
 * The response includes event details such as summary, description, start/end time, and attendees.
 */

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

require_once '../vendor/autoload.php';
require_once '../connect.php';

use Google\Client;
use Google\Service\Calendar;

try {
    //  Accept input
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['senderEmail'])) {
        throw new Exception("Missing senderEmail");
    }
    $senderEmail = filter_var($input['senderEmail'], FILTER_SANITIZE_EMAIL);

    //  Fetch user’s token data from DB
    $stmt = $dbh->prepare("SELECT gauth_access_token, gauth_refresh_token, gauth_token_type, gauth_scope, gauth_expiry FROM Users WHERE email = ?");
    $stmt->execute([$senderEmail]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['gauth_access_token'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'User is not authenticated with Google'
        ]);
        exit;
    }

    //  Setup Google Client
    $client = new Google_Client();
    $client->setAuthConfig('../credentials.json');
    $client->addScope(Google\Service\Calendar::CALENDAR_READONLY);
    $client->setAccessType('offline');
    $client->setAccessToken([
        'access_token' => $user['gauth_access_token'],
        'refresh_token' => $user['gauth_refresh_token'],
        'expires_in' => strtotime($user['gauth_expiry']) - time(),
        'scope' => $user['gauth_scope'],
        'token_type' => $user['gauth_token_type'],
        'created' => time() - 60
    ]);

    //  Refresh if expired
    if ($client->isAccessTokenExpired()) {
        $newToken = $client->fetchAccessTokenWithRefreshToken($user['gauth_refresh_token']);
        if (isset($newToken['error'])) {
            throw new Exception("Token refresh failed: " . $newToken['error']);
        }

        $update = $dbh->prepare("UPDATE Users SET gauth_access_token = ?, gauth_expiry = ? WHERE email = ?");
        $update->execute([
            $newToken['access_token'],
            date('Y-m-d H:i:s', time() + $newToken['expires_in']),
            $senderEmail
        ]);
    }

    //  Fetch events
    $service = new Calendar($client);
    $calendarId = 'primary';
    $now = date('c');
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
