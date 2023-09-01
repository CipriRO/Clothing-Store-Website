<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $name = $data['name'];
    $color = $data['color'];

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

    if($name !== "") {
      $query = "UPDATE `colors` SET Name = ?, `Color code` = ? WHERE color_id = ?";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("ssi", $name, $color, $id);
      $result = $stmt->execute();
    } else {
      $query = "UPDATE `colors` SET `Color code` = ? WHERE color_id = ?";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("si", $color, $id);
      $result = $stmt->execute();
    }

    if ($result === false) {
      echo json_encode(false);
    } else {
      echo json_encode(true);
    }

    $conn -> close();
?>