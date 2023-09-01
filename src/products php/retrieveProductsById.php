<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$datas = json_decode(file_get_contents('php://input'), true);
if($datas === null) { return; }
$productId = $datas['productId'];
$sizeId = $datas['sizeId'];
$colorId = $datas['colorId'];

$host = 'localhost';
$username = 'root';
$password = 'ciprianS26';
$dbname = 'epiz_33174967_products';

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$data = array();
$missingData = array();

$query = "SELECT * FROM `products info` WHERE product_id = ? AND size_id = ? AND color_id = ? AND quantity > 0";
$stmt = $conn->prepare($query);
$stmt->bind_param("iii", $productId, $sizeId, $colorId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 0) {
  $query = "SELECT * FROM products WHERE product_id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("i", $productId);
  $stmt->execute();
  $result = $stmt->get_result();

  $row = $result->fetch_assoc();
  $product = $row;

} else {
  $product = null;
  $missingData[] = $productId;
}

$data['products'] = $product;
$data['missingData'] = $missingData;

echo json_encode($data);
$conn->close();
?>