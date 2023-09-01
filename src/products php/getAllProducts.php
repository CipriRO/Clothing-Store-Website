<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Connection details
$host = 'localhost';
$username = 'root';
$password = 'ciprianS26';
$dbname = 'epiz_33174967_products';

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$param = "homepage categories";

$query = "SELECT Value FROM `settings` WHERE Name = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $param);
$stmt->execute();
$result = $stmt->get_result();

$row = $result->fetch_assoc();
$homeCateg = explode(',', $row['Value']);
?>