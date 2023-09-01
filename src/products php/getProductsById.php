<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$data = json_decode(file_get_contents('php://input'), true);
$productId = $data;

$host = 'localhost';
$username = 'root';
$password = 'ciprianS26';
$dbname = 'epiz_33174967_products';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


$query = "SELECT * FROM products WHERE product_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();

$row = $result->fetch_assoc();
$data = $row;

echo json_encode($data);
$conn->close();
?>