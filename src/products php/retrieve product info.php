<?php

header("Content-Type: text/html; charset=UTF-8");

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

// Execute a SELECT query
$query = "SELECT color_id, size_id FROM `products info` WHERE product_id = ? AND quantity > 0";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $productId);
$stmt->execute();
$result = $stmt->get_result();

// Initialize an array to store the data
$sizes_id = array();
$colors_id = array();

// Iterate through the result set
while ($row = $result->fetch_assoc()) {
    // Add the row to the array
    $sizes_id[] = $row['size_id'];
    $colors_id[] = $row['color_id'];
}

// Check if the product exists
if (empty($sizes_id)) {
    die("Page not found!");
}
if (empty($colors_id)) {
    die("Page not found!");
}

// Get the sizes for the given size IDs
$query = "SELECT Name FROM sizes WHERE size_id IN (".implode(',', $sizes_id).")";

$result = $conn->query($query);

// Initialize an array to store the sizes
$sizes = array();

// Iterate through the result set
while ($row = $result->fetch_assoc()) {
    // Add the row to the array
    $sizes[] = $row['Name'];
}


// Get the colors for the given size IDs
$query = "SELECT `Name`, `Color code` FROM `colors` WHERE `color_id` IN (".implode(',', $colors_id).")";

$result = $conn->query($query);

// Initialize an array to store the colors
$colors = array();
$colorsCode = array();

// Iterate through the result set
while ($row = $result->fetch_assoc()) {
    // Add the row to the array
    $colors[] = $row['Name'];
    $colorsCode[] = $row['Color code'];
}

// Get the colors for the given size IDs
$query = "SELECT `id`, `image` FROM `products info` WHERE product_id = '".$productId."'";

$result = $conn->query($query);

// Initialize an array to store the colors
$images = array();
$productInfoId = array();

// Iterate through the result set
while ($row = $result->fetch_assoc()) {
    // Add the row to the array
    $productInfoId[] = $row['id'];
    $images[] = $row['image'];
}
?>