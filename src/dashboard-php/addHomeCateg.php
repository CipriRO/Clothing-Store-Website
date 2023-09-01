<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $status = $data['add'];

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

    $query = "SELECT `Value` FROM `settings` WHERE setting_id = '1'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $displayedCateg = explode(',', $row['Value']);

    if($status === 'no') {
      print_r($displayedCateg);
      $displayedCateg[0] == "" ? $displayedCateg[0] = $id : $displayedCateg[] = $id;
      $displayedCateg = array_unique($displayedCateg);
      $displayedCateg = array_reverse($displayedCateg, true);
      $displayedCateg = array_values($displayedCateg);
    } else {
      $key = array_search($id, $displayedCateg);
      if ($key !== false) {
        unset($displayedCateg[$key]);
        $displayedCateg = array_values($displayedCateg);
        $displayedCateg = array_unique($displayedCateg);
      }
    }

    $categ = implode(',', $displayedCateg);
    
    $nr = 1;

    $query = "UPDATE `settings` SET Value = ? WHERE setting_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $categ, $nr);
    $stmt->execute();

    $conn -> close();
?>