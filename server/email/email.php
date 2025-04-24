<?php
/**
 * File: email.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 * 
 * Description:
 * This endpoint handles email sending using the Gmail API via OAuth2.
 * It validates and sanitizes incoming POST requests containing email details,
 * retrieves the user’s Google OAuth tokens from the database,
 * refreshes the access token if expired, and sends the email using cURL.
 * If authentication is missing or token refresh fails, it returns an appropriate error with a redirect flag.
 */

require_once '../connect.php'; 
require_once '../vendor/autoload.php';

use Google\Client;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Set CORS headers
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

    //  Pull user's tokens from DB
    $stmt = $dbh->prepare("SELECT gauth_access_token, gauth_refresh_token, gauth_token_type, gauth_scope, gauth_expiry FROM Users WHERE email = ?");
    $stmt->execute([$from]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['gauth_access_token'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "redirect" =>  true, "error" => "User is not authenticated with Google."]);
        exit;
    }

    //  Load credentials into Google Client
    $client = new Google_Client();
    $client->setAuthConfig('../credentials.json');
    $client->addScope(Google\Service\Gmail::GMAIL_SEND);
    $client->setAccessType('offline');

    $client->setAccessToken([
        'access_token' => $user['gauth_access_token'],
        'refresh_token' => $user['gauth_refresh_token'],
        'expires_in' => strtotime($user['gauth_expiry']) - time(),
        'scope' => $user['gauth_scope'],
        'token_type' => $user['gauth_token_type'],
        'created' => time() - 60
    ]);

    //  Refresh if needed
    if ($client->isAccessTokenExpired()) {
        $newToken = $client->fetchAccessTokenWithRefreshToken($user['gauth_refresh_token']);
        if (isset($newToken['error'])) {
            http_response_code(401);
            echo json_encode(["success" => false, "error" => "Failed to refresh token: " . $newToken['error']]);
            exit;
        }

        // Update DB with new token
        $update = $pdo->prepare("UPDATE Users SET gauth_access_token = ?, gauth_expiry = ? WHERE email = ?");
        $update->execute([
            $newToken['access_token'],
            date('Y-m-d H:i:s', time() + $newToken['expires_in']),
            $from
        ]);
    }

    // ✉️ Compose raw email
    $rawMessage = "To: $to\r\n";
    $rawMessage .= "Subject: $subject\r\n";
    $rawMessage .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $rawMessage .= $message;
    $rawMessage .= "From: $from\r\n";

    $rawBase64Url = rtrim(strtr(base64_encode($rawMessage), '+/', '-_'), '=');

    //  Send via Gmail API
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $client->getAccessToken()['access_token'],
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
            "redirect" => true,
            "error" => "Failed to send email. HTTP $httpcode",
            "details" => $response ?: 'No response body',
            "curl_error" => $error
        ]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "redirect" => true,
        "error" => "Server error",
        "message" => $e->getMessage()
    ]);
}
?>
