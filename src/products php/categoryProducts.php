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

$categories = [];
$categoriesId = [];

for($i = 0; $i < count($products); $i++) {
    for($j = 0; $j < count(explode(",", $products[$i]['categories'])); $j++) {
        $query = "SELECT Name FROM `categories` WHERE category_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", explode(",", $products[$i]['categories'])[$j]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            die("error");
        }

        $row = $result->fetch_assoc();
        $products[$i]['categoryName'][] = $row['Name'];
    }


    for($k = 0; $k < count(explode(",", $products[$i]['categories'])); $k++) {
        $categoriesId[] = explode(",", $products[$i]['categories'])[$k];
    }
}

$categoriesId = array_unique($categoriesId);
$categoriesId = array_values($categoriesId);
sort($categoriesId);

for($i = 0; $i < count($categoriesId); $i++) {
    $query = "SELECT Name FROM `categories` WHERE category_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $categoriesId[$i]);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        die("error");
    }

    $row = $result->fetch_assoc();
    $categories[] = $row['Name'];
}

$data = [
    'categories' => $categories,
    'products' => $products
];
  
header('Content-Type: application/json');
echo json_encode($data);

?>