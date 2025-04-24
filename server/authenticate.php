<?php
/**
 * File: authenticate.php
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * This script handles OAuth2 authentication with Google for the TutorMatch application.
 * It enables access to Gmail, Google Calendar, and user email info.
 * Upon successful login, it stores the access token and refresh token in both the session
 * and the database, allowing the user to send emails and schedule calendar events.
 * The script also provides a simple UI for Google login and confirmation messages.
 */

session_start(); // Start the session

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'vendor/autoload.php';
require_once 'connect.php'; 
use Google\Service\Gmail;
use Google\Service\Oauth2;

try {
    $client = new Google_Client();
    $client->setAuthConfig('credentials.json');
    $client->addScope(Gmail::GMAIL_SEND);
    $client->addScope(Google\Service\Calendar::CALENDAR_EVENTS);
    $client->addScope(Google\Service\Oauth2::USERINFO_EMAIL);
    $client->setRedirectUri('https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/authenticate.php');
    $client->setAccessType('offline');
    $client->setPrompt('consent');

    if (isset($_GET['code'])) {
        $code = $_GET['code'];
        $accessToken = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($accessToken['error'])) {
            throw new Exception("Error fetching access token: " . $accessToken['error']);
        } else {
            $client->setAccessToken($accessToken);

            // ✅ Store full token array, not just access_token
            $_SESSION['access_token'] = $accessToken;
            if (isset($accessToken['refresh_token'])) {
                $_SESSION['refresh_token'] = $accessToken['refresh_token'];
            }

            // ✅ Get user info and store email
            $oauth2 = new Oauth2($client);
            $userInfo = $oauth2->userinfo->get();
            $_SESSION['user_email'] = $userInfo->email;

            $gauth_scope = $accessToken['scope'] ?? '';


            if (!str_contains($gauth_scope, 'gmail.send')) {
                throw new Exception("Gmail scope not granted. Please retry authentication and allow email access.");
            }

            $updateStmt = $dbh->prepare(" UPDATE Users SET gauth_access_token = ?, 
                                    gauth_refresh_token = ?,
                                    gauth_token_type = ?,
                                    gauth_scope = ?,
                                    gauth_expiry = ?
                                    WHERE email = ?
                                 ");

            $updateStmt->execute([
                $accessToken['access_token'],
                $accessToken['refresh_token'] ?? null,
                $accessToken['token_type'] ?? 'Bearer',
                $accessToken['scope'] ?? '',
                date('Y-m-d H:i:s', time() + ($accessToken['expires_in'] ?? 0)),
                $userInfo->email
            ]);

            echo "
            <!DOCTYPE html>
            <html>
            <head>
                <title>Authentication Successful</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6; }
                    .success { color: green; font-weight: bold; }
                    .btn { display: inline-block; background: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>Authentication Successful!</h1>
                <p class='success'>You have successfully authenticated with Google as <strong> ". htmlspecialchars($userInfo->email) ." </strong>.</p>
                <p>You can now return to the TutorMatch application and send emails.</p>
                <a href='https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch' class='btn'>Return to TutorMatch</a>
            </body>
            </html>
            ";
        }
    } else {
        $authUrl = $client->createAuthUrl();
        echo "
        <!DOCTYPE html>
        <html>
        <head>
            <title>TutorMatch Authentication</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6; }
                .btn { display: inline-block; background: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
            </style>
        </head>
        <body>
            <h1>TutorMatch Email Authentication</h1>
            <p>To send emails through TutorMatch, you need to authenticate with your Google account.</p>
            <p>This will allow TutorMatch to send emails on your behalf.</p>
            <a href=\"" . htmlspecialchars($authUrl) . "\" class='btn'>Authenticate with Google</a>
        </body>
        </html>
        ";
    }
} catch (Exception $e) {
    http_response_code(500);
    echo "
    <!DOCTYPE html>
    <html>
    <head>
        <title>Authentication Error</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            .error { color: red; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>Authentication Error</h1>
        <p class='error'>An error occurred during authentication:</p>
        <p> ". htmlspecialchars($e->getMessage()) ." </p>
        <a href='https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch'>Return to TutorMatch</a>
    </body>
    </html>
    ";
}
