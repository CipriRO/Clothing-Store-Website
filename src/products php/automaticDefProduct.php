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

$query = "SELECT * FROM `products`";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

$falseParam = "false";
$trueParam = "true";

for($i = 0; $i < count($products); $i++) {
    $colorId = $products[$i]["Color"];
    $sizeId = $products[$i]["Size"];
    $productId = $products[$i]["product_id"];

    if($products[$i]['availability'] === "false") {
        $query = "SELECT quantity FROM `products info` WHERE product_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $quantities[] = $row['quantity'];
        }

        for($j = 0; $j < count($quantities); $j++) {
            if($quantities[$j] > 0) {
                $query = "UPDATE products SET availability = ? WHERE product_id = ?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("si", $trueParam, $productId);
                $stmt->execute();
            }
        }
    }

    $query = "SELECT quantity FROM `products info` WHERE product_id = ? AND color_id = ? AND size_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iii", $productId, $colorId, $sizeId);
    $stmt->execute();
    $result = $stmt->get_result();

    $row = $result->fetch_assoc();
    $quantity = $row['quantity'];

    if($quantity <= 0) {
        $query = "SELECT color_id, size_id, image, price FROM `products info` WHERE product_id = ? AND quantity > 0 LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            $query = "UPDATE products SET availability = ? WHERE product_id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("si", $falseParam, $productId);
            $stmt->execute();
        } else {
            $row = $result->fetch_assoc();
            $newColorId = $row['color_id'];
            $newSizeId = $row['size_id'];
            $newImage = $row['image'];
            $newPrice = $row['price'];

        $query = "UPDATE products SET Size = ?, Color = ?, image = ?, price = ? WHERE product_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iissi", $newSizeId, $newColorId, $newImage, $newPrice, $productId);
        $stmt->execute();
        }
    }
}

$conn->close();

?>