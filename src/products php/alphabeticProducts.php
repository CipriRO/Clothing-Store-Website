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

$query = "SELECT * FROM `products` WHERE availability = 'true'";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("error");
}

$products = array();

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

$alphabet = range('A', 'Z');
$foundLetters = [];
$letterProducts = [];

foreach ($alphabet as $letter) {
  $productsForLetter = array_filter($products, function($product) use ($letter) {
    return strtoupper(substr($product['name'], 0, 1)) === $letter;
  });

  if (count($productsForLetter) > 0) {
    $foundLetters[] = $letter;
    foreach($productsForLetter as &$product) {
      $product['letter'] = $letter;
    }
    $letterProducts = array_merge($letterProducts, $productsForLetter);
  }
}

$data = [
    'letters' => $foundLetters,
    'products' => $letterProducts
];
  
header('Content-Type: application/json');
echo json_encode($data);
$conn->close();
?>