<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: PUT, GET, POST");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

  $data = json_decode(file_get_contents('php://input'), true);
  $form_id = $data;

  $host = 'localhost';
  $username_db = 'root';
  $password_db = 'ciprianS26';
  $dbname = 'epiz_33174967_products';

  $db = mysqli_connect($host, $username_db, $password_db, $dbname);

  $query = "DELETE FROM `contact_forms` WHERE id = ?";
  $stmt = $db->prepare($query);
  $stmt->bind_param("i", $form_id);
  $result = $stmt->execute();

  if ($result && $stmt->affected_rows > 0) {
    $data = true;
  } else {
    $data = false;
  }

  header('Content-Type: application/json');
  echo json_encode($data);

  $db->close();
?>