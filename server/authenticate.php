<?php
session_start(); // Start the session

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'vendor/autoload.php';
use Google\Service\Gmail;

try {
    $client = new Google_Client();
    $client->setAuthConfig('/Applications/XAMPP/xamppfiles/htdocs/TutorMatch/server/credentials.json');
    $client->addScope(Gmail::GMAIL_SEND);
    $client->setRedirectUri('http://localhost/TutorMatch/server/authenticate.php');

    // Request offline access to get a refresh token
    $client->setAccessType('offline');
    $client->setPrompt('consent'); // Force the consent screen to reappear

    // Check if the user is being redirected back to this page after authentication
    if (isset($_GET['code'])) {
        $code = $_GET['code'];
        $accessToken = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($accessToken['error'])) {
            throw new Exception("Error fetching access token: " . $accessToken['error']);
        } else {
            // Save tokens in the session
            $_SESSION['access_token'] = $accessToken['access_token'];

            // Check if refresh_token is present
            if (isset($accessToken['refresh_token'])) {
                $_SESSION['refresh_token'] = $accessToken['refresh_token'];
            } else {
                echo "<div style='color: orange; font-weight: bold;'>Warning: No refresh token was returned. This may cause issues with token renewal.</div>";
            }

            // Display success message and redirect option
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
                <p class='success'>You have successfully authenticated with Google.</p>
                <p>You can now return to the TutorMatch application and send emails.</p>
                <a href='http://localhost:3001/inbox' class='btn'>Return to TutorMatch</a>
            </body>
            </html>
            ";
        }
    } else {
        // If not authenticated, show the login button
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
            <a href='$authUrl' class='btn'>Authenticate with Google</a>
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
        <p>" . htmlspecialchars($e->getMessage()) . "</p>
        <a href='http://localhost:3001/inbox'>Return to TutorMatch</a>
    </body>
    </html>
    ";
}