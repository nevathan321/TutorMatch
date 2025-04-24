<?php
/**
 * File: email.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 *
 * Description:
 * Sends email using Gmail API via OAuth2 using the official Google PHP client.
 * Removes curl usage for compatibility on servers like cs1xd3.
 */

require_once '../connect.php'; 
require_once '../vendor/autoload.php';

use Google\Client;
use Google\Service\Gmail;
use Google\Service\Gmail\Message;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// CORS support
$allowed_origins = ["http://localhost:3000", "http://localhost", "https://cs1xd3.cas.mcmaster.ca"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(204);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Only POST requests are allowed"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['from'], $data['to'], $data['subject'], $data['message'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing required fields"]);
        exit;
    }

    $from = filter_var($data['from'], FILTER_SANITIZE_EMAIL);
    $to = filter_var($data['to'], FILTER_SANITIZE_EMAIL);
    $subject = strip_tags($data['subject']);
    $message = strip_tags($data['message']);

    // Get tokens from DB
    $stmt = $dbh->prepare("SELECT gauth_access_token, gauth_refresh_token, gauth_token_type, gauth_scope, gauth_expiry FROM Users WHERE email = ?");
    $stmt->execute([$from]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['gauth_access_token'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "redirect" => true, "error" => "User is not authenticated with Google."]);
        exit;
    }

    // Initialize Google Client
    $client = new Client();
    $client->setAuthConfig('../credentials.json');
    $client->addScope(Gmail::GMAIL_SEND);
    $client->setAccessType('offline');
    $client->setAccessToken([
        'access_token' => $user['gauth_access_token'],
        'refresh_token' => $user['gauth_refresh_token'],
        'expires_in' => strtotime($user['gauth_expiry']) - time(),
        'scope' => $user['gauth_scope'],
        'token_type' => $user['gauth_token_type'],
        'created' => time() - 60
    ]);

    if (!str_contains($user['gauth_scope'], 'gmail.send')) {
        http_response_code(401);
        echo json_encode(["success" => false, "redirect" => true, "error" => "Missing Gmail scope. Please re-authenticate."]);
        exit;
    }

    // Refresh if needed
    if ($client->isAccessTokenExpired()) {
        $newToken = $client->fetchAccessTokenWithRefreshToken($user['gauth_refresh_token']);
        if (isset($newToken['error'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Failed to refresh token: " . $newToken['error']]);
            exit;
        }

        $update = $dbh->prepare("UPDATE Users SET gauth_access_token = ?, gauth_expiry = ? WHERE email = ?");
        $update->execute([
            $newToken['access_token'],
            date('Y-m-d H:i:s', time() + $newToken['expires_in']),
            $from
        ]);
    }

    // Compose and send email using Gmail API
    $gmail = new Gmail($client);
    $email = new Message();

    $rawMessage = "To: $to\r\n";
    $rawMessage .= "From: $from\r\n";
    $rawMessage .= "Subject: $subject\r\n";
    $rawMessage .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $rawMessage .= $message;

    $encodedMessage = rtrim(strtr(base64_encode($rawMessage), '+/', '-_'), '=');
    $email->setRaw($encodedMessage);

    $gmail->users_messages->send('me', $email);

    echo json_encode(["success" => true, "message" => "Email sent successfully"]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server error",
        "message" => $e->getMessage()
    ]);
}
?>

