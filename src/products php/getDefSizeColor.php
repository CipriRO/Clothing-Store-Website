<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);


    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data;

    if ($productId === null) {
        die('error');
    }

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

    $query = "SELECT Size, Color FROM `products` WHERE product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        die("error");
    }

    $row = $result->fetch_assoc();
    $info = $row['Size'] . ',' . $row['Color'];

    header('Content-Type: application/json');
    echo json_encode($info);

    $conn->close();
?>