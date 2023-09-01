<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$productId = $_POST['id'];

if ($productId === null) {
    die('Invalid product ID');
}

$sizeName = $_POST['size'];

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

$query = "SELECT size_id FROM `sizes` WHERE Name = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $sizeName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("error");
}

$row = $result->fetch_assoc();
$sizeId = $row['size_id'];

$query = "SELECT color_id FROM `products info` WHERE product_id = ? AND size_id = ? AND quantity > 0";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $productId, $sizeId);
$stmt->execute();
$result = $stmt->get_result();

$colorId = array();

while ($row = $result->fetch_assoc()) {
    $colorId[] = $row["color_id"];
}



$query = "SELECT color_id FROM `products info` WHERE product_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();

$colorList = array();

while ($row = $result->fetch_assoc()) {
    $colorList[] = $row["color_id"];
}


$data = [
    'colorList' => $colorList,
    'colorId' => $colorId
];
  
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>