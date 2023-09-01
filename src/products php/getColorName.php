<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$data = json_decode(file_get_contents('php://input'), true);
$colorId = $data;

if ($colorId === null) {
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

$query = "SELECT Name FROM `colors` WHERE color_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $colorId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("error");
}

$row = $result->fetch_assoc();
$colorName = $row['Name'];

header('Content-Type: application/json');
echo json_encode($colorName);

$conn->close();
?>