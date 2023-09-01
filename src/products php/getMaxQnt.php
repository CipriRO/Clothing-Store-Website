<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $productId = $_POST['productId'];
    $sizeId = $_POST['sizeId'];
    $colorId = $_POST['colorId'];

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

    $query = "SELECT quantity FROM `products info` WHERE product_id = ? AND size_id = ? AND color_id = ? AND quantity > 0";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iii", $productId, $sizeId, $colorId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $data = null;
    } else {
        $row = $result->fetch_assoc();
        $data = $row['quantity'];
    }    
    
    header('Content-Type: application/json');
    echo json_encode($data);
?>