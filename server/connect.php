<?php
//handle database connection 

$username = "root";
//$password = "9YjhtlaJ";
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
