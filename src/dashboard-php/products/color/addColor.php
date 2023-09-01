<?php

  header('Access-Control-Allow-Origin: http://192.168.1.17:5173');
  header('Access-Control-Allow-Methods: PUT, GET, POST');
  header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

  $name = $_POST['name'];
  $color = $_POST['color'];
  
    $error_message = "-------------------------Array content: " . print_r($data, true);
  
   error_log($error_message);

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

    $query = "INSERT INTO colors (`Name`, `Color code`) VALUES (?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $name, $color);
    $success = $stmt->execute();

    if (!$success) {
      echo json_encode(false);
      $conn -> close();
      exit();
    }

    $query = "SELECT color_id FROM `colors` WHERE Name = ? ORDER BY color_id DESC LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $data = $row['color_id'];

    echo json_encode($data);
    $conn -> close();
?>