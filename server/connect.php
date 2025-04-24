<?php
/**
 * File: connect.php
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * This script handles the database connection using PDO.
 * The connection uses root as the username and no password (development default).
 * On failure, it throws an error and terminates the script.
 */



$username = "root";
$password = "";
$host = "localhost:3306";
$dbname = "TutorMatch";
try {
  $dbh = new PDO(
    "mysql:host=$host;dbname=$dbname",
    $username,
    $password
  );

  $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  die("ERROR: Couldn't connect. {$e->getMessage()}");
}
