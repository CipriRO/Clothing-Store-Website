<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: PUT, GET, POST");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

  $data = json_decode(file_get_contents('php://input'), true);
  $user_id = $data;
  $ip_address = $_SERVER['REMOTE_ADDR'];

  $host = 'localhost';
  $username_db = 'root';
  $password_db = 'ciprianS26';
  $dbname = 'epiz_33174967_products';

  $db = mysqli_connect($host, $username_db, $password_db, $dbname);

  $query = "DELETE FROM `sessions` WHERE user_id = ? AND ip_address = ?";
  $stmt = $db->prepare($query);
  $stmt->bind_param("is", $user_id, $ip_address);
  $result = $stmt->execute();

  $db->close();
  $url = "http://192.168.1.17:5173/src/login/login.html";

  echo json_encode($url);
?>