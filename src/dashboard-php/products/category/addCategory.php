<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $name = $_POST['name'];

    // Connection details
    $host = 'localhost';
    $db_username = 'root';
    $db_password = 'ciprianS26';
    $dbname = 'epiz_33174967_products';

    // Create connection
    $conn = new mysqli($host, $db_username, $db_password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = "INSERT INTO categories (name) VALUES (?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $name);
    $success = $stmt->execute();

    if (!$success) {
      echo json_encode(false);
      $conn -> close();
      exit();
    }

    $query = "SELECT id FROM `categories` WHERE name = ? ORDER BY id DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $data = $row['id'];

    echo json_encode($data);
    $conn -> close();
?>