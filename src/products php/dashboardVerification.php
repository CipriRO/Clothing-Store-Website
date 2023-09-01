<?php
  header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: PUT, GET, POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    $data = json_decode(file_get_contents('php://input'), true);
    $session_id = $data;

    $host = 'localhost';
    $username_db = 'root';
    $password_db = 'ciprianS26';
    $dbname = 'epiz_33174967_products';

    $db = mysqli_connect($host, $username_db, $password_db, $dbname);

      $session_data_query = "SELECT * FROM sessions WHERE session_id = '$session_id'";
      $session_data_result = mysqli_query($db, $session_data_query);
      $session_data = mysqli_fetch_assoc($session_data_result);
  
      if (!$session_data) {
        $db->close();
        $data = array();
        $data['status'] = false;
        $data['url'] = "http://192.168.1.17:5173/src/login/login.html";
        echo json_encode($data);
        exit();
      } else {
        $userId = $session_data['user_id'];
        $username_query = "SELECT id, username FROM admins WHERE id = '$userId'";
        $username_result = mysqli_query($db, $username_query);
        $data = mysqli_fetch_assoc($username_result);
        echo json_encode($data);
        $db->close();
        exit();
      }
      $db->close();
?>