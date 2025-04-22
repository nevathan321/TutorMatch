<?php

use Google\Client;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Always return JSON
header("Content-Type: application/json");

// Define allowed origins
$allowed_origins = [
    "http://localhost:3000",
    "http://localhost", // Add this if you're accessing localhost without the port
    "https://cs1xd3.cas.mcmaster.ca",
];

// Function to set CORS headers
function set_cors_headers($allowed_origins)
{
    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Credentials: true");
    }
}

// Set CORS headers for all requests
set_cors_headers($allowed_origins);

// CORS headers for preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    set_cors_headers($allowed_origins); // Re-apply for OPTIONS

    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(204);
    exit(0);
}

// ✅ Start session — do this AFTER setting headers
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    require_once '../vendor/autoload.php';

    // ✅ Validate method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(["success" => false, "error" => "Only POST requests are allowed"]);
        exit;
    }

    // ✅ Validate input
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['to'], $data['subject'], $data['message'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    // ✅ Ensure session tokens are present
    if (!isset($_SESSION['access_token']) || !isset($_SESSION['refresh_token'])) {
        echo json_encode([
            "success" => false,
            "error" => "Not authenticated. Please authenticate first.",
            "redirect" => "http://localhost/TutorMatch/server/authenticate.php"
        ]);
        exit;
    }

    // ✅ Use session tokens
    $accessToken = $_SESSION['access_token'];
    $refreshToken = $_SESSION['refresh_token'];

    $client = new Google_Client();
    $client->setAuthConfig('/Applications/XAMPP/xamppfiles/htdocs/TutorMatch/server/credentials.json');
    $client->addScope(Google\Service\Gmail::GMAIL_SEND);
    $client->setAccessToken(['access_token' => $accessToken]);

    // ✅ Refresh token if expired
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

    // ✅ Sanitize & build message
    $to = filter_var($data['to'], FILTER_SANITIZE_EMAIL);
    $subject = strip_tags($data['subject']);
    $message = strip_tags($data['message']);

    $rawMessage = "To: $to\r\n";
    $rawMessage .= "Subject: $subject\r\n";
    $rawMessage .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $rawMessage .= $message;

    $rawBase64Url = rtrim(strtr(base64_encode($rawMessage), '+/', '-_'), '=');

    // ✅ Send email via Gmail API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['raw' => $rawBase64Url]));

    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($httpcode == 200 || $httpcode == 202) {
        echo json_encode(["success" => true, "message" => "Email sent successfully"]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "API request failed with code $httpcode",
            "details" => $response ?: 'No response body',
            "curl_error" => $error
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server Error",
        "message" => $e->getMessage()
    ]);
}
?>