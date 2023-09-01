<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $productId = $_POST['productId'];
    $size = $_POST['size'];
    $color = $_POST['color'];

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

    $query = "SELECT id FROM `products info` WHERE product_id = ? AND size_id = ? AND color_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iii", $productId, $size, $color);
    $stmt->execute();
    $result = $stmt->get_result();

    $row = $result->fetch_assoc();
    $id = $row['id'];
    
    header('Content-Type: application/json');
    echo json_encode($id);
?>