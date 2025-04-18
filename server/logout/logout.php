<?php
session_start();
session_unset();    // Unset all session variables
session_destroy();  // Destroy the session itself

// Optional: Redirect to home/login
header("Location: http://localhost:3000");
exit;