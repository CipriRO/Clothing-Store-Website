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

$query = "SELECT * FROM `products` WHERE availability = 'true' AND `Bought times` != 0 ORDER BY `Bought times` DESC";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$products = array();

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}
  
header('Content-Type: application/json');
echo json_encode($products);