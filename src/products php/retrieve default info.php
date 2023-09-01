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
$query = "SELECT Color, Size FROM `products` WHERE product_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("s", $productId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("The default size or color with ID $productId does not exist.");
}

$row = $result->fetch_assoc();
$defSizeId = $row['Size'];
$defColorId = $row['Color'];

$query = "SELECT `Name` FROM sizes WHERE size_id = ?";
$stmt = $conn->prepare($query);

// Bind the parameter
$stmt->bind_param("s", $defSizeId);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("The default size with ID $defSizeId does not exist.");
}

// Get the name of the default size
$row = $result->fetch_assoc();
$defSize = $row['Name'];

// Get the colors for the given size IDs
$query = "SELECT `Name` FROM `colors` WHERE `color_id` = ?";
$stmt = $conn->prepare($query);

$stmt->bind_param("s", $defColorId);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("The default color with ID $defColor does not exist.");
}

// Get the name of the default color
$row = $result->fetch_assoc();
$defColor = $row['Name'];
?>