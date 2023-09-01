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

  $query = "SELECT * FROM `categories`";
  $stmt = $conn->prepare($query);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 0) {
    echo json_encode("empty");
    $conn->close();
    exit();
  }

  $data = array();

  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  $query = "SELECT `Value` FROM `settings` WHERE setting_id = '1'";
  $stmt = $conn->prepare($query);
  $stmt->execute();
  $result = $stmt->get_result();
  $row = $result->fetch_assoc();
  $displayedCateg = explode(',', $row['Value']);

  for($i = 0; $i < count($data); $i++) {
    for($j = 0; $j < count($displayedCateg); $j++) {
      $data[$i]['id'] == $displayedCateg[$j] && $data[$i]['displayed'] = true;
    }
  }

  for($k = 0; $k < count($data); $k++) {
    !array_key_exists('displayed', $data[$k]) && $data[$k]['displayed'] = false;
  }

  echo json_encode($data);

  $conn->close();
?>