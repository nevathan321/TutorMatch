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



$username = "xiaol31_local";
$password = ";0FsM%>&";
$host = "localhost";
$dbname = "xiaol31_db";
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
