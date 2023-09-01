<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$data = json_decode(file_get_contents('php://input'), true);
$colorName = $data;

if ($colorName === null) {
    die('error');
}

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

$query = "SELECT color_id FROM `colors` WHERE Name = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $colorName);
$stmt->execute();
$result = $stmt->get_result();

$row = $result->fetch_assoc();
$colorId = $row['color_id'];

header('Content-Type: application/json');
echo json_encode($colorId);

$conn->close();
?>