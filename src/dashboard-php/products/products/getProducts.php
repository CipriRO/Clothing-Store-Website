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

  $query = "SELECT * FROM `colors`";
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

  $query = "SELECT color_id FROM `products info`";
  $stmt = $conn->prepare($query);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 0) {
    for($i = 0; $i < count($data); $i++) {
      $data['delete'] = true;
    }
    $conn->close();
    exit();
  }

  $colors = array();

  while ($row = $result->fetch_assoc()) {
    $colors[] = $row['color_id'];
  }

  for($j = 0; $j < count($colors); $j++) {
    for($l = 0; $l <  count($data); $l++) {
      if($data[$l]['color_id'] == $colors[$j]) {
        $data[$l]['delete'] = false;
      }
    }

    for($m = 0; $m < count($data); $m++) {
      $data[$m]['edit'] = false;
      !array_key_exists('delete', $data[$m]) && $data[$m]['delete'] = true;
    }
  }

  echo json_encode($data);

  $conn->close();
?>