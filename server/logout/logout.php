<?php
session_start();
session_unset();    // Unset all session variables
session_destroy();  // Destroy the session itself

// Optional: Redirect to home/login
header("Location: https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/home");
exit;