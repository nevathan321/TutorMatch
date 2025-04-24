<?php
/**
 * File: logout.php
 * Date: 2025-04-24
 * Team: WebFusion
 * Team Members: Nevathan, Adrian, Liyu, Abishan
 * 
 * Description:
 * This script handles user logout by clearing all session data and destroying 
 * the session. After logout, the user is redirected to the TutorMatch home page.
 */

session_start();
session_unset();    // Unset all session variables
session_destroy();  // Destroy the session itself

// Optional: Redirect to home/login
header("Location: https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/home");
exit;